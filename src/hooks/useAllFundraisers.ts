import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { FUNDRAISING_CONTRACT_ADDRESS } from '../lib/constants'
import { fundraisingAbi } from '../lib/abi'
import { useFundraiserCount } from './useFundraising'
import type { FundraiserFromContract } from '../types'

export const useAllFundraisers = () => {
  const { count } = useFundraiserCount()
  const [fundraisers, setFundraisers] = useState<FundraiserFromContract[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (count === 0) {
      setFundraisers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    // Fetch each fundraiser individually
    // In a production app, you might want to batch these or use a different approach
    const fetchPromises: Promise<void>[] = []

    for (let i = 1; i <= count; i++) {
      const promise = fetchFundraiser(BigInt(i))
      fetchPromises.push(promise)
    }

    Promise.all(fetchPromises)
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error('Error fetching fundraisers:', err)
        setIsLoading(false)
      })
  }, [count])

  const fetchFundraiser = async (id: bigint): Promise<void> => {
    // This is a simplified approach - in reality, you'd use wagmi's hooks
    // For now, we'll use a workaround with direct contract reads
    try {
      // We'll need to use wagmi's useReadContract in a different way
      // For now, return a placeholder that will be updated by the component
      return Promise.resolve()
    } catch (err) {
      console.error(`Error fetching fundraiser ${id}:`, err)
      return Promise.resolve()
    }
  }

  return {
    fundraisers,
    isLoading,
    count,
  }
}
