'use client'
import { useState } from 'react'
import { useDisconnect, useAppKit, useAppKitNetwork, useAppKitAccount } from '@reown/appkit/react'
import { networks } from '../config'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, ArrowLeftRight, RefreshCw, LayoutGrid, History } from 'lucide-react'
import { useClientMounted } from "../hooks/use-wallet-connection"
import { toast } from "sonner"

export const ActionButtonList = ({
    showLabels = true,
    direction = "horizontal"
}) => {
    const { disconnect } = useDisconnect()
    const { open } = useAppKit()
    const { switchNetwork } = useAppKitNetwork()
    const { isConnected, address } = useAppKitAccount()
    const [isLoading, setIsLoading] = useState(false)
    const mounted = useClientMounted()

    // Disconnect wallet with loading state
    const handleDisconnect = async () => {
        try {
            setIsLoading(true)
            await disconnect()
            toast.success("Wallet disconnected")
        } catch (error) {
            console.error("Failed to disconnect:", error)
            toast.error("Disconnect failed")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle network switching
    const handleSwitchNetwork = async (networkIndex = 1) => {
        try {
            setIsLoading(true)
            await switchNetwork(networks[networkIndex])
            toast.success(`Switched to ${networks[networkIndex].name}`)
        } catch (error) {
            console.error("Failed to switch network:", error)
            toast.error("Network switch failed")
        } finally {
            setIsLoading(false)
        }
    }

    // Don't render during SSR to prevent hydration errors
    if (!mounted) return null

    // If not connected, just show the Connect button
    if (!isConnected) {
        return (
            <Button
                variant="default"
                size="sm"
                className=""
                onClick={() => open()}
            >
                <Wallet className="h-4 w-4 mr-2" />
                {showLabels ? "Connect" : null}
            </Button>
        )
    } const containerClass = direction === "vertical"
        ? "flex flex-col space-y-2"
        : "flex flex-row space-x-2"

    return (
        <div className={containerClass}>
            <Button
                variant="default"
                size="sm"
                className=""
                onClick={() => open()}
                disabled={isLoading}
            >
                <LayoutGrid className="h-4 w-4 mr-2" />
                {showLabels ? "Wallet" : null}
            </Button>
            <Button
                variant="default"
                size="sm"
                className=""
                onClick={() => window.location.href = '/wallet-history'}
                disabled={isLoading}
            >
                <History className="h-4 w-4 mr-2" />
                {showLabels ? "History" : null}
            </Button>

            <Button
                variant="default"
                size="sm"
                className=""
                onClick={() => handleSwitchNetwork()}
                disabled={isLoading}
            >
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <ArrowLeftRight className="h-4 w-4 mr-2" />}
                {showLabels ? "Switch" : null}
            </Button>

            <Button
                variant="destructive"
                size="sm"
                className=""
                onClick={handleDisconnect}
                disabled={isLoading}
            >
                <LogOut className="h-4 w-4 mr-2" />
                {showLabels ? "Disconnect" : null}
            </Button>
        </div>
    )
}
