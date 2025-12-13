import { createConfig, http } from 'wagmi'
import { polygonMumbai, polygon } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'
import { createPublicClient, type PublicClient } from 'viem'

const mumbaiRpc =
  (import.meta.env.VITE_POLYGON_MUMBAI_RPC as string | undefined) ??
  polygonMumbai.rpcUrls.default.http[0]
const mainnetRpc =
  (import.meta.env.VITE_POLYGON_MAINNET_RPC as string | undefined) ??
  polygon.rpcUrls.default.http[0]

const walletConnectProjectId =
  (import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID as string | undefined) ?? ''

const baseConnectors = [
  metaMask({ dappMetadata: { name: 'Panti Jompo Link Admin' } }),
]

if (walletConnectProjectId) {
  baseConnectors.push(
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    }),
  )
}

export const wagmiConfig = createConfig({
  chains: [polygonMumbai, polygon],
  transports: {
    [polygonMumbai.id]: http(mumbaiRpc),
    [polygon.id]: http(mainnetRpc),
  },
  connectors: baseConnectors,
})

export const publicClients: Record<number, PublicClient> = {
  [polygonMumbai.id]: createPublicClient({
    chain: polygonMumbai,
    transport: http(mumbaiRpc),
  }),
  [polygon.id]: createPublicClient({
    chain: polygon,
    transport: http(mainnetRpc),
  }),
}

export const ACTIVE_CHAIN = polygonMumbai

