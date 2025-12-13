import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'

import { USDT_ADDRESSES, usdtAbi } from '../lib/contracts'
import { publicClients } from '../lib/wagmiConfig'

type BalanceResult = {
  address: `0x${string}`
  matic: number
  usdt: number
}

export const useBalances = (
  addresses: `0x${string}`[],
  chainId: number,
  refetchInterval = 30000,
) => {
  return useQuery<BalanceResult[]>({
    queryKey: ['balances', chainId, addresses],
    queryFn: async () => {
      const client = publicClients[chainId]
      if (!client) throw new Error('Client belum dikonfigurasi.')

      const usdtAddress = USDT_ADDRESSES[chainId]
      if (!usdtAddress) throw new Error('Alamat USDT tidak ditemukan.')

      const [maticRaw, usdtRaw] = await Promise.all([
        Promise.all(addresses.map((address) => client.getBalance({ address }))),
        Promise.all(
          addresses.map((address) =>
            client.readContract({
              address: usdtAddress,
              abi: usdtAbi,
              functionName: 'balanceOf',
              args: [address],
            }),
          ),
        ),
      ])

      return addresses.map((address, idx) => ({
        address,
        matic: Number(formatUnits(maticRaw[idx], 18)),
        usdt: Number(formatUnits(usdtRaw[idx], 6)),
      }))
    },
    enabled: addresses.length > 0,
    refetchInterval,
  })
}

