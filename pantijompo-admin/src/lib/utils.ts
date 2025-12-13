export const shortenAddress = (address?: string | null) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatToken = (value: number, digits = 2, symbol?: string) =>
  `${value.toFixed(digits)}${symbol ? ` ${symbol}` : ''}`

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)

export const percentProgress = (raised: number, target: number) => {
  if (!target) return 0
  return Math.min(100, Math.round((raised / target) * 100))
}

export const persist = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const readPersisted = <T>(key: string): T | null => {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn('Failed parsing stored value', error)
    return null
  }
}

