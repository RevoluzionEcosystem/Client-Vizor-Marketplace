"use client"

import { useState, useEffect } from "react"
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { formatCoin } from "@/lib/helpers"
import { networks } from "@/components/modules/wallet/config"
import { usePublicClient } from "wagmi"
import { NETWORK_MAP, getNetworkId } from "@/lib/network-utils"

// Type for RPC status result
interface RpcStatus {
    url: string;
    status: 'connected' | 'error' | 'pending';
    latency?: number;
}

// Function to get explorer URL for an address based on network
function getExplorerUrl(networkName: string, address: string): string {
    try {
        // Get network ID from network name
        const networkId = getNetworkId(networkName);
        
        // Get explorer URL from NETWORK_MAP
        const explorerUrl = networkId && NETWORK_MAP[networkId]?.explorer;
        
        // Use the first blockExplorerUrl as fallback if explorer is not available
        const fallbackUrl = networkId && NETWORK_MAP[networkId]?.blockExplorerUrls?.[0];
        
        // Default to etherscan if no explorer found
        const baseUrl = explorerUrl || fallbackUrl || 'https://etherscan.io';
        
        // Special case for non-EVM networks that might need different URL formats
        if (networkId) {
            switch(networkId) {
                // Customize for non-standard address URL formats
                case 'sol': 
                    return `${baseUrl}/account/${address}`;
                case 'ada': 
                    return `${baseUrl}/address/${address}`;
                case 'near':
                    return `${baseUrl}/accounts/${address}`;
                case 'dot':
                case 'ksm':
                    return `${baseUrl}/account/${address}`;
                case 'atom':
                case 'osmo':
                    return `${baseUrl}/account/${address}`;
                case 'sui':
                    return `${baseUrl}/address/${address}`;
                case 'icp':
                    return `${baseUrl}/account/${address}`;
                case 'trx':
                    return `${baseUrl}/#/address/${address}`;
                default:
                    // Default format for EVM-compatible chains
                    return `${baseUrl}/address/${address}`;
            }
        }
        
        // Fallback to standard EVM format if network not identified
        return `${baseUrl}/address/${address}`;
    } catch (error) {
        console.error("Error generating explorer URL:", error);
        // Default to Etherscan as fallback
        return `https://etherscan.io/address/${address}`;
    }
}

// Get native currency symbol based on network
function getNativeCurrencySymbol(networkName: string): string {
    const networkMap: Record<string, string> = {
        // Ethereum and L2s
        'ethereum': 'ETH',
        'eth': 'ETH',
        'arbitrum': 'ETH',
        'arbitrum one': 'ETH',
        'arbitrum nova': 'ETH',
        'optimism': 'ETH',
        'base': 'ETH',
        'linea': 'ETH',
        'scroll': 'ETH',
        'zksync': 'ETH',
        'zksync era': 'ETH',
        'zora': 'ETH',
        'mode': 'ETH',
        
        // BSC/BNB Chain
        'bsc': 'BNB',
        'binance': 'BNB',
        'binance-smart-chain': 'BNB',
        'bnb': 'BNB',
        'bnb smart chain': 'BNB',
        'bnb-smart-chain': 'BNB',
        'bnb-chain': 'BNB',
        'smart chain': 'BNB',
        
        // Other major chains
        'polygon': 'MATIC',
        'polygon zkevm': 'ETH',
        'polygon zkEVM': 'ETH',
        'avalanche': 'AVAX',
        'avalanche c-chain': 'AVAX',
        'fantom': 'FTM',
        'fantom opera': 'FTM',
        'cronos': 'CRO',
        'harmony': 'ONE',
        'harmony shard 0': 'ONE',
        'gnosis': 'xDAI',
        'gnosis chain': 'xDAI',
        'xdai': 'xDAI',
        
        // Cosmos ecosystem
        'cosmos': 'ATOM',
        'cosmos hub': 'ATOM',
        'osmosis': 'OSMO',
        'juno': 'JUNO',
        'secret': 'SCRT',
        'evmos': 'EVMOS',
        'injective': 'INJ',
        
        // Other notable chains
        'solana': 'SOL',
        'near': 'NEAR',
        'aurora': 'ETH',
        'celo': 'CELO',
        'algorand': 'ALGO',
        'tron': 'TRX',
        'polkadot': 'DOT',
        'kusama': 'KSM',
        'moonbeam': 'GLMR',
        'moonriver': 'MOVR',
        'filecoin': 'FIL',
        'flow': 'FLOW',
        'hedera': 'HBAR',
        'cardano': 'ADA',
        'oasis': 'ROSE',
        'metis': 'METIS',
        'conflux': 'CFX',
        'klaytn': 'KLAY',
        'sui': 'SUI',
        'aptos': 'APT',
        'mantle': 'MNT',
        'ton': 'TON'
    };

    // Normalize the name by converting to lowercase and removing any special characters
    const normalizedName = networkName.toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
        
    // First try exact match
    if (networkMap[normalizedName]) {
        return networkMap[normalizedName];
    }
    
    // Then try partial match (for networks like "BNB Smart Chain (56)")
    for (const [key, value] of Object.entries(networkMap)) {
        if (normalizedName.includes(key)) {
            return value;
        }
    }
    
    // Try matching by chainId if the name contains it (e.g., "Ethereum (1)")
    const chainIdMatch = normalizedName.match(/\((\d+)\)/);
    if (chainIdMatch) {
        const chainId = parseInt(chainIdMatch[1]);
        switch(chainId) {
            case 1: return 'ETH';        // Ethereum Mainnet
            case 56: return 'BNB';       // BSC Mainnet
            case 137: return 'MATIC';    // Polygon
            case 43114: return 'AVAX';   // Avalanche
            case 250: return 'FTM';      // Fantom
            case 42161: return 'ETH';    // Arbitrum One
            case 10: return 'ETH';       // Optimism
            case 8453: return 'ETH';     // Base
            case 100: return 'xDAI';     // Gnosis Chain
            case 324: return 'ETH';      // zkSync Era
            case 1101: return 'ETH';     // Polygon zkEVM
            case 59144: return 'ETH';    // Linea
            case 534352: return 'ETH';   // Scroll
            default: return 'Native';
        }
    }
    
    // Default fallback
    return 'Native';
}

