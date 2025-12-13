import { useEffect, useState } from 'react'
import { Wallet2, LogOut } from 'lucide-react'
import type { Connector } from 'wagmi'

import { APP_NAME } from '../lib/constants'
import { useWalletConnect } from '../hooks/useWalletConnect'
import { WalletConnectModal } from './WalletConnectModal'

export const Header = () => {
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [localPendingConnector, setLocalPendingConnector] = useState<
    string | null
  >(null)
  const {
    shortAddress,
    address,
    chainName,
    isPending,
    isWrongNetwork,
    connectWallet,
    disconnectWallet,
    maticBalance,
    usdtBalance,
    availableConnectors,
    hasConnectors,
    pendingConnectorId,
    connectError,
  } = useWalletConnect()

  useEffect(() => {
    if (address) {
      setWalletModalOpen(false)
      setActionError(null)
    }
  }, [address])

  const handlePrimaryAction = () => {
    if (address) {
      disconnectWallet()
      return
    }
    setActionError(null)
    setWalletModalOpen(true)
  }

  const handleConnectorSelect = async (connector: Connector) => {
    try {
      setLocalPendingConnector(connector.id)
      await connectWallet(connector)
      setWalletModalOpen(false)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal menghubungkan wallet.'
      setActionError(message)
    } finally {
      setLocalPendingConnector(null)
    }
  }

  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b border-white/10 bg-slate-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-primary/70">
            Web3 Fundraising
          </p>
          <h1 className="text-xl font-semibold">{APP_NAME}</h1>
        </div>

        <div className="relative flex items-center gap-4">
          {address ? (
            <div className="text-right">
              <p className="text-xs text-white/70">{chainName}</p>
              <p className="text-sm font-semibold">{shortAddress}</p>
              <p className="text-[11px] text-white/60">
                {maticBalance ?? '0.000 MATIC'} · {usdtBalance ?? '0.00 USDT'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-white/60">
              Terhubung langsung ke Polygon untuk transparansi
            </p>
          )}

          <button
            onClick={handlePrimaryAction}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              address
                ? 'bg-red-500/80 hover:bg-red-500'
                : 'bg-success hover:bg-emerald-500'
            }`}
            disabled={isPending}
          >
            {address ? (
              <>
                <LogOut size={16} />
                Putuskan
              </>
            ) : (
              <>
                <Wallet2 size={16} />
                {isPending ? 'Menyiapkan...' : 'Connect Wallet'}
              </>
            )}
          </button>

        </div>
      </div>
      {isWrongNetwork && (
        <div className="bg-rose-600/80 text-white text-center text-sm py-1">
          Wallet berada di jaringan lain. Silakan pindah ke Polygon{' '}
          {chainName}.
        </div>
      )}
      {!address && !hasConnectors && (
        <div className="bg-amber-500/20 text-amber-200 text-center text-xs py-2">
          Instal atau aktifkan MetaMask/WalletConnect agar dapat terhubung.
        </div>
      )}

      <WalletConnectModal
        open={!address && walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        connectors={availableConnectors}
        hasConnectors={hasConnectors}
        onSelectConnector={handleConnectorSelect}
        isConnecting={isPending}
        pendingConnectorId={localPendingConnector ?? pendingConnectorId}
        actionError={actionError ?? connectError}
      />
    </header>
  )
}

