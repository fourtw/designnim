import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { FUNDRAISING_CONTRACT_ADDRESS } from '../lib/constants'
import { fundraisingAbi } from '../lib/abi'
import { useAccount } from 'wagmi'

export type FundraiserData = {
  id: bigint
  owner: `0x${string}`
  name: string
  location: string
  description: string
  targetAmount: bigint
  raisedAmount: bigint
  isActive: boolean
  createdAt: bigint
  recipient: `0x${string}`
}

export type DonationData = {
  donor: `0x${string}`
  amount: bigint
  timestamp: bigint
  fundraiserId: bigint
}

export const useFundraising = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createFundraiser = async (
    name: string,
    location: string,
    description: string,
    targetAmount: string, // in MATIC
    recipient: `0x${string}`
  ) => {
    // Validate contract address
    if (FUNDRAISING_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      throw new Error('Smart contract belum di-deploy! Silakan set VITE_FUNDRAISING_CONTRACT_ADDRESS di .env file.')
    }

    try {
      const targetAmountWei = parseEther(targetAmount)
      
      console.log('Calling createFundraiser with:', {
        address: FUNDRAISING_CONTRACT_ADDRESS,
        name,
        location,
        description,
        targetAmountWei: targetAmountWei.toString(),
        recipient,
      })

      const txHash = await writeContract({
        address: FUNDRAISING_CONTRACT_ADDRESS,
        abi: fundraisingAbi,
        functionName: 'createFundraiser',
        args: [name, location, description, targetAmountWei, recipient],
      })
      
      console.log('Transaction hash received:', txHash)
      return txHash
    } catch (err: any) {
      console.error('Error in createFundraiser:', err)
      
      // Provide more specific error messages
      if (err?.message?.includes('contract') || err?.code === 'CALL_EXCEPTION') {
        throw new Error('Smart contract tidak ditemukan atau belum di-deploy. Pastikan contract address benar di .env file.')
      }
      
      throw err
    }
  }

  const donate = async (fundraiserId: bigint, amount: string) => {
    try {
      const amountWei = parseEther(amount)
      const txHash = await writeContract({
        address: FUNDRAISING_CONTRACT_ADDRESS,
        abi: fundraisingAbi,
        functionName: 'donate',
        args: [fundraiserId],
        value: amountWei,
      })
      return txHash
    } catch (err) {
      console.error('Error donating:', err)
      throw err
    }
  }

  const withdrawFunds = async (fundraiserId: bigint) => {
    try {
      const txHash = await writeContract({
        address: FUNDRAISING_CONTRACT_ADDRESS,
        abi: fundraisingAbi,
        functionName: 'withdrawFunds',
        args: [fundraiserId],
      })
      return txHash
    } catch (err) {
      console.error('Error withdrawing funds:', err)
      throw err
    }
  }

  return {
    createFundraiser,
    donate,
    withdrawFunds,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export const useFundraiser = (fundraiserId: bigint | null) => {
  const isContractDeployed = FUNDRAISING_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: FUNDRAISING_CONTRACT_ADDRESS,
    abi: fundraisingAbi,
    functionName: 'getFundraiser',
    args: fundraiserId !== null ? [fundraiserId] : undefined,
    query: {
      enabled: fundraiserId !== null && isContractDeployed,
    },
  })

  return {
    fundraiser: data as FundraiserData | undefined,
    isLoading,
    error,
    refetch,
  }
}

export const useFundraiserCount = () => {
  const isContractDeployed = FUNDRAISING_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
  
  const { data, isLoading, error, refetch } = useReadContract({
    address: FUNDRAISING_CONTRACT_ADDRESS,
    abi: fundraisingAbi,
    functionName: 'getNextFundraiserId',
    query: {
      enabled: isContractDeployed,
      refetchInterval: 5000, // Refetch every 5 seconds to catch new fundraisers
    },
  })

  return {
    count: data ? Number(data) - 1 : 0, // Subtract 1 because nextId is the next available ID
    isLoading: isLoading && isContractDeployed,
    error,
    refetch,
  }
}

export const useDonations = (fundraiserId: bigint | null, limit: number = 10) => {
  const { data, isLoading, error, refetch } = useReadContract({
    address: FUNDRAISING_CONTRACT_ADDRESS,
    abi: fundraisingAbi,
    functionName: 'getDonations',
    args: fundraiserId !== null ? [fundraiserId, BigInt(0), BigInt(limit)] : undefined,
    query: {
      enabled: fundraiserId !== null,
    },
  })

  return {
    donations: (data || []) as DonationData[],
    isLoading,
    error,
    refetch,
  }
}
