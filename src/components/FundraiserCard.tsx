import { HeartHandshake } from 'lucide-react'
import type { Fundraiser } from '../types'

type Props = {
  fundraiser: Fundraiser
  onSelect: (fundraiser: Fundraiser) => void
}

export const FundraiserCard = ({ fundraiser, onSelect }: Props) => {
  const progress = Math.min(
    (fundraiser.raisedAmount / fundraiser.targetAmount) * 100,
    100,
  )

  return (
    <article className="rounded-3xl border border-white/10 bg-white text-slate-900 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
      <img
        src={fundraiser.imageUrl}
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
        <p className="mt-2 text-sm text-slate-600">{fundraiser.description}</p>
        <p className="mt-3 text-xs font-semibold text-brand-dark uppercase tracking-wide">
          Fokus: {fundraiser.impactFocus}
        </p>

        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>{fundraiser.raisedAmount} terkumpul</span>
            <span>
              Target {fundraiser.targetAmount} {fundraiser.targetToken}
            </span>
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
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <HeartHandshake size={16} />
          Lihat & Donasi
        </button>
      </div>
    </article>
  )
}


