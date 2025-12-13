import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Coins, HeartHandshake, TrendingUp, Users } from 'lucide-react'

import data from '../data/pantiJompo.json'
import { StatsCard } from '../components/StatsCard'
import { DashboardLayout } from '../components/DashboardLayout'

const generateChartData = () => {
  const now = Date.now()
  return Array.from({ length: 30 }).map((_, idx) => {
    const date = new Date(now - (29 - idx) * 24 * 60 * 60 * 1000)
    return {
      date: date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
      }),
      matic: 200 + Math.random() * 150,
      usdt: 2000 + Math.random() * 1500,
    }
  })
}

const chartData = generateChartData()

export const Dashboard = () => {
  const stats = useMemo(() => {
    const totalPanti = data.length
    const totalMatic = data.reduce((acc, item) => acc + item.raisedMatic, 0)
    const totalUsdt = data.reduce((acc, item) => acc + item.raisedUsdt, 0)
    const totalTx = Math.floor(totalPanti * 42.3)

    return {
      totalPanti,
      totalMatic,
      totalUsdt,
      totalTx,
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total Panti"
          value={stats.totalPanti.toString()}
          subLabel="Terhubung di Polygon"
          icon={<Users className="text-white/60" size={20} />}
        />
        <StatsCard
          label="Donasi MATIC"
          value={`${stats.totalMatic.toFixed(2)} MATIC`}
          subLabel="Terkumpul bulan ini"
          accent="accent"
          icon={<TrendingUp className="text-accent" size={20} />}
        />
        <StatsCard
          label="Donasi USDT"
          value={`${stats.totalUsdt.toLocaleString()} USDT`}
          subLabel="Termasuk stablecoin"
          icon={<Coins className="text-primary" size={20} />}
        />
        <StatsCard
          label="Total Transaksi"
          value={stats.totalTx.toLocaleString()}
          subLabel="On-chain records"
          icon={<HeartHandshake className="text-white/60" size={20} />}
        />
      </div>

      <div className="mt-8 rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-white">
              Donasi 30 Hari Terakhir
            </p>
            <p className="text-sm text-white/60">
              Data real-time berdasarkan jaringan Polygon.
            </p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMatic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsdt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                }}
              />
              <Area
                type="monotone"
                dataKey="matic"
                stroke="#2563EB"
                fillOpacity={1}
                fill="url(#colorMatic)"
              />
              <Area
                type="monotone"
                dataKey="usdt"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorUsdt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}

