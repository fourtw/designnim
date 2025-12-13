import { http, createConfig } from 'wagmi'
import { polygonMumbai, polygon } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

import {
  APP_NAME,
  FALLBACK_MAINNET_RPC,
  FALLBACK_RPC,
} from './constants'

const isMainnet =
  (import.meta.env.VITE_POLYGON_NETWORK as string | undefined)?.toLowerCase() ===
  'mainnet'

export const activeChain = isMainnet ? polygon : polygonMumbai

const mumbaiRpc =
  (import.meta.env.VITE_POLYGON_RPC_URL as string | undefined) ?? FALLBACK_RPC
const mainnetRpc =
  (import.meta.env.VITE_POLYGON_MAINNET_RPC as string | undefined) ??
  FALLBACK_MAINNET_RPC

export const wagmiConfig = createConfig({
  chains: [polygonMumbai, polygon],
  transports: {
    [polygonMumbai.id]: http(mumbaiRpc),
    [polygon.id]: http(mainnetRpc),
  },
  connectors: [
    metaMask({
      dappMetadata: {
        name: APP_NAME,
        url: 'https://panti-jompo-link.example',
      },
    }),
  ],
})


