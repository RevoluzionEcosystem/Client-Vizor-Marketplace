'use client'

import { useEffect, useRef } from 'react'
import { useAppKitAccount, useAppKitEvents, useAppKitNetwork } from '@reown/appkit/react'
import { toast } from 'sonner'
import { Wallet, Check, XCircle, BarChart, AlertTriangle } from 'lucide-react'
import { useClientMounted } from './use-wallet-connection'

// Define the structure of AppKit events based on documentation
interface AppKitEvent {
    name?: string;
    data?: {
        chainId?: string;
        message?: string;
        [key: string]: any;
    };
}

export function useWalletNotifications() {
    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const events = useAppKitEvents() as AppKitEvent
    const mounted = useClientMounted()

    // Use a ref to keep track of previous connection state to prevent duplicate toasts
    const previousConnectionState = useRef<boolean>(false)

    useEffect(() => {
        if (!mounted) return

        // Watch for wallet connection/disconnection events
        if (isConnected && !previousConnectionState.current) {
            // Connected
            const formattedAddress = address ?
                `${address.substring(0, 6)}...${address.substring(address.length - 4)}` :
                'Unknown'

            toast.success('Wallet Connected', {
                description: `Connected to ${formattedAddress}`,
                icon: <Check className="h-4 w-4 text-green-500" />,
                duration: 4000
            })
        } else if (!isConnected && previousConnectionState.current) {
            // Disconnected
            toast.info('Wallet Disconnected', {
                description: 'Your wallet has been disconnected',
                icon: <XCircle className="h-4 w-4 text-slate-500" />,
                duration: 4000
            })
        }

        previousConnectionState.current = isConnected
    }, [isConnected, address, mounted])

    // Listen for AppKit events
    useEffect(() => {
        if (!mounted || !events || !events.name) return

        // Only handle specific events we care about
        switch (events.name) {
            case 'CONNECT_SUCCESS':
                toast.success('Connection Successful', {
                    description: 'Your wallet has been connected successfully',
                    icon: <Wallet className="h-4 w-4 text-green-500" />,
                    duration: 4000
                })
                break

            case 'DISCONNECT_SUCCESS':
                toast.info('Disconnected Successfully', {
                    description: 'Your wallet has been disconnected',
                    icon: <XCircle className="h-4 w-4 text-slate-500" />,
                    duration: 4000
                })
                break

            case 'CHAIN_CHANGED':
                if (events.data?.chainId) {
                    toast.success('Network Changed', {
                        description: `Switched to network ID: ${events.data.chainId}`,
                        icon: <BarChart className="h-4 w-4 text-amber-500" />,
                        duration: 4000
                    })
                }
                break

            case 'ERROR':
                toast.error('Connection Error', {
                    description: events.data?.message || 'Failed to connect wallet',
                    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
                    duration: 5000
                })
                break

            default:
                // Ignore other events
                break
        }
    }, [events, mounted])

    return null // This hook doesn't return anything, it just sets up listeners
}