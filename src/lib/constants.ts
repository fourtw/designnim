export const APP_NAME = 'Panti Jompo Link'

export const FALLBACK_RPC =
  'https://polygon-mumbai.infura.io/v3/00000000000000000000000000000000'

export const FALLBACK_MAINNET_RPC = 'https://polygon-rpc.com'

export const USDT_CONTRACT_ADDRESS =
  (import.meta.env.VITE_USDT_CONTRACT as `0x${string}` | undefined) ??
  '0xC2132D05D31c914a87C6611C10748AEb04B58e8F'

export const DONATION_SAFE_ADDRESS =
  (import.meta.env.VITE_DONATION_SAFE as `0x${string}` | undefined) ??
  '0x0F1234567890abcdef1234567890aBCDEF123456'

export const POLYGON_SCAN_BASE =
  (import.meta.env.VITE_BLOCK_EXPLORER as string | undefined) ??
  'https://mumbai.polygonscan.com/tx'

export type DonationToken = 'MATIC' | 'USDT'


