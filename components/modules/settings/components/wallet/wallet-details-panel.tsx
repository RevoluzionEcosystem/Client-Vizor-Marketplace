"use client"

import { useState } from "react"
import { Copy, AlertCircle, Cpu, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getIconPath, IconImage } from "@/lib/icon-utils"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { NETWORK_MAP, getNetworkId } from "@/lib/network-utils"

interface WalletDetailsProps {
    address?: string;
    isConnected: boolean;
    balance?: string;
    network?: {
        name: string;
        chainId: number;
        icon?: string;
    };
    rpc?: {
        url: string;
        status: 'connected' | 'error' | 'pending';
        latency?: number;
    };
    explorerUrl?: string;
}

export function WalletDetailsPanel({
    address = "",
    isConnected = false,
    balance = "0.00",
    network = { name: "Not Connected", chainId: 0 },
    rpc = { url: "Not connected", status: "pending" },
    explorerUrl = ""
}: WalletDetailsProps) {
    const [copied, setCopied] = useState(false);
    const [autoConnect, setAutoConnect] = useState(false);
    const [hideAddress, setHideAddress] = useState(false);

    // Format the address to only show the start and end
    const formatAddress = (addr: string): string => {
        if (!addr || addr.length < 10) return "Not Connected";
        return hideAddress ? "•••••••••••••" : `${addr.substring(0, 6)}...${addr.substring(addr.length - 8)}`;
    };

    // Copy address to clipboard
    const copyToClipboard = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Get network status color
    const getNetworkStatusColor = () => {
        if (!isConnected) return "bg-gray-400";
        if (network?.chainId) return "bg-green-500";
        return "bg-yellow-500";
    };

    // Get RPC status color
    const getRpcStatusColor = () => {
        switch (rpc?.status) {
            case "connected": return "bg-green-500";
            case "error": return "bg-red-500";
            case "pending":
            default:
                return "bg-yellow-500";
        }
    };

    return (
        <div>
            <div className="flex flex-col space-y-3">
                {/* Wallet Connection Status */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${getNetworkStatusColor()}`}></div>
                        <span className="text-sm font-medium">
                            {isConnected ? "Connected" : "Not Connected"}
                        </span>
                    </div>
                    <Badge variant={isConnected ? "outline" : "secondary"}>
                        {isConnected ? "Active" : "Inactive"}
                    </Badge>
                </div>

                {/* Wallet Address */}
                {isConnected ? (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Address:</div>
                        <div className="flex items-center">
                            <span className="text-xs font-mono mr-2">{formatAddress(address)}</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyToClipboard}>
                                            {copied ? <AlertCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{copied ? "Copied!" : "Copy Address"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">Address:</div>
                        <span className="text-xs">Not Connected</span>
                    </div>
                )}

                {/* Wallet Balance */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Balance:</div>
                    {isConnected ? (
                        <div className="flex items-center">
                            <span className="text-xs font-mono mr-1">{balance}</span>
                        </div>
                    ) : (
                        <Skeleton className="h-5 w-16" />
                    )}
                </div>

                <Separator className="my-2" />

                {/* Network Information */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Network:</div>
                    <div className="flex items-center">
                        {isConnected ? (
                            <>
                                <div className="h-4 w-4 rounded-full mr-2 bg-slate-800 p-0.5 overflow-hidden">
                                    <IconImage
                                        src={getIconPath(network?.name.toLowerCase(), "network")}
                                        alt={network?.name || "Network"}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="text-xs font-medium">{network?.name || "Unknown"}</span>
                                {network?.chainId && (
                                    <span className="text-xs text-muted-foreground ml-1">({network.chainId})</span>
                                )}
                            </>
                        ) : (
                            <span className="text-xs">Not Connected</span>
                        )}
                    </div>
                </div>

                {/* RPC Information */}
                <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">RPC:</div>
                    <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${getRpcStatusColor()}`}></div>
                        <span className="text-xs font-mono truncate max-w-[150px]" title={rpc?.url}>
                            {isConnected ? (rpc?.url || "Unknown") : "Not Connected"}
                        </span>
                        {rpc?.latency && <span className="text-xs text-muted-foreground ml-1">({rpc.latency}ms)</span>}
                    </div>
                </div>
                {/* Switch Settings */}
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <Cpu className="h-3 w-3" />
                            <span>Auto-connect</span>
                        </div>
                        <Switch
                            checked={autoConnect}
                            onCheckedChange={setAutoConnect}
                            size="sm"
                        />
                    </div>                    
                    <div className="flex mt-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7 w-full" onClick={() => {
                                            // Use the pre-calculated explorer URL from the hook
                                            if (explorerUrl) {
                                                window.open(explorerUrl, '_blank');
                                            } else if (address && network?.name) {
                                                // Fallback to etherscan if no explorer URL was provided
                                                window.open(`https://etherscan.io/address/${address}`, '_blank');
                                            }
                                        }}
                                        disabled={!isConnected || !address}
                                    >
                                        <ExternalLink className="mr-1 h-3 w-3" />
                                        View on Explorer
                                    </Button>
                                </TooltipTrigger>                                <TooltipContent>
                                    {explorerUrl ? (
                                        `View wallet on ${new URL(explorerUrl).hostname} (${network?.name || 'blockchain explorer'})`
                                    ) : (
                                        `View wallet details on blockchain explorer`
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}