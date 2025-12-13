import { useMemo, useState } from 'react'

import rawData from '../data/pantiJompo.json'
import { DashboardLayout } from '../components/DashboardLayout'
import { TransactionTable } from '../components/TransactionTable'
import { useTransactions } from '../hooks/useTransactions'
import { ACTIVE_CHAIN } from '../lib/wagmiConfig'

export const Transaksi = () => {
  const [filterId, setFilterId] = useState('')
  const { data: transactions = [], isLoading } = useTransactions(ACTIVE_CHAIN.id)
  const pantiOptions = useMemo(
    () => (rawData as { id: string; name: string }[]),
    [],
  )

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-2xl font-semibold text-white">Transaksi</p>
        <p className="text-sm text-white/60">
          Rekap semua transfer donasi yang terdeteksi on-chain.
        </p>
      </div>
      {isLoading ? (
        <p className="text-sm text-white/60">Memuat transaksi...</p>
      ) : (
        <TransactionTable
          data={transactions}
          filterPantiId={filterId}
          onFilterChange={setFilterId}
          pantiOptions={pantiOptions}
        />
      )}
    </DashboardLayout>
  )
}

