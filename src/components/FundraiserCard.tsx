import { HeartHandshake } from 'lucide-react'
import { formatEther } from 'viem'
import type { FundraiserFromContract } from '../types'

type Props = {
  fundraiser: FundraiserFromContract
  onSelect: (fundraiser: FundraiserFromContract) => void
}

export const FundraiserCard = ({ fundraiser, onSelect }: Props) => {
  const raisedAmount = Number(formatEther(fundraiser.raisedAmount || BigInt(0)))
  const targetAmount = Number(formatEther(fundraiser.targetAmount || BigInt(1)))
  const progress = Math.min((raisedAmount / targetAmount) * 100, 100)

  // Default image if not provided
  const imageUrl = fundraiser.imageUrl || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format'

  return (
    <article className="rounded-3xl border border-white/10 bg-white text-slate-900 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <img
        src={imageUrl}
        alt={fundraiser.name}
        className="h-48 w-full rounded-t-3xl object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-brand-primary">
          {fundraiser.location}
        </p>
        <h4 className="mt-1 text-xl font-semibold text-slate-900">
          {fundraiser.name}
        </h4>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">
          {fundraiser.description}
        </p>
        {fundraiser.impactFocus && (
          <p className="mt-3 text-xs font-semibold text-brand-dark uppercase tracking-wide">
            Fokus: {fundraiser.impactFocus}
          </p>
        )}

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

        <button
          onClick={() => onSelect(fundraiser)}
          disabled={!fundraiser.isActive}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <HeartHandshake size={16} />
          {fundraiser.isActive ? 'Lihat & Donasi' : 'Tidak Aktif'}
        </button>
      </div>
    </article>
  )
}


