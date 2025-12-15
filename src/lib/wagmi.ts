import { http, createConfig } from 'wagmi'
import { polygon, polygonAmoy } from 'wagmi/chains'
import { metaMask, injected } from 'wagmi/connectors'
import { defineChain } from 'viem'

import {
  APP_NAME,
  FALLBACK_MAINNET_RPC,
  FALLBACK_RPC,
  LOCAL_RPC,
} from './constants'

const network = (import.meta.env.VITE_POLYGON_NETWORK as string | undefined)?.toLowerCase()

// Determine active chain based on network setting
let activeChain
if (network === 'mainnet') {
  activeChain = polygon
} else if (network === 'local' || network === 'localhost') {
  // Define localhost chain
  activeChain = defineChain({
    id: 1337,
    name: 'Localhost',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['http://127.0.0.1:8545'],
      },
    },
  })
} else {
  // Default to Amoy testnet
  activeChain = polygonAmoy
}

export { activeChain }

const localRpc = LOCAL_RPC
const amoyRpc =
  (import.meta.env.VITE_POLYGON_RPC_URL as string | undefined) ?? FALLBACK_RPC
const mainnetRpc =
  (import.meta.env.VITE_POLYGON_MAINNET_RPC as string | undefined) ??
  FALLBACK_MAINNET_RPC

// Build chains array based on network
const chains = network === 'local' || network === 'localhost'
  ? [activeChain]
  : network === 'mainnet'
  ? [polygon]
  : [polygonAmoy, polygon]

// Build transports
const transports: Record<number, ReturnType<typeof http>> = {}
if (network === 'local' || network === 'localhost') {
  transports[1337] = http(localRpc)
} else {
  transports[polygonAmoy.id] = http(amoyRpc)
  transports[polygon.id] = http(mainnetRpc)
}

export const wagmiConfig = createConfig({
  chains,
  transports,
  connectors: [
    metaMask({
      dappMetadata: {
        name: APP_NAME,
        url: typeof window !== 'undefined' ? window.location.origin : 'https://panti-jompo-link.example',
      },
      // Force MetaMask to be detected
      preferDesktop: true,
    }),
    // Fallback injected connector for other MetaMask-like wallets
    injected({
      target: 'metaMask',
    }),
  ],
})


