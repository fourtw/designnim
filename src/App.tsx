import { useState } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { FundraisersList } from './components/FundraisersList'
import { DonationModal } from './components/DonationModal'
import { CreateFundraiserForm } from './components/CreateFundraiserForm'
import { Footer } from './components/Footer'
import type { FundraiserFromContract } from './types'
import { useAccount } from 'wagmi'
import { isContractDeployed } from './lib/constants'

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
  const { address } = useAccount()
  const [selectedFundraiser, setSelectedFundraiser] = useState<FundraiserFromContract | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleDonationSuccess = () => {
    // Refresh will be handled by the component
    toast.success('Donasi berhasil!')
  }

  const handleCreateSuccess = () => {
    toast.success('Fundraiser berhasil dibuat!')
    setShowCreateForm(false)
    // Force page refresh to show new fundraiser
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      {!isContractDeployed && (
        <div className="bg-amber-500/20 border-b border-amber-500/50 text-amber-200 px-6 py-3">
          <div className="mx-auto max-w-6xl flex items-center gap-3">
            <AlertCircle size={20} />
            <div className="flex-1">
              <p className="font-semibold">Smart Contract Belum Dideploy</p>
              <p className="text-sm text-amber-200/80">
                Silakan deploy smart contract terlebih dahulu. Lihat DEPLOYMENT.md untuk instruksi.
              </p>
            </div>
          </div>
        </div>
      )}
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

        <section className="mx-auto max-w-6xl px-6 py-8">
          {address && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              <Plus size={18} />
              Buat Fundraiser Baru
            </button>
          )}
        </section>

        <FundraisersList
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

      {showCreateForm && (
        <CreateFundraiserForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  )
}

export default App


