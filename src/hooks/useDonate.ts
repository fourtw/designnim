import { useState } from 'react'
import { parseEther, parseUnits, type Hex } from 'viem'
import { useSendTransaction, useWriteContract } from 'wagmi'
import toast from 'react-hot-toast'

import { DONATION_SAFE_ADDRESS, USDT_CONTRACT_ADDRESS } from '../lib/constants'
import type { DonationToken } from '../lib/constants'
import { erc20Abi } from '../lib/abi'

type DonateArgs = {
  token: DonationToken
  amount: string
  recipient?: `0x${string}`
}

export const useDonate = (onConfirmed?: () => void) => {
  const [pendingHash, setPendingHash] = useState<Hex | null>(null)
  const [currentToken, setCurrentToken] = useState<DonationToken>('MATIC')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { sendTransactionAsync } = useSendTransaction()
  const { writeContractAsync } = useWriteContract()

  const donate = async ({ token, amount, recipient }: DonateArgs) => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Nominal donasi belum diisi.')
      return
    }

    const destination = recipient ?? DONATION_SAFE_ADDRESS
    setCurrentToken(token)
    setIsSubmitting(true)

    try {
      if (token === 'MATIC') {
        const hash = await sendTransactionAsync({
          to: destination,
          value: parseEther(amount),
        })
        setPendingHash(hash)
        toast.success('MATIC berhasil dikirim ke panti.')
        onConfirmed?.()
        return
      }

      const parsedAmount = parseUnits(amount, 6)
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: USDT_CONTRACT_ADDRESS,
        functionName: 'transfer',
        args: [destination, parsedAmount],
      })
      setPendingHash(hash)
      toast.success('USDT berhasil dikirim ke panti.')
      onConfirmed?.()
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengirim donasi. Coba cek wallet Anda.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    donate,
    pendingHash,
    currentToken,
    isSubmitting,
  }
}



