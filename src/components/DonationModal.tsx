import { useState, useEffect } from 'react'
import { XCircle, ExternalLink, Wallet } from 'lucide-react'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'

import type { FundraiserFromContract } from '../types'
import { POLYGON_SCAN_BASE } from '../lib/constants'
import { useDonate } from '../hooks/useDonate'
import { useFundraiser, useFundraising } from '../hooks/useFundraising'

type Props = {
  fundraiser: FundraiserFromContract | null
  onClose: () => void
  onDonationSuccess?: () => void
}

export const DonationModal = ({ fundraiser, onClose, onDonationSuccess }: Props) => {
  const [amount, setAmount] = useState('')
  const [previousRaisedAmount, setPreviousRaisedAmount] = useState<bigint | null>(null)
  const fundraiserId = fundraiser?.id || null
  const { address } = useAccount()

  // Fetch latest fundraiser data
  const { fundraiser: contractData, refetch } = useFundraiser(fundraiserId)
  const { withdrawFunds, hash: withdrawHash, isPending: isWithdrawing, isSuccess: isWithdrawSuccess } = useFundraising()

  // Use the contract data if available, otherwise fall back to prop
  const displayFundraiser = contractData ? {
    ...fundraiser!,
    raisedAmount: contractData.raisedAmount,
    targetAmount: contractData.targetAmount,
    name: contractData.name,
    location: contractData.location,
    description: contractData.description,
    owner: contractData.owner,
    recipient: contractData.recipient,
  } : fundraiser

  // Check if current user is the fundraiser owner
  const isOwner = address && displayFundraiser?.owner && address.toLowerCase() === displayFundraiser.owner.toLowerCase()
  const hasFunds = displayFundraiser?.raisedAmount && displayFundraiser.raisedAmount > BigInt(0)

  const { donate, hash, isSubmitting, isSuccess } = useDonate(() => {
    if (onDonationSuccess) {
      onDonationSuccess()
    }
    // Refetch after a short delay to allow blockchain to process
    setTimeout(() => {
      refetch().then(() => {
        // Check if auto-transfer occurred (raisedAmount became 0 after donation)
        // This will be checked in useEffect below
      })
    }, 1000)
    setAmount('')
    toast.success('Donasi berhasil!')
    setTimeout(() => {
      onClose()
    }, 3000) // Give more time to detect auto-transfer
  })

  useEffect(() => {
    if (isWithdrawSuccess) {
      refetch()
      toast.success('Penarikan dana berhasil!')
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [isWithdrawSuccess, refetch, onClose])

  // Store previous raisedAmount before donation
  useEffect(() => {
    if (contractData?.raisedAmount !== undefined) {
      setPreviousRaisedAmount(contractData.raisedAmount)
    }
  }, [contractData?.raisedAmount])

  // Detect auto-transfer after successful donation
  useEffect(() => {
    if (isSuccess && contractData && previousRaisedAmount !== null) {
      // Wait for blockchain to process
      setTimeout(() => {
        refetch().then(() => {
          // Check will happen in next render when contractData updates
        })
      }, 2000)
    }
  }, [isSuccess, refetch])

  // Check if auto-transfer occurred (raisedAmount became 0 after donation)
  useEffect(() => {
    if (contractData && previousRaisedAmount !== null && previousRaisedAmount > BigInt(0)) {
      const currentRaisedAmount = contractData.raisedAmount || BigInt(0)
      const targetAmount = contractData.targetAmount || BigInt(1)
      
      // If raisedAmount dropped to 0 and we had funds before, auto-transfer occurred
      if (currentRaisedAmount === BigInt(0) && previousRaisedAmount > BigInt(0) && targetAmount > BigInt(0)) {
        const recipient = displayFundraiser?.recipient || contractData.recipient
        toast.success(
          `🎉 Target tercapai! Dana ${formatEther(previousRaisedAmount)} MATIC otomatis dikirim ke ${recipient?.slice(0, 6)}...${recipient?.slice(-4)}`,
          { duration: 6000 }
        )
        setPreviousRaisedAmount(BigInt(0)) // Reset to prevent duplicate notifications
      }
    }
  }, [contractData, previousRaisedAmount, displayFundraiser?.recipient])

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

  const handleWithdraw = async () => {
    if (!fundraiserId) return
    
    try {
      await withdrawFunds(fundraiserId)
    } catch (error: any) {
      if (error?.message?.includes('Only fundraiser owner')) {
        toast.error('Hanya owner fundraiser yang bisa menarik dana')
      } else if (error?.message?.includes('No funds')) {
        toast.error('Tidak ada dana yang bisa ditarik')
      } else {
        toast.error('Gagal menarik dana: ' + (error?.message || 'Unknown error'))
      }
    }
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
          {isOwner && (
            <div className="mt-3 rounded-xl bg-amber-50 p-3 border border-amber-200">
              <p className="font-semibold text-amber-800 text-xs">Anda adalah Owner Fundraiser ini</p>
              <p className="text-xs text-amber-700 mt-1">
                Anda dapat menarik dana yang terkumpul ke alamat penerima: {displayFundraiser.recipient}
              </p>
            </div>
          )}
        </div>

        {/* Withdraw Button - Only visible to owner */}
        {isOwner && hasFunds && (
          <button
            onClick={handleWithdraw}
            className="mt-4 w-full rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            disabled={isWithdrawing}
          >
            <Wallet size={18} />
            {isWithdrawing
              ? 'Menarik dana...'
              : `Tarik ${raisedAmount.toFixed(3)} MATIC ke Penerima`}
          </button>
        )}

        {/* Donate Button */}
        <button
          onClick={handleDonate}
          className="mt-4 w-full rounded-full bg-success px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!amount || Number(amount) <= 0 || isSubmitting}
        >
          {isSubmitting
            ? 'Menunggu konfirmasi...'
            : 'Donate MATIC'}
        </button>

        {(hash || withdrawHash) && (
          <a
            href={`${POLYGON_SCAN_BASE}/${hash || withdrawHash}`}
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


