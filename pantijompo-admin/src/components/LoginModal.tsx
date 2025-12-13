import {
  ShieldCheck,
  WalletMinimal,
  Loader2,
  Info,
  Cable,
} from 'lucide-react'
import type { Connector } from 'wagmi'

type LoginModalProps = {
  connectors: readonly Connector[]
  isProcessing: boolean
  onConnect: (connector?: Connector) => void
  error?: string | null
}

const connectorAccent: Record<
  string,
  { color: string; subtitle: string; badge: string }
> = {
  metaMask: {
    color: 'text-[#F6851B]',
    subtitle: 'Desktop browser + extension',
    badge: 'bg-[#F6851B]/15 text-[#F6851B]',
  },
  walletConnect: {
    color: 'text-[#2D7DF7]',
    subtitle: 'Mobile app via QR',
    badge: 'bg-[#2D7DF7]/15 text-[#2D7DF7]',
  },
}

export const LoginModal = ({
  connectors,
  isProcessing,
  onConnect,
  error,
}: LoginModalProps) => {
  return (
    <div className="w-full max-w-4xl rounded-[32px] border border-white/10 bg-slate-950/95 p-1 text-white shadow-2xl">
      <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
        <section className="rounded-[28px] bg-slate-900/60 p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-accent/80">
              Admin Access
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              Masuk ke Panti Jompo Link Admin
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Pilih wallet yang terdaftar lalu tanda tangani pesan untuk
              memverifikasi hak akses Anda.
            </p>
          </div>

          <div className="space-y-3">
            {connectors.length === 0 && (
              <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                Tidak ada wallet connector yang terdeteksi. Instal MetaMask
                (Chrome/Brave) atau WalletConnect di perangkat mobile kemudian
                refresh halaman ini.
              </div>
            )}
            {connectors.map((connector) => {
              const accent =
                connectorAccent[connector.id] ?? {
                  color: 'text-primary',
                  subtitle: 'Compatible wallet',
                  badge: 'bg-white/10 text-white',
                }
              return (
                <button
                  key={connector.id}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => onConnect(connector)}
                  disabled={!connector.ready || isProcessing}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold ${accent.badge}`}
                    >
                      {connector.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{connector.name}</p>
                      <p className="text-xs text-white/60">{accent.subtitle}</p>
                    </div>
                  </div>
                  {isProcessing ? (
                    <Loader2 className={`animate-spin ${accent.color}`} size={18} />
                  ) : (
                    <WalletMinimal size={18} className={accent.color} />
                  )}
                </button>
              )
            })}
          </div>

          {connectors.length === 0 && (
            <button
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/80 disabled:opacity-60"
              onClick={() => onConnect()}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Memproses wallet...
                </>
              ) : (
                <>
                  <WalletMinimal size={16} />
                  Coba Connect Ulang
                </>
              )}
            </button>
          )}

          {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-gradient-to-b from-slate-900/70 to-slate-900/30 p-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-accent" />
              <div>
                <p className="text-sm font-semibold">Apa itu Wallet?</p>
                <p className="text-xs text-white/60">
                  Wallet menyimpan aset digital Anda dan dipakai sebagai metode
                  login tanpa email/kata sandi.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Cable size={18} className="text-primary" />
              <div>
                <p className="text-sm font-semibold">Kenapa perlu tanda tangan?</p>
                <p className="text-xs text-white/60">
                  Signature memastikan hanya wallet di whitelist admin yang bisa
                  mengakses dashboard. Tidak ada biaya gas.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <div className="flex items-center gap-3">
              <Info size={18} className="text-accent" />
              <div>
                <p className="font-semibold text-white">
                  Belum punya MetaMask?
                </p>
                <p className="text-xs text-white/60">
                  Install extension resmi atau gunakan aplikasi WalletConnect di
                  smartphone Anda.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl bg-primary/20 px-3 py-2 text-center text-xs font-semibold text-primary transition hover:bg-primary/30"
              >
                Dapatkan MetaMask
              </a>
              <a
                href="https://walletconnect.com/"
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl border border-white/20 px-3 py-2 text-center text-xs font-semibold text-white/80 transition hover:border-white/40"
              >
                Pelajari WalletConnect
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

