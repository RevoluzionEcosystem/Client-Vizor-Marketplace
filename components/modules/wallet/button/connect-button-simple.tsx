'use client'

import { useAppKitAccount, useAppKit } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { Wallet, Loader2, LogOut } from 'lucide-react'
import { useClientMounted } from '../hooks/use-wallet-connection'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAccount, useDisconnect } from 'wagmi'

export const ConnectButtonSimple = () => {
    // Use both wagmi and AppKit hooks for better compatibility
    const wagmiAccount = useAccount()
    const { disconnect: wagmiDisconnect } = useDisconnect()
    const appkitAccount = useAppKitAccount()
    const appKit = useAppKit()
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
            await appKit.open()
        } catch (error) {
            console.error("Connection error:", error)
            toast.error("Failed to connect wallet")
        } finally {
            setTimeout(() => setIsLoading(false), 500)
        }
    }

    const handleDisconnect = async () => {
        try {
            setIsLoading(true)
            // Disconnect using both wagmi and AppKit for completeness
            if (wagmiDisconnect) {
                wagmiDisconnect()
            }
            if (appKit.close) {
                await appKit.close()
            }
            toast.success("Wallet disconnected")
        } catch (error) {
            console.error("Disconnect error:", error)
            toast.error("Failed to disconnect wallet")
        } finally {
            setTimeout(() => setIsLoading(false), 500)
        }
    }

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

    // Show disconnect button when connected
    return (
        <Button
            variant='secondary'
            onClick={handleDisconnect}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <LogOut className="mr-2 h-5 w-5" />
            )}
            Disconnect
        </Button>
    )
}