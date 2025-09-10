"use client"

import { Network } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { AdvancedSettings } from "../.."
import { useNetworkDetails } from "../../hooks/use-network-details"
import { NetworkDetailsPanel } from "./network-details-panel"
import { useCallback, useEffect } from "react"

export function NetworkSettings() {
    // Get network details from hook
    const {
        currentNetwork,
        availableNetworks,
        switchToNetwork
    } = useNetworkDetails();


    // Handle network change
    const handleNetworkChange = (networkId: string) => {
        switchToNetwork(parseInt(networkId, 10));
    };    return (
        <AdvancedSettings
            icon={<Network className="mr-2 text-amber-500 h-5 w-5" />}
            title="Network"
        >
            <div className="space-y-4">
                {/* Network Details Panel */}
                <NetworkDetailsPanel 
                    currentNetwork={currentNetwork}
                    availableNetworks={availableNetworks}
                    onNetworkChange={handleNetworkChange}
                />
            </div>
        </AdvancedSettings>
    );
}