export const Footer = () => (
  <footer className="mt-12 bg-slate-900 text-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-center md:flex-row md:items-center md:justify-between md:text-left">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">
          Panti Jompo Link
        </p>
        <h4 className="text-2xl font-semibold">
          Mulai Donor Hari Ini & jaga martabat lansia Indonesia.
        </h4>
        <p className="mt-2 text-sm text-white/70">
          Terhubung langsung ke panti jompo lewat jaringan Polygon untuk bukti
          dana transparan.
        </p>
      </div>
      <button className="rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
        Connect Wallet & Donasi
      </button>
    </div>
    <p className="py-4 text-center text-xs text-white/50">
      © {new Date().getFullYear()} Panti Jompo Link · Dibangun dengan Wagmi, Viem, dan Polygon
    </p>
  </footer>
)


