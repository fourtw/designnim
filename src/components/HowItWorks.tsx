const STEPS = [
  {
    title: 'Hubungkan Wallet',
    description:
      'Gunakan MetaMask atau wallet Polygon favorit Anda untuk terhubung dalam hitungan detik.',
  },
  {
    title: 'Pilih Panti Jompo',
    description:
      'Telusuri daftar fundraiser terverifikasi yang memprioritaskan kebutuhan lansia.',
  },
  {
    title: 'Donasi & Lacak Dampak',
    description:
      'Kirim USDT atau MATIC, kemudian pantau progres dan pembaruan real-time langsung di blockchain.',
  },
]

export const HowItWorks = () => (
  <section className="mx-auto max-w-6xl px-6 py-12 text-white">
    <h3 className="text-2xl font-semibold mb-6">Cara Kerja</h3>
    <div className="grid gap-6 md:grid-cols-3">
      {STEPS.map((step, index) => (
        <div
          key={step.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-sm transition hover:-translate-y-1"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary font-semibold">
            {index + 1}
          </div>
          <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
          <p className="text-sm text-white/80">{step.description}</p>
        </div>
      ))}
    </div>
  </section>
)


