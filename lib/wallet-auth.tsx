"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { z } from 'zod';
import { ethers } from 'ethers';
import { toast } from 'sonner';

// Define types for client authentication
export const ClientSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  name: z.string(),
  email: z.string().email().optional().nullable(),
  company: z.string().optional().nullable(),
  role: z.enum(["client", "admin"]).default("client"),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export type Client = z.infer<typeof ClientSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  status: z.enum(["planning", "in_progress", "review", "completed", "on_hold"]).default("planning"),
  progress: z.number().min(0).max(100).default(0),
  clientId: z.string(),
  startDate: z.union([z.date(), z.string()]).optional(),
  targetDate: z.union([z.date(), z.string()]).optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const DocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  url: z.string().url(),
  clientId: z.string(),
  projectId: z.string().optional().nullable(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export type Document = z.infer<typeof DocumentSchema>;

export const MilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  status: z.enum(["pending", "completed"]).default("pending"),
  projectId: z.string(),
  dueDate: z.union([z.date(), z.string()]).optional(),
  completedDate: z.union([z.date(), z.string()]).optional().nullable(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export type Milestone = z.infer<typeof MilestoneSchema>;

interface WalletAuthContextType {
  client: Client | null;
  projects: Project[];
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshData: () => Promise<void>;
  isConnected: boolean;
}

const WalletAuthContext = createContext<WalletAuthContextType | null>(null);

export const useWalletAuth = () => {
  const context = useContext(WalletAuthContext);
  if (!context) {
    throw new Error('useWalletAuth must be used within WalletAuthProvider');
  }
  return context;
};

interface WalletAuthProviderProps {
  children: ReactNode;
}

export const WalletAuthProvider = ({ children }: WalletAuthProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Check for existing session on load
  useEffect(() => {
    const storedAuth = localStorage.getItem('walletAuth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setClient(parsedAuth.client);
        setIsConnected(true);
        // Refresh data when reconnecting
        refreshData();
      } catch (err) {
        console.error('Failed to parse stored auth data');
        localStorage.removeItem('walletAuth');
      }
    }
  }, []);

  // Handle wallet connection and authentication
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to connect your wallet');
      }

      // Request account access
      const ethereum = window.ethereum;
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Authenticate based on wallet address only
      const response = await fetch('/api/client-dashboard/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await response.json();

      if (!data.client) {
        throw new Error('No client data returned');
      }

      // Store client data
      setClient(data.client);
      setIsConnected(true);

      // Store auth in localStorage
      localStorage.setItem('walletAuth', JSON.stringify({ client: data.client }));

      // Load client data
      await refreshData();

      toast.success('Successfully connected wallet');
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      toast.error(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setClient(null);
    setProjects([]);
    setDocuments([]);
    setIsConnected(false);
    localStorage.removeItem('walletAuth');
    toast.info('Wallet disconnected');
  };

  // Refresh client data
  const refreshData = async () => {
    if (!client?.walletAddress) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/client-dashboard/client/${client.walletAddress}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch client data');
      }

      const data = await response.json();

      // Update state with fetched data
      setProjects(data.projects || []);
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletAuthContext.Provider
      value={{
        client,
        projects,
        documents,
        isLoading,
        error,
        connectWallet,
        disconnectWallet,
        refreshData,
        isConnected
      }}
    >
      {children}
    </WalletAuthContext.Provider>
  );
};