import {
  X,
  Shield,
  Cable,
  Info,
  QrCode,
  RefreshCw,
} from 'lucide-react'
import type { Connector } from 'wagmi'
import { activeChain } from '../lib/wagmi'

type WalletConnectModalProps = {
  open: boolean
  onClose: () => void
  connectors: readonly Connector[]
  hasConnectors: boolean
  onSelectConnector: (connector: Connector) => void
  isConnecting: boolean
  pendingConnectorId?: string | null
  actionError?: string | null
}

const connectorAccent: Record<
  string,
  { badge: string; nameOverride?: string; subtitle: string }
> = {
  metaMask: {
    badge: 'bg-[#F6851B]/15 text-[#F6851B]',
    subtitle: 'Browser extension',
  },
  walletConnect: {
    badge: 'bg-[#3B99FC]/15 text-[#3B99FC]',
    subtitle: 'Mobile app QR',
  },
  coinbaseWallet: {
    badge: 'bg-[#0052FF]/15 text-[#0052FF]',
    nameOverride: 'Coinbase Wallet',
    subtitle: 'Coinbase Smart Wallet',
  },
  injected: {
    badge: 'bg-emerald-500/15 text-emerald-400',
    subtitle: 'Compatible wallet',
  },
}

const friendlyDescription =
  'Pilih wallet untuk mengirim donasi on-chain. Wallet seperti MetaMask akan membuka pop-up untuk mengkonfirmasi koneksi.'

