import { ChevronDown, Wallet2 } from 'lucide-react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'

import { shortenAddress } from '../lib/utils'

const networks = [
  { id: polygonMumbai.id, label: 'Polygon Mumbai' },
  { id: polygon.id, label: 'Polygon Mainnet' },
]

export const Header = () => {
  const chainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()
  const { address } = useAccount()

  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-slate-900/40 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">
          Admin Panel
        </p>
        <p className="text-xl font-semibold text-white">Dashboard</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
            Wallet
          </p>
          <p className="text-sm font-semibold text-white">
            {address ? shortenAddress(address) : 'Not Connected'}
          </p>
        </div>

        <div className="relative">
          <select
            className="appearance-none rounded-2xl border border-white/10 bg-primary/20 px-4 py-2 text-sm font-semibold text-white"
            value={chainId ?? polygonMumbai.id}
            onChange={(event) => {
              const nextId = Number(event.target.value)
              switchChainAsync({ chainId: nextId }).catch((err) =>
                console.warn('Switch chain failed', err),
              )
            }}
            disabled={isPending}
          >
            {networks.map((net) => (
              <option key={net.id} value={net.id} className="bg-slate-900">
                {net.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
        </div>

        <div className="flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-accent">
          <Wallet2 size={16} />
          Live
        </div>
      </div>
    </header>
  )
}

