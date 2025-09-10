'use client'

import { useAppKitAccount, useAppKit } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { Wallet, Loader2, ArrowRight } from 'lucide-react'
import { useClientMounted } from '../hooks/use-wallet-connection'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

interface ConnectButtonSwapProps {
    onSwap?: () => void;
    isDisabled?: boolean;
}

export const ConnectButtonSwap = ({ onSwap, isDisabled = false }: ConnectButtonSwapProps) => {
    // Use both wagmi and AppKit hooks for better compatibility
    const wagmiAccount = useAccount()
    const appkitAccount = useAppKitAccount()
    const { open } = useAppKit()
    const mounted = useClientMounted()
    const [isLoading, setIsLoading] = useState(false)

    // Use combined connection state for better reliability
    const isConnected = wagmiAccount.isConnected || appkitAccount.isConnected

    // Log connection state for debugging
    useEffect(() => {
        if (mounted) {
            console.log("Wallet connection state:", {
                wagmi: wagmiAccount.isConnected,
                appkit: appkitAccount.isConnected,
                address: wagmiAccount.address || appkitAccount.address
            });
        }
    }, [wagmiAccount.isConnected, appkitAccount.isConnected, mounted, wagmiAccount.address, appkitAccount.address]);

    // Don't render during SSR to prevent hydration errors
    if (!mounted) return null

    const handleConnect = async () => {
        try {
            setIsLoading(true)
            await open()
        } catch (error) {
            console.error("Connection error:", error)
            toast.error("Failed to connect wallet")
        } finally {
            setTimeout(() => setIsLoading(false), 500)
        }
    }

    const handleSwap = async () => {
        try {
            setIsLoading(true)
            // Execute swap logic here
            if (onSwap) {
                await onSwap()
            } else {
                toast.info("Swap functionality not implemented yet")
            }
        } catch (error) {
            console.error("Swap error:", error)
            toast.error("Failed to execute swap")
        } finally {
            setTimeout(() => setIsLoading(false), 500)
        }
    }

    // If not connected, show connect button
    if (!isConnected) {
        return (
            <Button
                variant='secondary'
                onClick={handleConnect}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <Wallet className="mr-2 h-5 w-5" />
                )}
                Connect Wallet
            </Button>
        )
    }

    // Connected state - show swap button
    return (
        <Button
            variant='secondary'
            onClick={handleSwap}
            disabled={isDisabled || isLoading}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <ArrowRight className="mr-2 h-5 w-5" />
            )}
            Swap
        </Button>
    )
}