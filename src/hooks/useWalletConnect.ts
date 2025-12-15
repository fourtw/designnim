import { formatUnits } from 'viem'
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useChainId,
  useReadContract,
  useSwitchChain,
} from 'wagmi'
import type { Connector } from 'wagmi'

import { USDT_CONTRACT_ADDRESS } from '../lib/constants'
import { activeChain } from '../lib/wagmi'
import { erc20Abi } from '../lib/abi'
import { 
  isMetaMaskInstalled, 
  requestMetaMaskConnection, 
  switchToPolygonAmoy 
} from '../lib/walletDetection'

const formatAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet'

const pickConnector = (connectors: readonly Connector[]) => {
  // Prefer MetaMask connector
  const metaMaskConnector = connectors.find((connector) => 
    connector.id === 'metaMask' || connector.id === 'io.metamask'
  )
  if (metaMaskConnector) return metaMaskConnector
  
  // Fallback to injected connector
  const injectedConnector = connectors.find((connector) => 
    connector.id === 'injected'
  )
  if (injectedConnector) return injectedConnector
  
  // Last resort: first available connector
  return connectors[0]
}

export const useWalletConnect = () => {
  const chainId = useChainId()
  const { address, status, chain, connector } = useAccount()
  const { connectAsync, connectors, isPending, error, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()
  const { switchChainAsync } = useSwitchChain()

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
    let preferred = connectorOverride ?? pickConnector(connectors)
    
    // If no connector found, try to detect MetaMask directly
    if (!preferred) {
      if (isMetaMaskInstalled()) {
        try {
          // Connect directly via MetaMask
          await requestMetaMaskConnection()
          
          // Try to switch to correct network
          try {
            await switchToPolygonAmoy()
          } catch (switchErr) {
            // Network switch is optional, connection is more important
            console.warn('Failed to switch network:', switchErr)
          }
          
          // Wait a bit for wagmi to detect
          await new Promise(resolve => setTimeout(resolve, 1000))
          // Reload to let wagmi pick up the connection
          window.location.reload()
          return
        } catch (err: any) {
          throw err
        }
      }
      
      throw new Error(
        'MetaMask belum ditemukan. Pastikan MetaMask sudah terinstall dan aktif, lalu refresh halaman.',
      )
    }
    
    try {
      // Connect to wallet
      await connectAsync({ 
        connector: preferred,
        chainId: activeChain.id,
      })
      
      // After connection, check if we need to switch chain
      try {
        const currentChainId = await preferred.getChainId()
        if (currentChainId !== activeChain.id && switchChainAsync) {
          await switchChainAsync({ chainId: activeChain.id })
        }
      } catch (switchErr: any) {
        // User might reject chain switch, that's okay
        if (switchErr.code !== 4001) {
          console.warn('Failed to switch chain:', switchErr)
        }
      }
    } catch (err: any) {
      console.error('Connection error:', err)
      
      // Handle specific error codes
      if (err.code === 4001) {
        throw new Error('Koneksi ditolak. Silakan approve di popup MetaMask.')
      }
      
      if (err.code === -32002) {
        throw new Error('Request sudah pending. Silakan buka MetaMask dan approve request yang ada.')
      }
      
      const errorMessage = err?.message || 'Gagal menghubungkan wallet.'
      
      // Try direct MetaMask connection as fallback
      if (isMetaMaskInstalled()) {
        try {
          await requestMetaMaskConnection()
          // Wait then reload to let wagmi detect
          setTimeout(() => window.location.reload(), 1000)
          return
        } catch (directErr: any) {
          // If direct connection also fails, throw the original error
          throw new Error(
            errorMessage.includes('not found') || errorMessage.includes('not ready')
              ? 'MetaMask belum terdeteksi. Pastikan extension sudah aktif dan unlock, lalu refresh halaman.'
              : errorMessage
          )
        }
      }
      
      throw new Error(
        errorMessage.includes('not found') || errorMessage.includes('not ready')
          ? 'MetaMask belum terdeteksi. Pastikan extension sudah aktif dan unlock, lalu refresh halaman.'
          : errorMessage
      )
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




