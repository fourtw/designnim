import { useState } from 'react'
import toast from 'react-hot-toast'

import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { FundraisersList } from './components/FundraisersList'
import { DonationModal } from './components/DonationModal'
import { Footer } from './components/Footer'
import { initialFundraisers } from './data/fundraisers'
import type { Fundraiser } from './types'
import type { DonationToken } from './lib/constants'

const aboutContent = [
  {
    title: 'Apa itu Panti Jompo Link?',
    description:
      'Platform fundraising terdesentralisasi di Polygon yang menghubungkan donor langsung dengan panti jompo di Indonesia. Transparansi dan kecepatan transaksi Web3 memastikan dana sampai tanpa perantara berlapis.',
  },
  {
    title: 'Kenapa fokus lansia?',
    description:
      'Kebutuhan panti jompo meliputi obat, peralatan medis, nutrisi, hingga kegiatan sosial yang menjaga martabat lansia. Kami menghadirkan sistem pelaporan on-chain agar dampak dapat dilacak kapan pun.',
  },
  {
    title: 'Keamanan blockchain',
    description:
      'Setiap transaksi terekam di PolygonScan. Smart contract dapat diaudit dan wallet penerima diverifikasi agar dana tidak salah sasaran.',
  },
]

const App = () => {
  const [fundraisers, setFundraisers] = useState(initialFundraisers)
  const [selectedFundraiser, setSelectedFundraiser] = useState<Fundraiser | null>(null)

  const handleDonationSuccess = (
    fundraiserId: string,
    token: DonationToken,
    amount: number,
  ) => {
    setFundraisers((prev) =>
      prev.map((item) =>
        item.id === fundraiserId
          ? { ...item, raisedAmount: item.raisedAmount + amount }
          : item,
      ),
    )
    toast.success(`Terima kasih! Donasi ${amount} ${token} tercatat.`)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main>
        <Hero />

        <section className="mx-auto max-w-6xl grid gap-6 px-6 py-12 text-white md:grid-cols-3">
          {aboutContent.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-white/80">{item.description}</p>
            </div>
          ))}
        </section>

        <HowItWorks />

        <FundraisersList
          fundraisers={fundraisers}
          onSelect={(fundraiser) => setSelectedFundraiser(fundraiser)}
        />
      </main>

      <Footer />

      {selectedFundraiser && (
        <DonationModal
          fundraiser={selectedFundraiser}
          onClose={() => setSelectedFundraiser(null)}
          onDonationSuccess={handleDonationSuccess}
        />
      )}
    </div>
  )
}

export default App


