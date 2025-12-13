import type { Fundraiser } from '../types'
import { FundraiserCard } from './FundraiserCard'

type Props = {
  fundraisers: Fundraiser[]
  onSelect: (fundraiser: Fundraiser) => void
}

export const FundraisersList = ({ fundraisers, onSelect }: Props) => (
  <section className="mx-auto max-w-6xl px-6 py-12 text-white">
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">
          Fundraiser Unggulan
        </p>
        <h3 className="text-2xl font-semibold">
          Fokus pada perawatan lansia dan transparansi dana
        </h3>
      </div>
      <p className="text-sm text-white/70 md:max-w-sm">
        Semua kampanye telah diverifikasi dan seluruh transaksi dapat dilacak di
        PolygonScan untuk memastikan setiap rupiah crypto tersalurkan.
      </p>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {fundraisers.map((fundraiser) => (
        <FundraiserCard
          key={fundraiser.id}
          fundraiser={fundraiser}
          onSelect={onSelect}
        />
      ))}
    </div>
  </section>
)


