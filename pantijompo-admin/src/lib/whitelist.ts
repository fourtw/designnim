export const ADMIN_WHITELIST: string[] = [
  '0xd5e355310c008784cb6eac06be9504e2a285f3e5',
  '0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
]

export const isWhitelisted = (address?: string | null) => {
  if (!address) return false
  return ADMIN_WHITELIST.some(
    (allowed) => allowed.toLowerCase() === address.toLowerCase(),
  )
}