export const WalletConnectModal = ({
  open,
  onClose,
  connectors,
  hasConnectors,
  onSelectConnector,
  isConnecting,
  pendingConnectorId,
  actionError,
}: WalletConnectModalProps) => {
  if (!open) return null

  // Check if MetaMask is available directly
  const hasMetaMask = typeof window !== 'undefined' && 
    (typeof (window as any).ethereum !== 'undefined' || 
     typeof (window as any).web3 !== 'undefined')

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/85 px-4 backdrop-blur-lg">
      <div className="w-full max-w-5xl max-h-[90vh] my-auto overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-950 to-slate-900 text-white shadow-2xl">
        <div className="grid gap-6 p-1 md:grid-cols-[1.2fr,0.8fr]">
          <section className="rounded-[30px] bg-slate-900/70 p-8 overflow-y-auto">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-accent/80">
                  Connect Wallet
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Pilih wallet yang ingin kamu hubungkan
                </h3>
                <p className="mt-1 text-sm text-white/70">{friendlyDescription}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-full border border-white/10 p-1.5 hover:bg-white/10 transition"
                  aria-label="Refresh halaman untuk deteksi ulang wallet"
                  title="Refresh untuk deteksi ulang wallet"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 p-1 hover:bg-white/10"
                  aria-label="Tutup pilihan wallet"
                >
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="mt-6 space-y-3">
              {hasConnectors ? (
                connectors.map((connector) => {
                  const accent = connectorAccent[connector.id] ?? {
                    badge: 'bg-white/10 text-white',
                    subtitle: 'Compatible wallet',
                  }
                  // Allow clicking even if not ready - sometimes MetaMask exists but wagmi hasn't detected it yet
                  const isDisabled = isConnecting && pendingConnectorId !== connector.id
                  const isLoading = pendingConnectorId === connector.id && isConnecting

                  return (
                    <button
                      key={connector.id}
                      type="button"
                      onClick={() => {
                        if (isDisabled) return
                        onSelectConnector(connector)
                      }}
                      disabled={isDisabled}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-left transition hover:border-white/40 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold ${accent.badge}`}
                        >
                          {connector.name.slice(0, 2)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">
                            {accent.nameOverride ?? connector.name}
                          </p>
                          <p className="text-xs text-white/60">
                            {connector.ready
                              ? accent.subtitle
                              : 'Klik untuk coba hubungkan (refresh jika perlu)'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-white/70">
                        {isLoading
                          ? 'Menghubungkan...'
                          : connector.ready
                            ? 'Pilih'
                            : 'Coba Hubungkan'}
                      </p>
                    </button>
                  )
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-amber-400/40 bg-amber-400/10 px-4 py-5 text-sm text-amber-100">
                  <p className="font-semibold">Wallet belum ditemukan</p>
                  <p className="mt-1 text-xs text-amber-200/80">
                    Instal MetaMask atau gunakan WalletConnect di perangkat mobile,
                    kemudian muat ulang halaman ini.
                  </p>
                </div>
              )}
            </div>

            {actionError && (
              <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                <p className="text-xs font-semibold text-rose-300">{actionError}</p>
                <p className="mt-1 text-xs text-rose-200/70">
                  Tips: Pastikan MetaMask sudah unlock, refresh halaman, atau coba klik tombol refresh di atas.
                </p>
              </div>
            )}
            
            {!hasConnectors && (
              <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3">
                <p className="text-xs font-semibold text-amber-200">
                  Wallet tidak terdeteksi oleh wagmi
                </p>
                <p className="mt-1 text-xs text-amber-200/70">
                  {hasMetaMask
                    ? 'MetaMask terdeteksi di browser tapi wagmi belum mendeteksi. Coba refresh halaman atau klik tombol di bawah.'
                    : 'Install MetaMask extension, unlock wallet, lalu refresh halaman ini.'}
                </p>
                {hasMetaMask && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const ethereum = (window as any).ethereum
                        if (ethereum) {
                          // Request connection
                          await ethereum.request({ method: 'eth_requestAccounts' })
                          
                          // Try to switch to correct network based on activeChain
                          try {
                            const chainIdHex = `0x${activeChain.id.toString(16)}`
                            await ethereum.request({
                              method: 'wallet_switchEthereumChain',
                              params: [{ chainId: chainIdHex }],
                            })
                          } catch (switchErr: any) {
                            // If network doesn't exist, add it
                            if (switchErr.code === 4902) {
                              const chainIdHex = `0x${activeChain.id.toString(16)}`
                              const chainConfig: any = {
                                chainId: chainIdHex,
                                chainName: activeChain.name,
                                nativeCurrency: {
                                  name: activeChain.nativeCurrency.name,
                                  symbol: activeChain.nativeCurrency.symbol,
                                  decimals: activeChain.nativeCurrency.decimals,
                                },
                                rpcUrls: [activeChain.rpcUrls.default.http[0]],
                              }
                              
                              // Add block explorer if available
                              if (activeChain.blockExplorers?.default?.url) {
                                chainConfig.blockExplorerUrls = [activeChain.blockExplorers.default.url]
                              }
                              
                              await ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [chainConfig],
                              })
                            }
                          }
                          
                          // Wait a bit then reload
                          setTimeout(() => {
                          window.location.reload()
                          }, 1000)
                        }
                      } catch (err: any) {
                        console.error('Failed to connect MetaMask:', err)
                        if (err.code === 4001) {
                          alert('Koneksi ditolak. Silakan approve di MetaMask.')
                        } else {
                        alert('Gagal connect MetaMask. Pastikan extension sudah unlock dan refresh halaman.')
                        }
                      }
                    }}
                    className="mt-3 w-full rounded-xl bg-primary/20 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/30"
                  >
                    Coba Connect MetaMask Langsung
                  </button>
                )}
              </div>
            )}
            
            {/* Debug info - remove in production */}
            {import.meta.env.DEV && (
              <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs">
                <p className="font-semibold text-blue-200">Debug Info:</p>
                <p className="mt-1 text-blue-200/70">
                  Connectors: {connectors.length} | Has MetaMask: {hasMetaMask ? 'Yes' : 'No'} | 
                  window.ethereum: {typeof window !== 'undefined' && (window as any).ethereum ? 'Yes' : 'No'}
                </p>
                {connectors.length > 0 && (
                  <p className="mt-1 text-blue-200/70">
                    Connector IDs: {connectors.map(c => `${c.id}(${c.ready ? 'ready' : 'not ready'})`).join(', ')}
                  </p>
                )}
              </div>
            )}
          </section>

          <section className="space-y-4 rounded-[30px] border border-white/10 bg-white/[0.03] p-6 overflow-y-auto">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold">Apa itu wallet?</p>
                  <p className="text-xs text-white/60">
                    Wallet menyimpan aset digital dan menjadi metode login tanpa email
                    atau kata sandi.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Cable size={20} className="text-primary" />
                <div>
                  <p className="text-sm font-semibold">Kenapa harus tanda tangan?</p>
                  <p className="text-xs text-white/60">
                    Signature gratis ini hanya dipakai untuk memverifikasi wallet
                    admin whitelist sebelum donasi dilakukan.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <QrCode size={20} className="text-accent" />
                <div>
                  <p className="text-sm font-semibold">Belum punya wallet?</p>
                  <p className="text-xs text-white/60">
                    Instal MetaMask (Chrome/Brave) atau gunakan WalletConnect di mobile
                    untuk scan QR.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <a
                  className="flex-1 rounded-xl bg-primary/20 px-3 py-2 text-center text-xs font-semibold text-primary transition hover:bg-primary/30"
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Dapatkan MetaMask
                </a>
                <a
                  className="flex-1 rounded-xl border border-white/20 px-3 py-2 text-center text-xs font-semibold text-white/80 transition hover:border-white/40"
                  href="https://walletconnect.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pelajari WalletConnect
                </a>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Info size={20} className="text-amber-300" />
                <div>
                  <p className="text-sm font-semibold">Tips keamanan</p>
                  <p className="text-xs text-white/60">
                    Pastikan domain website benar (localhost atau pantijompolink.com)
                    sebelum menyetujui signature.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  )
}

