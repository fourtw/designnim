import { formatUnits } from 'viem'
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useChainId,
  useReadContract,
} from 'wagmi'
import type { Connector } from 'wagmi'

import { USDT_CONTRACT_ADDRESS } from '../lib/constants'
import { activeChain } from '../lib/wagmi'
import { erc20Abi } from '../lib/abi'

const formatAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet'

const pickConnector = (connectors: readonly Connector[]) =>
  connectors.find((connector) => connector.id === 'metaMask') ?? connectors[0]

export const useWalletConnect = () => {
  const chainId = useChainId()
  const { address, status, chain, connector } = useAccount()
  const { connectAsync, connectors, isPending, error, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  const { data: maticBalance } = useBalance({
    address,
    chainId: activeChain.id,
    query: {
      enabled: Boolean(address),
      refetchInterval: 15000,
    },
  })

  const { data: usdtBalance } = useReadContract({
    abi: erc20Abi,
    address: USDT_CONTRACT_ADDRESS,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 20000,
    },
  })

  const isWrongNetwork =
    Boolean(address) && chainId !== 0 && chainId !== activeChain.id

  const connectWallet = async (connectorOverride?: Connector) => {
    const preferred = connectorOverride ?? pickConnector(connectors)
    
    // If no connector found, try to detect MetaMask directly
    if (!preferred) {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          // Try to connect directly via window.ethereum
          await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
          // Reload to let wagmi pick up the connection
          window.location.reload()
          return
        } catch (err) {
          console.error('Direct MetaMask connection failed:', err)
        }
      }
      
      throw new Error(
        'Wallet belum ditemukan. Pastikan MetaMask sudah terinstall dan aktif, lalu refresh halaman.',
      )
    }
    
    // Try to connect even if not ready - sometimes MetaMask exists but wagmi hasn't detected it
    try {
      console.log('Attempting to connect with connector:', preferred.id, 'ready:', preferred.ready)
      await connectAsync({ connector: preferred })
    } catch (err) {
      console.error('Connection error:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Gagal menghubungkan wallet.'
      
      // Provide more helpful error messages
      if (errorMessage.includes('not ready') || errorMessage.includes('not found') || errorMessage.includes('User rejected')) {
        // If user rejected, try direct connection
        if (errorMessage.includes('User rejected') && typeof window !== 'undefined' && (window as any).ethereum) {
          throw new Error(
            'Koneksi ditolak. Pastikan Anda approve di popup MetaMask, atau refresh halaman dan coba lagi.',
          )
        }
        
        throw new Error(
          'MetaMask belum terdeteksi. Pastikan extension sudah aktif dan unlock, lalu refresh halaman.',
        )
      }
      
      throw new Error(errorMessage)
    }
  }

  const disconnectWallet = () => disconnect()

  return {
    address,
    shortAddress: formatAddress(address),
    chainName: chain?.name ?? activeChain.name,
    connectionStatus: status,
    isPending,
    isWrongNetwork,
    connectWallet,
    disconnectWallet,
    availableConnectors: connectors,
    hasConnectors: connectors.length > 0,
    pendingConnectorId: pendingConnector?.id,
    connectorName: connector?.name ?? pickConnector(connectors)?.name,
    maticBalance: maticBalance
      ? `${Number(
          formatUnits(maticBalance.value, maticBalance.decimals),
        ).toFixed(3)} ${maticBalance.symbol}`
      : undefined,
    usdtBalance: usdtBalance
      ? `${Number(formatUnits(usdtBalance, 6)).toFixed(2)} USDT`
      : undefined,
    connectError: error?.message,
  }
}




