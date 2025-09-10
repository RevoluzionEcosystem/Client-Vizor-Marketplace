'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Wallet, Loader2, Check, AlertTriangle } from 'lucide-react'
import { useWalletConnector } from '../hooks/use-wallet-connector'

type WalletConnectorProps = {
    // Connection options
    autoConnect?: boolean
    preferredNetwork?: number
    onConnect?: (address: string) => void
    onDisconnect?: () => void
    onNetworkChange?: (chainId: number) => void

    // UI options
    variant?: "secondary" | "ghost" | "link" | "default" | "destructive" | "outline"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
    showAddress?: boolean
    showNetworkBadge?: boolean
    showIcon?: boolean
    customIcon?: ReactNode
    connectLabel?: string
    disconnectLabel?: string
    switchNetworkLabel?: string

    // Render props
    renderConnected?: (address: string, disconnect: () => void) => ReactNode
    renderDisconnected?: (connect: () => void) => ReactNode
    renderWrongNetwork?: (switchNetwork: () => void) => ReactNode
}

/**
 * A flexible wallet connector component that can be used throughout the application
 * to provide a consistent wallet connection experience with different UI presentations.
 */
export function WalletConnector({
    // Connection options
    autoConnect = false,
    preferredNetwork,
    onConnect,
    onDisconnect,
    onNetworkChange,

    // UI options
    variant = "secondary",
    size = "sm",
    className = "",
    showAddress = true,
    showNetworkBadge = false,
    showIcon = true,
    customIcon,
    connectLabel = "Connect Wallet",
    disconnectLabel = "Disconnect",
    switchNetworkLabel = "Switch Network",

    // Render props
    renderConnected,
    renderDisconnected,
    renderWrongNetwork
}: WalletConnectorProps) {
    const {
        isConnected,
        address,
        chainId,
        isLoading,
        error,
        mounted,
        connect,
        disconnect,
        switchNetwork,
        shortenAddress
    } = useWalletConnector({
        autoConnect,
        preferredNetwork,
        onConnect,
        onDisconnect,
        onNetworkChange
    })

    // Don't render during SSR to prevent hydration errors
    if (!mounted) return null

    // Handle the wrong network case
    if (isConnected && preferredNetwork && chainId !== preferredNetwork) {
        if (renderWrongNetwork) {
            return renderWrongNetwork(() => switchNetwork(preferredNetwork))
        }

        return (
            <Button
                variant="destructive"
                size={size}
                className={className}
                onClick={() => switchNetwork(preferredNetwork)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <AlertTriangle className="mr-2 h-4 w-4" />
                )}
                {switchNetworkLabel}
            </Button>
        )
    }

    // Connected state
    if (isConnected && address) {
        // Use custom render function if provided
        if (renderConnected) {
            return renderConnected(address, disconnect)
        }

        return (
            <div className="flex items-center gap-2">
                {showNetworkBadge && (
                    <span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">
                        {chainId}
                    </span>
                )}

                <Button
                    variant={variant}
                    size={size}
                    className={className}
                    onClick={disconnect}
                >
                    {showIcon && (
                        customIcon || <Check className="mr-2 h-4 w-4" />
                    )}
                    {showAddress ? shortenAddress : disconnectLabel}
                </Button>
            </div>
        )
    }

    // Disconnected state
    if (renderDisconnected) {
        return renderDisconnected(connect)
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={connect}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                showIcon && (customIcon || <Wallet className="mr-2 h-4 w-4" />)
            )}
            {connectLabel}
        </Button>
    )
}