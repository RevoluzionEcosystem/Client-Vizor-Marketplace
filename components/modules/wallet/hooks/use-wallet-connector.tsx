'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAppKitAccount, useAppKit, useAppKitNetwork, useDisconnect } from '@reown/appkit/react'
import { toast } from 'sonner'
import { useClientMounted } from './use-wallet-connection'
import { networks } from '../config'

/**
 * Enhanced wallet hook that provides simplified wallet connection functionality
 * while leveraging the existing Reown AppKit infrastructure.
 * 
 * @param options Configuration options for the wallet connector
 * @returns Object with wallet state and methods
 */
export function useWalletConnector(options?: {
    autoConnect?: boolean;
    onConnect?: (address: string) => void;
    onDisconnect?: () => void;
    onNetworkChange?: (chainId: number) => void;
    preferredNetwork?: number;
}) {
    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { open } = useAppKit()
    const { switchNetwork } = useAppKitNetwork()
    const { disconnect } = useDisconnect()
    const mounted = useClientMounted()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Connect to wallet
    const connect = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            await open()

            if (options?.onConnect && address) {
                options.onConnect(address)
            }

            return true
        } catch (err) {
            console.error("Wallet connection error:", err)
            const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet"
            setError(errorMessage)
            toast.error("Connection failed", {
                description: errorMessage
            })
            return false
        } finally {
            setIsLoading(false)
        }
    }, [open, address, options?.onConnect])

    // Disconnect from wallet
    const disconnectWallet = useCallback(async () => {
        try {
            setIsLoading(true)
            await disconnect()

            if (options?.onDisconnect) {
                options.onDisconnect()
            }

            return true
        } catch (err) {
            console.error("Wallet disconnection error:", err)
            const errorMessage = err instanceof Error ? err.message : "Failed to disconnect wallet"
            setError(errorMessage)
            toast.error("Disconnection failed", {
                description: errorMessage
            })
            return false
        } finally {
            setIsLoading(false)
        }
    }, [disconnect, options?.onDisconnect])

    // Switch network
    const switchToNetwork = useCallback(async (networkId: number) => {
        try {
            setIsLoading(true)
            setError(null)

            const targetNetwork = networks.find(net => net.id === networkId)
            if (!targetNetwork) {
                throw new Error(`Network with ID ${networkId} not found`)
            }

            await switchNetwork(targetNetwork)

            if (options?.onNetworkChange) {
                options.onNetworkChange(networkId)
            }

            return true
        } catch (err) {
            console.error("Network switch error:", err)
            const errorMessage = err instanceof Error ? err.message : "Failed to switch network"
            setError(errorMessage)
            toast.error("Network switch failed", {
                description: errorMessage
            })
            return false
        } finally {
            setIsLoading(false)
        }
    }, [switchNetwork, options?.onNetworkChange])

    // Auto-connect if specified
    useEffect(() => {
        if (mounted && options?.autoConnect && !isConnected && !isLoading) {
            connect()
        }
    }, [mounted, options?.autoConnect, isConnected, isLoading, connect])

    // Auto-switch to preferred network if specified
    useEffect(() => {
        if (
            mounted &&
            options?.preferredNetwork &&
            isConnected &&
            !isLoading &&
            chainId !== options.preferredNetwork
        ) {
            switchToNetwork(options.preferredNetwork)
        }
    }, [mounted, options?.preferredNetwork, isConnected, isLoading, chainId, switchToNetwork])

    // Return the wallet connector interface
    return {
        // State
        isConnected,
        address,
        chainId,
        isLoading,
        error,
        mounted,

        // Methods
        connect,
        disconnect: disconnectWallet,
        switchNetwork: switchToNetwork,

        // Utils
        shortenAddress: address ?
            `${address.substring(0, 6)}...${address.substring(address.length - 4)}` :
            '',
    }
}