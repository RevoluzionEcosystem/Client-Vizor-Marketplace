'use client'

import { useState } from 'react'
import { useWalletConnector } from '../hooks/use-wallet-connector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, CopyIcon, ExternalLink, ArrowLeftRight, LogOut, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { networks } from '../config'

type WalletDisplayProps = {
    showNetworkSelector?: boolean
    showBalance?: boolean
    autoConnect?: boolean
    preferredNetwork?: number
    className?: string
}

/**
 * An enhanced wallet information display component that shows
 * more details about the connected wallet and provides additional functionality.
 */
export function WalletDisplay({
    showNetworkSelector = true,
    showBalance = true,
    autoConnect = false,
    preferredNetwork,
    className = ""
}: WalletDisplayProps) {
    const [copied, setCopied] = useState(false)
    const {
        isConnected,
        address,
        chainId,
        isLoading,
        mounted,
        connect,
        disconnect,
        switchNetwork,
        shortenAddress
    } = useWalletConnector({
        autoConnect,
        preferredNetwork
    })

    // Copy address to clipboard
    const copyAddress = () => {
        if (!address) return

        navigator.clipboard.writeText(address)
        setCopied(true)
        toast.success("Address copied to clipboard")

        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    // Open address on block explorer
    const openExplorer = () => {
        if (!address || !chainId) return

        const network = networks.find(net => net.id === chainId)
        if (!network?.blockExplorers?.default?.url) {
            toast.error("Block explorer not available for this network")
            return
        }

        window.open(`${network.blockExplorers.default.url}/address/${address}`, '_blank')
    }

    // Don't render during SSR
    if (!mounted) return null

    // Not connected state
    if (!isConnected) {
        return (
            <Card className={`bg-slate-900 border-slate-700 ${className}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                        <Wallet className="h-5 w-5 mr-2 text-cyan-500" />
                        Connect Wallet
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                    <p className="text-sm text-slate-400">
                        Connect your wallet to access all features of Vizor
                    </p>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black"
                        onClick={connect}
                        disabled={isLoading}
                    >
                        Connect
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    // Connected state
    return (
        <Card className={`bg-slate-900 border-cyan-600/30 ${className}`}>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <Wallet className="h-5 w-5 mr-2 text-cyan-500" />
                        Wallet Connected
                    </div>

                    {chainId && (
                        <span className="text-xs px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-400">
                            {networks.find(net => net.id === chainId)?.name || `Chain ID: ${chainId}`}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 pb-4">
                {address && (
                    <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-between">
                        <div className="font-mono text-sm text-cyan-300 truncate">
                            {address}
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-cyan-400"
                                onClick={copyAddress}
                            >
                                {copied ?
                                    <CheckCircle2 className="h-4 w-4" /> :
                                    <CopyIcon className="h-4 w-4" />
                                }
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-cyan-400"
                                onClick={openExplorer}
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {showNetworkSelector && (
                    <div className="grid grid-cols-3 gap-2">
                        {networks.slice(0, 6).map((network) => (
                            <Button
                                key={network.id}
                                variant={chainId === network.id ? "default" : "outline"}
                                size="sm"
                                className={chainId === network.id ?
                                    "bg-cyan-500 hover:bg-cyan-600 text-black border-none" :
                                    "border-slate-700 hover:border-cyan-500/50 text-xs"
                                }
                                onClick={() => switchNetwork(Number(network.id))}
                            >
                                {network.name.split(' ')[0]}
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>

            <CardFooter className="border-t border-slate-800 pt-3 flex justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700"
                    onClick={() => showNetworkSelector ?
                        null :
                        switchNetwork(preferredNetwork || 1)
                    }
                >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Switch
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700"
                    onClick={disconnect}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                </Button>
            </CardFooter>
        </Card>
    )
}