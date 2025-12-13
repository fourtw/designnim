import { useEffect, useState } from 'react'
import { XCircle, ExternalLink } from 'lucide-react'

import type { Fundraiser } from '../types'
import type { DonationToken } from '../lib/constants'
import { POLYGON_SCAN_BASE } from '../lib/constants'
import { useDonate } from '../hooks/useDonate'

type Props = {
  fundraiser: Fundraiser | null
  onClose: () => void
  onDonationSuccess: (fundraiserId: string, token: DonationToken, amount: number) => void
}

export const DonationModal = ({ fundraiser, onClose, onDonationSuccess }: Props) => {
  const [token, setToken] = useState<DonationToken>('MATIC')
  const [amount, setAmount] = useState('')

  const { donate, pendingHash, isSubmitting } = useDonate(() => {
    if (!fundraiser) return
    onDonationSuccess(fundraiser.id, token, Number(amount))
    setAmount('')
    onClose()
  })

  useEffect(() => {
    if (fundraiser) {
      setToken(fundraiser.targetToken)
    }
  }, [fundraiser])

  if (!fundraiser) return null

  const handleDonate = () => {
    donate({
      token,
      amount,
      recipient: fundraiser.walletAddress,
    })
  }

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
          {fundraiser.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{fundraiser.location}</p>

        <div className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-slate-700">
            Pilih Token
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(['MATIC', 'USDT'] as DonationToken[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setToken(item)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    token === item
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-slate-200 text-slate-500 hover:border-brand-primary/40'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Nominal Donasi
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder={`Contoh: ${
                token === 'MATIC' ? '1.5' : '100'
              } ${token}`}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Detail</p>
          <p>Wallet tujuan: {fundraiser.walletAddress}</p>
          <p>
            Target kampanye: {fundraiser.targetAmount} {fundraiser.targetToken}
          </p>
        </div>

        <button
          onClick={handleDonate}
          className="mt-6 w-full rounded-full bg-success px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!amount || Number(amount) <= 0 || isSubmitting}
        >
          {isSubmitting
            ? 'Menunggu konfirmasi...'
            : `Donate ${token === 'MATIC' ? 'MATIC' : 'USDT'}`}
        </button>

        {pendingHash && (
          <a
            href={`${POLYGON_SCAN_BASE}/${pendingHash}`}
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


