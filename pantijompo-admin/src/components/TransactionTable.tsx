import type { TransactionRecord } from '../types'

type TransactionTableProps = {
  data: TransactionRecord[]
  filterPantiId?: string
  onFilterChange?: (pantiId: string) => void
  pantiOptions: { id: string; name: string }[]
}

export const TransactionTable = ({
  data,
  filterPantiId,
  onFilterChange,
  pantiOptions,
}: TransactionTableProps) => {
  const selectedPantiName = filterPantiId
    ? pantiOptions.find((p) => p.id === filterPantiId)?.name
    : undefined
  const filtered = filterPantiId
    ? data.filter((tx) => tx.pantiName === selectedPantiName)
    : data

  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xl font-semibold text-white">Transaksi</p>
          <p className="text-sm text-white/60">
            Catatan on-chain terakhir dari Polygon.
          </p>
        </div>
        <select
          className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm"
          value={filterPantiId ?? ''}
          onChange={(event) => onFilterChange?.(event.target.value)}
        >
          <option value="">Semua Panti</option>
          {pantiOptions.map((panti) => (
            <option key={panti.id} value={panti.id}>
              {panti.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm text-white/70">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.2em] text-white/60">
            <tr>
              <th className="px-4 py-3">Tx Hash</th>
              <th className="px-4 py-3">Dari</th>
              <th className="px-4 py-3">Ke</th>
              <th className="px-4 py-3">Token</th>
              <th className="px-4 py-3">Jumlah</th>
              <th className="px-4 py-3">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr
                key={tx.hash + tx.timestamp}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-4 font-mono text-xs">
                  <a
                    className="text-primary underline"
                    href={`https://polygonscan.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tx.hash.slice(0, 10)}...
                  </a>
                </td>
                <td className="px-4 py-4 font-mono text-xs">{tx.from}</td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-white">{tx.pantiName}</p>
                  <p className="font-mono text-xs text-white/60">{tx.to}</p>
                </td>
                <td className="px-4 py-4">{tx.token}</td>
                <td className="px-4 py-4">{tx.amount.toLocaleString()}</td>
                <td className="px-4 py-4 text-xs">
                  {new Date(tx.timestamp).toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

