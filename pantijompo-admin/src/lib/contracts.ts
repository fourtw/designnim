import { polygon, polygonMumbai } from 'wagmi/chains'

export const USDT_ADDRESSES: Record<number, `0x${string}`> = {
  [polygonMumbai.id]: '0xA02f6adc7926f082c2d7dC81A7c856D7E8c1220E',
  [polygon.id]: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
}

export const usdtAbi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const

