import { useState, useEffect } from 'react'
import { XCircle, Plus, Copy, Check } from 'lucide-react'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'

import { useFundraising } from '../hooks/useFundraising'
import { isContractDeployed, FUNDRAISING_CONTRACT_ADDRESS } from '../lib/constants'

type Props = {
  onClose: () => void
  onSuccess?: () => void
}

export const CreateFundraiserForm = ({ onClose, onSuccess }: Props) => {
  const { address } = useAccount()
  const { createFundraiser, isPending, isConfirming, isSuccess, hash, error } = useFundraising()

  // Handle success
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Fundraiser berhasil dibuat!')
      if (onSuccess) {
        onSuccess()
      }
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  }, [isSuccess, hash, onSuccess, onClose])

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    targetAmount: '',
    recipient: '', // Don't default to owner address
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warnings, setWarnings] = useState<Record<string, string>>({})
  const [copiedAddress, setCopiedAddress] = useState(false)

  // Account #3 address (from Hardhat default accounts)
  const ACCOUNT_3_ADDRESS = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'

  // Don't auto-fill recipient with owner address
  // User must explicitly enter recipient address (should be Account #3)
  
  const copyAccount3Address = () => {
    navigator.clipboard.writeText(ACCOUNT_3_ADDRESS)
    setCopiedAddress(true)
    toast.success('Alamat Account #3 berhasil di-copy!')
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama panti jompo wajib diisi'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi wajib diisi'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi'
    }
    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target jumlah harus lebih dari 0'
    }
    if (!formData.recipient || !/^0x[a-fA-F0-9]{40}$/.test(formData.recipient)) {
      newErrors.recipient = 'Alamat wallet penerima tidak valid'
    }

    // Check if recipient is the same as owner
    if (address && formData.recipient.toLowerCase() === address.toLowerCase()) {
      newErrors.recipient = 'Alamat penerima tidak boleh sama dengan alamat owner (wallet Anda)'
    }

    setErrors(newErrors)
    
    // Set warnings
    const newWarnings: Record<string, string> = {}
    if (address && formData.recipient && formData.recipient.toLowerCase() === address.toLowerCase()) {
      newWarnings.recipient = '⚠️ Peringatan: Alamat penerima sama dengan owner. Dana akan kembali ke wallet Anda, bukan ke panti jompo!'
    }
    setWarnings(newWarnings)
    
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address) {
      toast.error('Silakan hubungkan wallet terlebih dahulu')
      return
    }

    // Final check: prevent owner = recipient
    if (formData.recipient.toLowerCase() === address.toLowerCase()) {
      toast.error('Alamat penerima tidak boleh sama dengan wallet owner Anda! Gunakan alamat Account #3 sebagai penerima.', { duration: 6000 })
      return
    }

    if (!validate()) {
      toast.error('Mohon lengkapi semua field dengan benar')
      return
    }

    // Check if contract is deployed
    if (!isContractDeployed) {
      toast.error(
        'Smart contract belum di-deploy! Silakan deploy contract terlebih dahulu. Lihat DEPLOYMENT.md untuk instruksi.',
        { duration: 5000 }
      )
      console.error('Contract address:', FUNDRAISING_CONTRACT_ADDRESS)
      return
    }

    try {
      console.log('Creating fundraiser with data:', {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        targetAmount: formData.targetAmount,
        recipient: formData.recipient,
        contractAddress: FUNDRAISING_CONTRACT_ADDRESS,
      })

      const txHash = await createFundraiser(
        formData.name,
        formData.location,
        formData.description,
        formData.targetAmount,
        formData.recipient as `0x${string}`
      )
      
      if (txHash) {
        toast.success('Transaksi dikirim! Menunggu konfirmasi...')
        console.log('Transaction hash:', txHash)
        // Wait for transaction confirmation
        // The isSuccess from useFundraising will handle the rest
      }
    } catch (err: any) {
      console.error('Error creating fundraiser:', err)
      const errorMessage = err?.message || 'Gagal membuat fundraiser.'
      
      // Check for specific error types
      if (errorMessage.includes('user rejected') || errorMessage.includes('User rejected')) {
        toast.error('Transaksi ditolak. Silakan approve di MetaMask.')
      } else if (errorMessage.includes('insufficient funds') || errorMessage.includes('insufficient balance')) {
        toast.error('Saldo tidak cukup untuk gas fee. Pastikan wallet memiliki cukup MATIC.')
      } else if (errorMessage.includes('contract') && errorMessage.includes('not deployed')) {
        toast.error('Smart contract belum di-deploy! Silakan deploy contract terlebih dahulu.')
      } else if (errorMessage.includes('execution reverted')) {
        toast.error('Transaksi gagal. Pastikan semua data valid dan contract sudah di-deploy.')
        console.error('Execution reverted. Full error:', err)
      } else {
        toast.error(`Gagal membuat fundraiser: ${errorMessage}`, { duration: 5000 })
      }
    }
  }

  const handleChange = (field: string, value: string) => {
    // Force immediate state update
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      return updated
    })
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // Debug: Log formData changes
  useEffect(() => {
    console.log('Form data updated:', formData)
  }, [formData])

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-8 backdrop-blur overflow-y-auto"
      onClick={(e) => {
        // Close modal when clicking on backdrop (not on form content)
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl relative my-8"
        onClick={(e) => {
          // Prevent backdrop click from closing modal when clicking inside form
          e.stopPropagation()
        }}
      >
        <button
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
          onClick={onClose}
          aria-label="Tutup"
        >
          <XCircle size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-brand-primary/10 p-2">
            <Plus className="text-brand-primary" size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-primary">
              Buat Fundraiser Baru
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">
              Kampanye Panti Jompo
            </h3>
          </div>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama Panti Jompo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fundraiser-name"
              name="name"
              value={formData.name}
              onChange={(e) => {
                const newValue = e.target.value
                setFormData((prev) => ({ ...prev, name: newValue }))
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: '' }))
                }
              }}
              placeholder="Contoh: Panti Jompo Harapan"
              disabled={isPending || isConfirming}
              autoComplete="off"
              autoFocus={false}
              readOnly={false}
              className={`w-full rounded-2xl border px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-slate-200 focus:border-brand-primary focus:ring-brand-primary/20'
              } ${isPending || isConfirming ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ 
                color: '#0f172a',
                WebkitTextFillColor: '#0f172a',
                backgroundColor: '#ffffff'
              }}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Lokasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fundraiser-location"
              name="location"
              value={formData.location}
              onChange={(e) => {
                const newValue = e.target.value
                setFormData((prev) => ({ ...prev, location: newValue }))
                if (errors.location) {
                  setErrors((prev) => ({ ...prev, location: '' }))
                }
              }}
              placeholder="Contoh: Bandung, Jawa Barat"
              disabled={isPending || isConfirming}
              autoComplete="off"
              readOnly={false}
              className={`w-full rounded-2xl border px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                errors.location
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-slate-200 focus:border-brand-primary focus:ring-brand-primary/20'
              } ${isPending || isConfirming ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ 
                color: '#0f172a',
                WebkitTextFillColor: '#0f172a',
                backgroundColor: '#ffffff'
              }}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-500">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              id="fundraiser-description"
              name="description"
              value={formData.description}
              onChange={(e) => {
                const newValue = e.target.value
                setFormData((prev) => ({ ...prev, description: newValue }))
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: '' }))
                }
              }}
              placeholder="Jelaskan tujuan fundraiser, kebutuhan panti jompo, dan dampak yang diharapkan..."
              rows={4}
              disabled={isPending || isConfirming}
              autoComplete="off"
              readOnly={false}
              className={`w-full rounded-2xl border px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:ring-2 resize-none ${
                errors.description
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-slate-200 focus:border-brand-primary focus:ring-brand-primary/20'
              } ${isPending || isConfirming ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ 
                color: '#0f172a',
                WebkitTextFillColor: '#0f172a',
                backgroundColor: '#ffffff'
              }}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Target Jumlah (MATIC) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="fundraiser-target"
              name="targetAmount"
              min="0"
              step="0.001"
              value={formData.targetAmount}
              onChange={(e) => {
                const newValue = e.target.value
                setFormData((prev) => ({ ...prev, targetAmount: newValue }))
                if (errors.targetAmount) {
                  setErrors((prev) => ({ ...prev, targetAmount: '' }))
                }
              }}
              placeholder="Contoh: 10.5"
              disabled={isPending || isConfirming}
              autoComplete="off"
              readOnly={false}
              className={`w-full rounded-2xl border px-4 py-3 text-base text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                errors.targetAmount
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-slate-200 focus:border-brand-primary focus:ring-brand-primary/20'
              } ${isPending || isConfirming ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ 
                color: '#0f172a',
                WebkitTextFillColor: '#0f172a',
                backgroundColor: '#ffffff'
              }}
            />
            {errors.targetAmount && (
              <p className="mt-1 text-xs text-red-500">{errors.targetAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Alamat Wallet Penerima <span className="text-red-500">*</span>
              <button
                type="button"
                onClick={copyAccount3Address}
                className="ml-2 inline-flex items-center gap-1 text-xs text-brand-primary hover:text-brand-dark font-normal"
              >
                {copiedAddress ? (
                  <>
                    <Check size={12} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Account #3</span>
                  </>
                )}
              </button>
            </label>
            <input
              type="text"
              id="fundraiser-recipient"
              name="recipient"
              value={formData.recipient}
              onChange={(e) => {
                const newValue = e.target.value
                setFormData((prev) => ({ ...prev, recipient: newValue }))
                
                // Clear errors
                if (errors.recipient) {
                  setErrors((prev) => ({ ...prev, recipient: '' }))
                }
                
                // Real-time warning if recipient = owner
                if (address && newValue.toLowerCase() === address.toLowerCase()) {
                  setWarnings((prev) => ({
                    ...prev,
                    recipient: '⚠️ Peringatan: Alamat penerima sama dengan owner. Dana akan kembali ke wallet Anda, bukan ke panti jompo!'
                  }))
                } else {
                  setWarnings((prev) => {
                    const newWarnings = { ...prev }
                    delete newWarnings.recipient
                    return newWarnings
                  })
                }
              }}
              placeholder="0x..."
              disabled={isPending || isConfirming}
              autoComplete="off"
              readOnly={false}
              className={`w-full rounded-2xl border px-4 py-3 text-base font-mono text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 ${
                errors.recipient
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-slate-200 focus:border-brand-primary focus:ring-brand-primary/20'
              } ${isPending || isConfirming ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ 
                color: '#0f172a',
                WebkitTextFillColor: '#0f172a',
                backgroundColor: '#ffffff'
              }}
            />
            {errors.recipient && (
              <p className="mt-1 text-xs text-red-500">{errors.recipient}</p>
            )}
            {warnings.recipient && !errors.recipient && (
              <p className="mt-1 text-xs text-amber-600 font-semibold">{warnings.recipient}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              💡 Gunakan alamat Account #3 sebagai penerima. Jalankan <code className="bg-slate-100 px-1 rounded">npm run accounts</code> untuk melihat address Account #3.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Alamat wallet yang akan menerima dana donasi
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending || isConfirming || !address}
              className="flex-1 rounded-full bg-brand-primary px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending || isConfirming
                ? 'Membuat...'
                : isSuccess
                ? 'Berhasil!'
                : 'Buat Fundraiser'}
            </button>
          </div>

          {!address && (
            <p className="text-center text-sm text-amber-600">
              Silakan hubungkan wallet terlebih dahulu untuk membuat fundraiser
            </p>
          )}

          {!isContractDeployed && (
            <div className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                ⚠️ Smart Contract Belum Di-Deploy
              </p>
              <p className="mt-1 text-xs text-red-700">
                Smart contract harus di-deploy terlebih dahulu sebelum bisa membuat fundraiser.
                Silakan deploy contract menggunakan: <code className="bg-red-100 px-1 rounded">npm run deploy:amoy</code>
              </p>
              <p className="mt-2 text-xs text-red-600">
                Contract Address saat ini: {FUNDRAISING_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' ? 'Belum di-set' : FUNDRAISING_CONTRACT_ADDRESS}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
