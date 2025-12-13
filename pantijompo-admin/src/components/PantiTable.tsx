import type { PantiJompo } from '../types'
import { percentProgress, shortenAddress } from '../lib/utils'

type PantiTableProps = {
  data: PantiJompo[]
  onEdit: (panti: PantiJompo) => void
  onDelete: (id: string) => void
}

export const PantiTable = ({ data, onEdit, onDelete }: PantiTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] shadow-card">
      <table className="w-full text-left text-sm text-white/80">
        <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.2em] text-white/60">
          <tr>
            <th className="px-4 py-4">Nama</th>
            <th className="px-4 py-4">Lokasi</th>
            <th className="px-4 py-4">Wallet</th>
            <th className="px-4 py-4">Target (IDR)</th>
            <th className="px-4 py-4">MATIC</th>
            <th className="px-4 py-4">USDT</th>
            <th className="px-4 py-4">Progress</th>
            <th className="px-4 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((panti) => (
            <tr
              key={panti.id}
              className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
            >
              <td className="px-4 py-4 font-semibold text-white">
                {panti.name}
              </td>
              <td className="px-4 py-4">{panti.location}</td>
              <td className="px-4 py-4 font-mono text-xs">
                {shortenAddress(panti.walletAddress)}
              </td>
              <td className="px-4 py-4">
                {(panti.target / 1_000_000).toFixed(1)} Jt
              </td>
              <td className="px-4 py-4">{panti.raisedMatic.toFixed(2)}</td>
              <td className="px-4 py-4">{panti.raisedUsdt.toFixed(2)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{
                        width: `${percentProgress(
                          panti.raisedUsdt,
                          panti.target / 15000,
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/60">
                    {percentProgress(panti.raisedUsdt, panti.target / 15000)}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-right">
                <button
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/80 hover:border-white/40"
                  onClick={() => onEdit(panti)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 rounded-full border border-rose-500/40 px-3 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/10"
                  onClick={() => onDelete(panti.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

