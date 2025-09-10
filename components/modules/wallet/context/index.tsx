"use client"

import { wagmiAdapter, solanaWeb3JsAdapter, projectId, networks } from '../config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { WagmiProvider, type Config, type State } from 'wagmi'

// Set up queryClient with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000, // 10 secs
    },
  },
})

// Set up metadata with rich branding
const metadata = {
  name: 'Vizor',
  description: 'Seamlessly connect to the Vizor dApp for an optimized blockchain experience.',
  url: 'https://vizor.app',
  icons: ['https://vizor.app/assets/images/vizor.webp'],
  disclaimer: {
    enabled: true,
    termsUrl: 'https://vizor.app/terms',
    privacyUrl: 'https://vizor.app/legal'
  },
}

// Create the AppKit instance with all advanced features
export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  projectId,
  networks,
  metadata,
  themeMode: 'dark',

  // Enable all core features
  features: {
    analytics: true,
    email: true, // default to true
    socials: [
      "google",
      "x",
      "github",
      "discord",
      "apple",
      "facebook",
      "farcaster",
    ],
    emailShowWallets: true,
    legalCheckbox: true,  // Enable legal checkbox feature
  },
  
  // Configure wallet display - ONLY_MOBILE shows the All Wallets button only on mobile
  allWallets: "ONLY_MOBILE", 
  
  // Specify wallets to feature prominently in the modal
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // WalletConnect
    "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66", // Safe
  ],
  
  themeVariables: {
    '--w3m-font-family': '"Inter", sans-serif',
    '--w3m-accent': '#F59E0B',
    '--w3m-border-radius-master': '0.75rem',
  }
})

// Update the ContextProvider to accept initialState prop instead of cookies
function ContextProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
