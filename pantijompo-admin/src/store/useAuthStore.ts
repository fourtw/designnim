import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  address: `0x${string}` | null
  isAuthenticated: boolean
  lastSignedMessage: string | null
  setAuth: (payload: {
    address: `0x${string}`
    message: string
  }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      address: null,
      isAuthenticated: false,
      lastSignedMessage: null,
      setAuth: ({ address, message }) =>
        set({
          address,
          isAuthenticated: true,
          lastSignedMessage: message,
        }),
      logout: () =>
        set({
          address: null,
          isAuthenticated: false,
          lastSignedMessage: null,
        }),
    }),
    {
      name: 'pj-admin-auth',
    },
  ),
)

