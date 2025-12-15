/**
 * Helper functions for wallet detection and connection
 */

export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const ethereum = (window as any).ethereum
  return !!(
    ethereum?.isMetaMask ||
    ethereum?.providers?.some((p: any) => p.isMetaMask) ||
    (ethereum && ethereum._metamask)
  )
}

export const getMetaMaskProvider = () => {
  if (typeof window === 'undefined') return null
  
  const ethereum = (window as any).ethereum
  
  if (!ethereum) return null
  
  // Check if it's MetaMask directly
  if (ethereum.isMetaMask) {
    return ethereum
  }
  
  // Check if it's in providers array (for multiple wallets)
  if (ethereum.providers) {
    const metaMaskProvider = ethereum.providers.find((p: any) => p.isMetaMask)
    if (metaMaskProvider) return metaMaskProvider
  }
  
  // Fallback: if ethereum exists and has _metamask, assume it's MetaMask
  if (ethereum._metamask) {
    return ethereum
  }
  
  return null
}

export const requestMetaMaskConnection = async (): Promise<string[]> => {
  const provider = getMetaMaskProvider()
  
  if (!provider) {
    throw new Error('MetaMask tidak ditemukan. Pastikan extension sudah terinstall.')
  }
  
  try {
    const accounts = await provider.request({ method: 'eth_requestAccounts' })
    return accounts
  } catch (err: any) {
    if (err.code === 4001) {
      throw new Error('Koneksi ditolak oleh pengguna.')
    }
    if (err.code === -32002) {
      throw new Error('Request sudah pending. Silakan buka MetaMask dan approve request yang ada.')
    }
    throw new Error(err.message || 'Gagal menghubungkan MetaMask.')
  }
}

export const switchToLocalNetwork = async (): Promise<void> => {
  const provider = getMetaMaskProvider()
  
  if (!provider) {
    throw new Error('MetaMask tidak ditemukan.')
  }
  
  const localChainId = '0x539' // 1337 in hex
  
  try {
    // Try to switch
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: localChainId }],
    })
  } catch (switchErr: any) {
    // If network doesn't exist, add it
    if (switchErr.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: localChainId,
          chainName: 'Hardhat Local',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['http://127.0.0.1:8545'],
          blockExplorerUrls: [],
        }],
      })
    } else {
      throw switchErr
    }
  }
}

export const switchToPolygonAmoy = async (): Promise<void> => {
  const provider = getMetaMaskProvider()
  
  if (!provider) {
    throw new Error('MetaMask tidak ditemukan.')
  }
  
  const amoyChainId = '0x13882' // 80002 in hex
  
  try {
    // Try to switch
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: amoyChainId }],
    })
  } catch (switchErr: any) {
    // If network doesn't exist, add it
    if (switchErr.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: amoyChainId,
          chainName: 'Polygon Amoy',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://rpc-amoy.polygon.technology'],
          blockExplorerUrls: ['https://amoy.polygonscan.com'],
        }],
      })
    } else {
      throw switchErr
    }
  }
}
