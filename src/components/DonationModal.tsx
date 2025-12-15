import { useState, useEffect } from 'react'
import { XCircle, ExternalLink } from 'lucide-react'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'

import type { FundraiserFromContract } from '../types'
import { POLYGON_SCAN_BASE } from '../lib/constants'
import { useDonate } from '../hooks/useDonate'
import { useFundraiser } from '../hooks/useFundraising'

type Props = {
  fundraiser: FundraiserFromContract | null
  onClose: () => void
  onDonationSuccess?: () => void
}

export const DonationModal = ({ fundraiser, onClose, onDonationSuccess }: Props) => {
  const [amount, setAmount] = useState('')
  const fundraiserId = fundraiser?.id || null

  // Fetch latest fundraiser data
  const { fundraiser: contractData, refetch } = useFundraiser(fundraiserId)

  // Use the contract data if available, otherwise fall back to prop
  const displayFundraiser = contractData ? {
    ...fundraiser!,
    raisedAmount: contractData.raisedAmount,
    targetAmount: contractData.targetAmount,
    name: contractData.name,
    location: contractData.location,
    description: contractData.description,
  } : fundraiser

  const { donate, hash, isSubmitting, isSuccess } = useDonate(() => {
    if (onDonationSuccess) {
      onDonationSuccess()
    }
    refetch() // Refresh fundraiser data
    setAmount('')
    toast.success('Donasi berhasil!')
    setTimeout(() => {
      onClose()
    }, 2000)
  })

  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess, refetch])

  if (!displayFundraiser || !fundraiserId) return null

  const handleDonate = () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Masukkan jumlah donasi yang valid')
      return
    }
    donate({
      fundraiserId,
      amount,
    })
  }

  const raisedAmount = Number(formatEther(displayFundraiser.raisedAmount || BigInt(0)))
  const targetAmount = Number(formatEther(displayFundraiser.targetAmount || BigInt(1)))
  const progress = Math.min((raisedAmount / targetAmount) * 100, 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-8 backdrop-blur">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative">
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          onClick={onClose}
          aria-label="Tutup"
        >
          <XCircle size={24} />
        </button>
        <p className="text-xs uppercase tracking-[0.4em] text-brand-primary">
          Donasi sekarang
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
          {displayFundraiser.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{displayFundraiser.location}</p>

        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>{raisedAmount.toFixed(3)} MATIC terkumpul</span>
            <span>Target {targetAmount.toFixed(3)} MATIC</span>
          </div>
          <div className="mt-2 h-3 rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary to-success"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-slate-700">
            Nominal Donasi (MATIC)
            <input
              type="number"
              min="0"
              step="0.001"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Contoh: 1.5"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Detail</p>
          <p>Penerima: {displayFundraiser.recipient || 'N/A'}</p>
          <p className="mt-1">{displayFundraiser.description}</p>
        </div>

        <button
          onClick={handleDonate}
          className="mt-6 w-full rounded-full bg-success px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!amount || Number(amount) <= 0 || isSubmitting}
        >
          {isSubmitting
            ? 'Menunggu konfirmasi...'
            : 'Donate MATIC'}
        </button>

        {hash && (
          <a
            href={`${POLYGON_SCAN_BASE}/${hash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-brand-primary"
          >
            Lihat transaksi di explorer
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  )
}


