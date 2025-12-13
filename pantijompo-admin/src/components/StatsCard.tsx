import type { ReactNode } from 'react'

type StatsCardProps = {
  label: string
  value: string
  subLabel?: string
  icon?: ReactNode
  accent?: 'primary' | 'accent'
}

export const StatsCard = ({
  label,
  value,
  subLabel,
  icon,
  accent = 'primary',
}: StatsCardProps) => {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.04] p-5 shadow-card backdrop-blur">
      <div className="mb-4 flex items-center justify-between text-white/70">
        <p className="text-sm font-medium uppercase tracking-[0.2em]">{label}</p>
        {icon}
      </div>
      <p
        className={`text-3xl font-semibold ${
          accent === 'primary' ? 'text-primary' : 'text-accent'
        }`}
      >
        {value}
      </p>
      {subLabel && <p className="mt-1 text-sm text-white/60">{subLabel}</p>}
    </div>
  )
}

