"use client"

import { useState, useEffect } from "react"
import { useAppKitNetwork } from "@reown/appkit/react"
import { networks } from "@/components/modules/wallet/config"
import { useSwitchChain } from "wagmi"
import { toast } from "sonner"

// Type for network information
interface NetworkInfo {
    id: number;
    name: string;
    icon: string;
}

// Main hook for network details
export function useNetworkDetails() {
    const { chainId } = useAppKitNetwork()
    const { switchChain } = useSwitchChain()
    const [availableNetworks, setAvailableNetworks] = useState<NetworkInfo[]>([])

    // Filter networks
    useEffect(() => {
        // Map networks to our format
        const mappedNetworks = networks.map(network => {
            // Ensure the network ID is a number
            const networkId = typeof network.id === 'string' ? parseInt(network.id, 10) : network.id;

            return {
                id: networkId,
                name: network.name || String(networkId),
                icon: network.name?.toLowerCase() || ""
            };
        });

        // Sort networks - BSC networks first
        mappedNetworks.sort((a, b) => {
            // Sort BSC networks first
            if (a.name.includes('BSC') && !b.name.includes('BSC')) return -1;
            if (!a.name.includes('BSC') && b.name.includes('BSC')) return 1;
            
            // Alphabetical sort for the rest
            return a.name.localeCompare(b.name);
        });

        setAvailableNetworks(mappedNetworks);
    }, []);

    // Get current network details
    const currentNetwork = networks.find(net => {
        const netId = typeof net.id === 'string' ? parseInt(net.id, 10) : net.id;
        const currentChainId = chainId ? Number(chainId) : 0;
        return netId === currentChainId;
    }) || {
        name: "Unknown",
        id: chainId ? Number(chainId) : 0
    }

    // Function to change networks
    const switchToNetwork = async (networkId: number) => {
        console.log("Attempting to switch to network:", networkId);

        // Find network name from the networks array for better toast messages
        const networkName = networks.find(net => {
            const netId = typeof net.id === 'string' ? parseInt(net.id, 10) : net.id;
            return netId === networkId;
        })?.name || `Network ${networkId}`;

        if (switchChain) {
            try {
                // switchChain is a viem/wagmi function that returns a Promise
                const result = await switchChain({ chainId: networkId });

                // Success handling
                toast.success(`Successfully switched to ${networkName}`);
                console.log("Successfully switched to network:", networkId);

                // Give UI time to update
                await new Promise(resolve => setTimeout(resolve, 1000));

                return true;
            } catch (error: any) {
                // Error handling
                toast.error(`Failed to switch network: ${error.message || "Unknown error"}`);
                console.error("Failed to switch network:", error);
                return false;
            }
        } else {
            // No switchChain function available
            toast.error("Network switching not available");
            return false;
        }
    };

    return {
        chainId: chainId ? Number(chainId) : undefined,
        currentNetwork,
        availableNetworks,
        switchToNetwork
    };
}