// Main hook for wallet details
export function useWalletDetails() {
    const { address, isConnected } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const publicClient = usePublicClient()
    const [balance, setBalance] = useState("0.00")
    const [rpc, setRpc] = useState<RpcStatus>({
        url: "Not connected",
        status: "pending"
    })

    // Get network details from the networks config
    const network = networks.find(net => net.id === chainId) || {
        name: "Unknown",
        id: chainId || 0
    }

    // Get native currency symbol
    const currencySymbol = getNativeCurrencySymbol(network.name || "");

    // Fetch balance using publicClient
    useEffect(() => {
        let isMounted = true
        
        const fetchBalance = async () => {
            if (!isConnected || !address || !chainId || !publicClient) return
            
            try {
                const balanceResult = await publicClient.getBalance({
                    address: address as `0x${string}`
                })
                
                // Convert from wei to ETH and format
                if (isMounted) {
                    const formatted = Number(balanceResult) / 1e18
                    setBalance(formatCoin(
                        formatted.toString(),
                        currencySymbol,
                        6
                    ))
                }
            } catch (error) {
                console.error("Error fetching balance:", error)
            }
        }

        fetchBalance()
        
        return () => { isMounted = false }
    }, [address, isConnected, chainId, publicClient, currencySymbol])

    // Get RPC URL based on chainId
    useEffect(() => {
        if (!isConnected || !chainId) {
            setRpc({
                url: "Not connected",
                status: "pending"
            })
            return
        }

        // Get the RPC URL from public client
        let rpcUrl = "Default Provider"
        
        if (publicClient?.transport?.url) {
            rpcUrl = publicClient.transport.url
        }

        // Check if RPC is available
        setRpc({
            url: rpcUrl,
            status: "pending"
        })

        // Check if RPC is available
        const startTime = Date.now()
        publicClient.getBlockNumber()
            .then(() => {
                const latency = Date.now() - startTime
                setRpc({
                    url: rpcUrl,
                    status: "connected",
                    latency
                })
            })
            .catch(() => {
                setRpc({
                    url: rpcUrl,
                    status: "error",
                    latency: Date.now() - startTime
                })
            })
    }, [chainId, isConnected, publicClient])
    
    // Generate explorer URL if connected
    const explorerUrl = isConnected && address && network.name
        ? getExplorerUrl(network.name, address)
        : '';

    return {
        address,
        isConnected,
        balance,
        network: {
            name: network.name || "Unknown",
            chainId: network.id,
            currencySymbol
        },
        rpc,
        explorerUrl
    }
}