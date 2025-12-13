export type ChainNetwork = 'mumbai' | 'mainnet'

export type PantiJompo = {
  id: string
  name: string
  location: string
  walletAddress: `0x${string}`
  target: number
  raisedMatic: number
  raisedUsdt: number
}

export type DonationStat = {
  date: string
  matic: number
  usdt: number
}

export type TransactionRecord = {
  hash: `0x${string}`
  from: `0x${string}`
  to: PantiJompo['walletAddress']
  pantiName: string
  token: 'MATIC' | 'USDT'
  amount: number
  timestamp: number
}

