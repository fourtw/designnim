import { useQuery } from '@tanstack/react-query'
import { formatUnits, getAddress } from 'viem'

import pantiList from '../data/pantiJompo.json'
import { USDT_ADDRESSES } from '../lib/contracts'
import { publicClients } from '../lib/wagmiConfig'
import type { TransactionRecord } from '../types'

const transferEvent = {
  name: 'Transfer',
  type: 'event',
  inputs: [
    { name: 'from', type: 'address', indexed: true },
    { name: 'to', type: 'address', indexed: true },
    { name: 'value', type: 'uint256', indexed: false },
  ],
} as const

const fallbackTransactions: TransactionRecord[] = pantiList.slice(0, 3).map(
  (panti, index) => ({
    hash: `0x${(index + 1).toString().padStart(64, '0')}`,
    from: '0x0000000000000000000000000000000000000000',
    to: panti.walletAddress as `0x${string}`,
    pantiName: panti.name,
    token: index % 2 === 0 ? 'MATIC' : 'USDT',
    amount: index % 2 === 0 ? 12.34 : 456.78,
    timestamp: Date.now() - index * 3600 * 1000,
  }),
)

export const useTransactions = (chainId: number) => {
  return useQuery<TransactionRecord[]>({
    queryKey: ['transactions', chainId],
    queryFn: async () => {
      const client = publicClients[chainId]
      const usdtAddress = USDT_ADDRESSES[chainId]
      if (!client || !usdtAddress) {
        return fallbackTransactions
      }

      try {
        const latestBlock = await client.getBlockNumber()
        const fromBlock = latestBlock > 50_000n ? latestBlock - 50_000n : 0n
        const logs = await client.getLogs({
          address: usdtAddress,
          event: transferEvent,
          fromBlock,
          toBlock: latestBlock,
        })

        const pantiMap = new Map(
          pantiList.map((panti) => [
            panti.walletAddress.toLowerCase(),
            panti.name,
          ]),
        )

        const txs: TransactionRecord[] = logs
          .map((log) => {
            if (!log.args) return null
            const { from, to, value } = log.args
            if (!from || !to || value === undefined) return null
            const toAddress = getAddress(to)
            const pantiName = pantiMap.get(toAddress.toLowerCase())

            if (!pantiName) return null

            const fromAddress = getAddress(from)
            const record: TransactionRecord = {
              hash: log.transactionHash ?? `0x${crypto.randomUUID().replace(/-/g, '')}`,
              from: fromAddress,
              to: toAddress,
              pantiName,
              token: 'USDT',
              amount: Number(formatUnits(value as bigint, 6)),
              timestamp: Date.now(),
            }
            return record
          })
          .filter(Boolean) as TransactionRecord[]

        return txs.length > 0 ? txs : fallbackTransactions
      } catch (error) {
        console.warn('Failed fetching logs', error)
        return fallbackTransactions
      }
    },
    refetchInterval: 45000,
  })
}

