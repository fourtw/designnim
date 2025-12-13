import { useCallback, useMemo, useState } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
} from 'wagmi'
import type { Connector } from 'wagmi'

import { isWhitelisted } from '../lib/whitelist'
import { useAuthStore } from '../store/useAuthStore'
import { ACTIVE_CHAIN } from '../lib/wagmiConfig'

const LOGIN_MESSAGE = 'Panti Jompo Link Admin Login'

export const useAuth = () => {
  const { address, status } = useAccount()
  const { connectAsync, connectors, isPending: isConnecting, error } =
    useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync, isPending: isSigning } = useSignMessage()
  const [authError, setAuthError] = useState<string | null>(null)

  const store = useAuthStore()

  const selectConnector = useCallback(
    () =>
      connectors.find((connector) => connector.id === 'metaMask') ??
      connectors[0],
    [connectors],
  )

  const login = useCallback(async (preferred?: Connector) => {
    setAuthError(null)
    try {
      let currentAddress = address
      let connector = preferred
      if (!currentAddress) {
        connector = connector ?? selectConnector()
        if (!connector) {
          throw new Error('Tidak ada wallet connector yang tersedia.')
        }
        const connection = await connectAsync({
          connector,
          chainId: ACTIVE_CHAIN.id,
        })
        currentAddress = connection.accounts[0]
      }

      if (!currentAddress) {
        throw new Error('Wallet belum terhubung.')
      }

      if (!isWhitelisted(currentAddress)) {
        throw new Error('Wallet tidak ada di whitelist admin.')
      }

      const message = `${LOGIN_MESSAGE}\nAddress: ${currentAddress}\nTimestamp: ${Date.now()}`
      await signMessageAsync({ message })

      store.setAuth({
        address: currentAddress as `0x${string}`,
        message,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal melakukan autentikasi.'
      setAuthError(message)
      throw err
    }
  }, [
    address,
    connectAsync,
    selectConnector,
    signMessageAsync,
    store,
  ])

  const logout = useCallback(() => {
    disconnect()
    store.logout()
  }, [disconnect, store])

  const isAuthenticated = store.isAuthenticated
  const isProcessing = isConnecting || isSigning

  const mainConnector: Connector | undefined = useMemo(
    () => selectConnector(),
    [selectConnector],
  )

  return {
    address: store.address ?? address,
    isAuthenticated,
    status,
    isProcessing,
    login,
    loginWithConnector: login,
    logout,
    connectors,
    preferredConnector: mainConnector,
    authError: authError ?? error?.message ?? null,
  }
}

