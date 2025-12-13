import { Loader2 } from 'lucide-react'
import type { PantiJompo } from '../types'

type WithdrawCardProps = {
  panti: PantiJompo
  onWithdraw: (payload: { token: 'MATIC' | 'USDT'; panti: PantiJompo }) => void
  loadingToken?: { id: string; token: 'MATIC' | 'USDT' } | null
}

export const WithdrawCard = ({
  panti,
  onWithdraw,
  loadingToken,
}: WithdrawCardProps) => {
  const isLoading = (token: 'MATIC' | 'USDT') =>
    loadingToken?.id === panti.id && loadingToken.token === token

  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-white">{panti.name}</p>
          <p className="text-sm text-white/60">{panti.location}</p>
        </div>
        <div className="text-right text-sm text-white/60">
          <p>Saldo MATIC: {panti.raisedMatic.toFixed(2)}</p>
          <p>Saldo USDT: {panti.raisedUsdt.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          disabled={isLoading('MATIC')}
          onClick={() => onWithdraw({ token: 'MATIC', panti })}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary/20 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/40 disabled:opacity-50"
        >
          {isLoading('MATIC') && <Loader2 className="animate-spin" size={16} />}
          Withdraw MATIC
        </button>
        <button
          disabled={isLoading('USDT')}
          onClick={() => onWithdraw({ token: 'USDT', panti })}
          className="inline-flex items-center gap-2 rounded-2xl bg-accent/20 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/40 disabled:opacity-50"
        >
          {isLoading('USDT') && <Loader2 className="animate-spin" size={16} />}
          Withdraw USDT
        </button>
      </div>
    </div>
  )
}

