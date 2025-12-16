import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { FUNDRAISING_CONTRACT_ADDRESS } from '../lib/constants'
import { fundraisingAbi } from '../lib/abi'
import { useFundraiserCount } from '../hooks/useFundraising'
import { FundraiserCard } from './FundraiserCard'
import type { FundraiserFromContract } from '../types'

type Props = {
  onSelect: (fundraiser: FundraiserFromContract) => void
}

export const FundraisersList = ({ onSelect }: Props) => {
  const { count, refetch: refetchCount } = useFundraiserCount()
  const [fundraisers, setFundraisers] = useState<FundraiserFromContract[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Refetch count periodically to catch new fundraisers
  useEffect(() => {
    const interval = setInterval(() => {
      refetchCount()
    }, 10000) // Refetch every 10 seconds

    return () => clearInterval(interval)
  }, [refetchCount])

  // Fetch all fundraisers
  useEffect(() => {
    if (count === 0) {
      setFundraisers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const fetchAll = async () => {
      const fetched: FundraiserFromContract[] = []
      
      // Fetch each fundraiser by ID
      for (let i = 1; i <= count; i++) {
        try {
          // We'll use a workaround: create a component that fetches individually
          // For now, we'll store the IDs and let individual components fetch
          fetched.push({
            id: BigInt(i),
            owner: '0x0000000000000000000000000000000000000000' as `0x${string}`,
            name: '',
            location: '',
            description: '',
            targetAmount: BigInt(0),
            raisedAmount: BigInt(0),
            isActive: false,
            createdAt: BigInt(0),
            recipient: '0x0000000000000000000000000000000000000000' as `0x${string}`,
          })
        } catch (err) {
          console.error(`Error preparing fundraiser ${i}:`, err)
        }
      }
      
      setFundraisers(fetched)
      setIsLoading(false)
    }

    fetchAll()
  }, [count])

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-12 text-white">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Fundraiser Unggulan
            </p>
            <h3 className="text-2xl font-semibold">
              Fokus pada perawatan lansia dan transparansi dana
            </h3>
          </div>
        </div>
        <div className="mt-8 text-center text-white/70">
          <p>Memuat fundraiser dari blockchain...</p>
        </div>
      </section>
    )
  }

  if (fundraisers.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-12 text-white">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Fundraiser Unggulan
            </p>
            <h3 className="text-2xl font-semibold">
              Fokus pada perawatan lansia dan transparansi dana
            </h3>
          </div>
        </div>
        <div className="mt-8 text-center text-white/70">
          <p>Belum ada fundraiser. Jadilah yang pertama membuat fundraiser!</p>
        </div>
      </section>
    )
  }

  return (
  <section className="mx-auto max-w-6xl px-6 py-12 text-white">
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">
          Fundraiser Unggulan
        </p>
        <h3 className="text-2xl font-semibold">
          Fokus pada perawatan lansia dan transparansi dana
        </h3>
      </div>
      <p className="text-sm text-white/70 md:max-w-sm">
        Semua kampanye telah diverifikasi dan seluruh transaksi dapat dilacak di
        PolygonScan untuk memastikan setiap rupiah crypto tersalurkan.
      </p>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {fundraisers.map((fundraiser) => (
          <FundraiserItem
            key={fundraiser.id.toString()}
            fundraiserId={fundraiser.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  </section>
)
}

// Component to fetch and display individual fundraiser
const FundraiserItem = ({
  fundraiserId,
  onSelect,
}: {
  fundraiserId: bigint
  onSelect: (fundraiser: FundraiserFromContract) => void
}) => {
  const isContractDeployed = FUNDRAISING_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
  
  const { data, isLoading } = useReadContract({
    address: FUNDRAISING_CONTRACT_ADDRESS,
    abi: fundraisingAbi,
    functionName: 'getFundraiser',
    args: [fundraiserId],
    query: {
      enabled: isContractDeployed,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  })

  if (isLoading || !data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 animate-pulse">
        <div className="h-48 bg-slate-700 rounded-t-3xl mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
    )
  }

  const fundraiser: FundraiserFromContract = {
    id: data.id,
    owner: data.owner,
    name: data.name,
    location: data.location,
    description: data.description,
    targetAmount: data.targetAmount,
    raisedAmount: data.raisedAmount,
    isActive: data.isActive,
    createdAt: data.createdAt,
    recipient: data.recipient,
  }

  return <FundraiserCard fundraiser={fundraiser} onSelect={onSelect} />
}
