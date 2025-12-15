export const APP_NAME = 'Panti Jompo Link'

// Local network RPC
export const LOCAL_RPC = 'http://127.0.0.1:8545'

// Amoy testnet RPC (Mumbai is deprecated)
export const FALLBACK_RPC = 'https://rpc-amoy.polygon.technology'

export const FALLBACK_MAINNET_RPC = 'https://polygon-rpc.com'

// Fundraising Contract Address (update after deployment)
// If not set, the app will show a warning
export const FUNDRAISING_CONTRACT_ADDRESS = (
  import.meta.env.VITE_FUNDRAISING_CONTRACT_ADDRESS as `0x${string}` | undefined
) ?? ('0x0000000000000000000000000000000000000000' as `0x${string}`)

// Check if contract is deployed
export const isContractDeployed = FUNDRAISING_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'

export const USDT_CONTRACT_ADDRESS =
  (import.meta.env.VITE_USDT_CONTRACT as `0x${string}` | undefined) ??
  '0xC2132D05D31c914a87C6611C10748AEb04B58e8F'

export const POLYGON_SCAN_BASE =
  (import.meta.env.VITE_BLOCK_EXPLORER as string | undefined) ??
  'https://amoy.polygonscan.com/tx'

export type DonationToken = 'MATIC' | 'USDT'


