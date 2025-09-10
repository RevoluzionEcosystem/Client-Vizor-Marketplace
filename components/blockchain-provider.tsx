"use client";

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './modules/wallet/config';

// Create a query client for React Query
const queryClient = new QueryClient();

interface BlockchainProviderProps {
  children: React.ReactNode;
}

// Create a Blockchain Provider component that provides Wagmi context
export default function BlockchainProvider({ children }: BlockchainProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
