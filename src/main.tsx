import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { Toaster } from 'react-hot-toast'

import App from './App'
import './index.css'
import { wagmiConfig } from './lib/wagmi'

const queryClient = new QueryClient()

createRoot(document.getElementById('app') as HTMLElement).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)


