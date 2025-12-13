import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import data from '../data/pantiJompo.json'
import type { PantiJompo } from '../types'
import { DashboardLayout } from '../components/DashboardLayout'
import { WithdrawCard } from '../components/WithdrawCard'
import { useBalances } from '../hooks/useBalances'
import { ACTIVE_CHAIN } from '../lib/wagmiConfig'

export const Withdraw = () => {
  const [loading, setLoading] = useState<{
    id: string
    token: 'MATIC' | 'USDT'
  } | null>(null)

  const baseList = useMemo(() => data as PantiJompo[], [])
  const { data: balances } = useBalances(
    baseList.map((item) => item.walletAddress),
    ACTIVE_CHAIN.id,
    20000,
  )

  const pantiWithBalance = useMemo(() => {
    const merged = baseList.map((panti) => {
      const latest = balances?.find(
        (balance) => balance.address === panti.walletAddress,
      )
      return latest
        ? { ...panti, raisedMatic: latest.matic, raisedUsdt: latest.usdt }
        : panti
    })
    return merged.filter(
      (panti) => panti.raisedMatic > 0 || panti.raisedUsdt > 0,
    )
  }, [balances, baseList])

  const handleWithdraw = async ({
    panti,
    token,
  }: {
    panti: PantiJompo
    token: 'MATIC' | 'USDT'
  }) => {
    setLoading({ id: panti.id, token })
    try {
      // placeholder for actual contract call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success(
        `Withdraw ${token} untuk ${panti.name} berhasil dikirim ke ${panti.walletAddress}`,
      )
    } catch (error) {
      toast.error('Withdraw gagal, coba ulangi.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-2xl font-semibold text-white">Withdraw</p>
        <p className="text-sm text-white/60">
          Salurkan saldo yang sudah siap cair ke wallet masing-masing panti.
        </p>
      </div>
      {pantiWithBalance.length === 0 ? (
        <p className="text-sm text-white/60">
          Belum ada saldo yang siap ditarik pada jaringan aktif.
        </p>
      ) : (
        <div className="space-y-4">
          {pantiWithBalance.map((panti) => (
            <WithdrawCard
              key={panti.id}
              panti={panti}
              onWithdraw={handleWithdraw}
              loadingToken={loading}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

