import { useState } from 'react'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'
import { useFundraising } from './useFundraising'

type DonateArgs = {
  fundraiserId: bigint
  amount: string // in MATIC
}

export const useDonate = (onConfirmed?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { donate: donateToContract, hash, isPending, isConfirming, isSuccess, error } = useFundraising()

  const donate = async ({ fundraiserId, amount }: DonateArgs) => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Nominal donasi belum diisi.')
      return
    }

    setIsSubmitting(true)

    try {
      await donateToContract(fundraiserId, amount)
      toast.success('Transaksi donasi berhasil dikirim!')
    } catch (err) {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengirim donasi.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Watch for transaction success
  if (isSuccess && onConfirmed) {
    onConfirmed()
  }

  return {
    donate,
    hash,
    isSubmitting: isSubmitting || isPending || isConfirming,
    error,
    isSuccess,
  }
}



