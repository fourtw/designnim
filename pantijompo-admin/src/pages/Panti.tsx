import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import rawData from '../data/pantiJompo.json'
import type { PantiJompo } from '../types'
import { DashboardLayout } from '../components/DashboardLayout'
import { PantiTable } from '../components/PantiTable'
import { useBalances } from '../hooks/useBalances'
import { ACTIVE_CHAIN } from '../lib/wagmiConfig'

type ModalState = {
  open: boolean
  editing?: PantiJompo | null
}

const emptyPanti: PantiJompo = {
  id: '',
  name: '',
  location: '',
  walletAddress: '0x0000000000000000000000000000000000000000',
  target: 0,
  raisedMatic: 0,
  raisedUsdt: 0,
}

export const Panti = () => {
  const [pantiList, setPantiList] = useState<PantiJompo[]>(
    rawData as PantiJompo[],
  )
  const [modal, setModal] = useState<ModalState>({ open: false })
  const { data: balances } = useBalances(
    pantiList.map((item) => item.walletAddress),
    ACTIVE_CHAIN.id,
  )

  const handleSave = (payload: PantiJompo) => {
    setPantiList((prev) => {
      const exists = prev.some((item) => item.id === payload.id)
      if (exists) {
        return prev.map((item) => (item.id === payload.id ? payload : item))
      }
      return [...prev, { ...payload, id: crypto.randomUUID() }]
    })
    toast.success('Data panti tersimpan!')
    setModal({ open: false })
  }

  const handleDelete = (id: string) => {
    setPantiList((prev) => prev.filter((item) => item.id !== id))
    toast.success('Panti dihapus.')
  }

  const tableData = useMemo(() => {
    if (!balances) return pantiList
    return pantiList.map((panti) => {
      const latest = balances.find(
        (balance) => balance.address === panti.walletAddress,
      )
      if (!latest) return panti
      return {
        ...panti,
        raisedMatic: latest.matic,
        raisedUsdt: latest.usdt,
      }
    })
  }, [balances, pantiList])

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold text-white">Panti Jompo</p>
          <p className="text-sm text-white/60">
            Kelola daftar panti dan wallet penerima.
          </p>
        </div>

        <button
          onClick={() => setModal({ open: true, editing: { ...emptyPanti } })}
          className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80"
        >
          Tambah Panti Baru
        </button>
      </div>

      <PantiTable
        data={tableData}
        onEdit={(panti) => setModal({ open: true, editing: panti })}
        onDelete={handleDelete}
      />

      {modal.open && (
        <PantiFormModal
          value={modal.editing ?? emptyPanti}
          onClose={() => setModal({ open: false })}
          onSubmit={handleSave}
        />
      )}
    </DashboardLayout>
  )
}

type FormProps = {
  value: PantiJompo
  onSubmit: (value: PantiJompo) => void
  onClose: () => void
}

const PantiFormModal = ({ value, onSubmit, onClose }: FormProps) => {
  const [form, setForm] = useState<PantiJompo>(value)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/90 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {value.id ? 'Edit Panti' : 'Tambah Panti'}
          </h2>
          <button
            className="text-sm text-white/60 hover:text-white"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>

        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit({ ...form, id: form.id || crypto.randomUUID() })
          }}
        >
          <label className="text-sm text-white/70">
            Nama Panti
            <input
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </label>
          <label className="text-sm text-white/70">
            Lokasi
            <input
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
              value={form.location}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  location: event.target.value,
                }))
              }
              required
            />
          </label>
          <label className="text-sm text-white/70">
            Wallet Address
            <input
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
              value={form.walletAddress}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  walletAddress: event.target.value as `0x${string}`,
                }))
              }
              required
            />
          </label>
          <label className="text-sm text-white/70">
            Target (IDR)
            <input
              type="number"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
              value={form.target}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  target: Number(event.target.value),
                }))
              }
              required
            />
          </label>
          <label className="text-sm text-white/70">
            Raised MATIC
            <input
              type="number"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
              value={form.raisedMatic}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  raisedMatic: Number(event.target.value),
                }))
              }
            />
          </label>
          <label className="text-sm text-white/70">
            Raised USDT
            <input
              type="number"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white"
              value={form.raisedUsdt}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  raisedUsdt: Number(event.target.value),
                }))
              }
            />
          </label>

          <div className="md:col-span-2 mt-4 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-slate-900"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

