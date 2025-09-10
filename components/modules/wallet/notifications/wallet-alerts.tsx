"use client"

import { useAppKitAccount, useDisconnect, useAppKitNetwork } from '@reown/appkit/react'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { useClientMounted } from "../hooks/use-wallet-connection"
import { toast } from "sonner"

/**
 * Component that displays wallet connection alerts and notifications
 * Shows important notifications about wallet connection status, network mismatches,
 * and provides actions for users to resolve issues
 */
export default function WalletAlerts() {
    const { isConnected } = useAppKitAccount()
    const { switchNetwork } = useAppKitNetwork()
    const { disconnect } = useDisconnect()
    const [dismissed, setDismissed] = useState<Record<string, boolean>>({})
    const mounted = useClientMounted()

    // Reset dismissed state when connection changes
    useEffect(() => {
        if (!isConnected) {
            setDismissed({})
        }
    }, [isConnected])


    // Handle reconnecting wallet
    const handleReconnect = async () => {
        try {
            // Disconnect first
            await disconnect()

            // Wait a bit then the user can connect again
            toast.info("Wallet disconnected", {
                description: "Please connect again manually"
            })
        } catch (error) {
            console.error("Error reconnecting wallet:", error)
        }
    }

    // Don't show anything if nothing to report or during SSR
    if (!mounted || !isConnected || dismissed["all"]) {
        return null
    }

    return (
        <AnimatePresence>
            {/* Dismiss All Button */}
            {(Object.keys(dismissed).length > 0 && !dismissed["all"]) && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs opacity-70 hover:opacity-100 ml-auto block"
                    onClick={() => setDismissed({ all: true })}
                >
                    Dismiss All Alerts
                </Button>
            )}
        </AnimatePresence>
    )
}