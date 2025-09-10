"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowDownUp,
    ArrowRight,
    WalletCards,
    Layers,
    Check,
    AlertCircle,
    NetworkIcon,
    Coins,
    Settings,
    HelpCircle,
    Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface GuideDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function GuideDialog({ open, onOpenChange }: GuideDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">                <DialogHeader>
                    <DialogTitle className="text-2xl mb-2">Vizor Swap Guide</DialogTitle>
                    <DialogDescription>
                        Learn how to use Vizor's swap features for both on-chain and cross-chain transactions
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="onchain">On-Chain Swap</TabsTrigger>
                        <TabsTrigger value="crosschain">Cross-Chain Swap</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab Content */}
                    <TabsContent value="overview">
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-medium mb-2 flex items-center">
                                        <ArrowDownUp className="h-5 w-5 mr-2 text-blue-400" />                                        
                                        What is Vizor Swap?
                                    </h3>
                                    <p className="text-slate-300 mb-4">
                                        Vizor Swap is a powerful decentralized exchange (DEX) aggregator that finds the best routes and rates for your token swaps, saving you money and time.
                                    </p>

                                    <h4 className="font-medium text-blue-400 mt-4">Key Features:</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-slate-300 mt-2">
                                        <li>
                                            <span className="font-medium">On-chain swaps</span>: Trade tokens within the same blockchain network
                                        </li>
                                        <li>
                                            <span className="font-medium">Cross-chain swaps</span>: Trade tokens between different blockchain networks
                                        </li>
                                        <li>
                                            <span className="font-medium">Best rates</span>: Our aggregator searches multiple DEXs and bridges to find you the best price
                                        </li>
                                        <li>
                                            <span className="font-medium">Low fees</span>: Save on gas and transaction costs with optimized routing
                                        </li>
                                        <li>
                                            <span className="font-medium">Security</span>: All transactions are non-custodial and secure
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-medium mb-3 flex items-center">
                                        <WalletCards className="h-5 w-5 mr-2 text-blue-400" />
                                        Getting Started
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex">
                                            <div className="mr-4 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Connect your wallet</h4>
                                                <p className="text-slate-400 text-sm">Click "Connect Wallet" to connect your Web3 wallet (MetaMask, WalletConnect, etc.)</p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="mr-4 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Choose networks & tokens</h4>
                                                <p className="text-slate-400 text-sm">Select your source and destination networks and tokens</p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="mr-4 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Enter amount & review</h4>
                                                <p className="text-slate-400 text-sm">Enter the amount you want to swap and review transaction details</p>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="mr-4 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Confirm & swap</h4>
                                                <p className="text-slate-400 text-sm">Approve token access if needed, then confirm the swap in your wallet</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-lg font-medium mb-3 flex items-center">
                                        <HelpCircle className="h-5 w-5 mr-2 text-blue-400" />
                                        Which Type of Swap Should I Use?
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <h4 className="font-medium text-blue-400 flex items-center">
                                                <Badge variant="outline" className="mr-2 bg-slate-800/20 border-blue-500/20 text-blue-400">
                                                    On-chain
                                                </Badge>
                                                Same Network Swap
                                            </h4>
                                            <p className="text-slate-400 text-sm mt-2">
                                                Use when trading tokens on the same blockchain network (e.g., ETH to USDT on Ethereum)
                                            </p>
                                            <div className="flex items-center justify-center mt-3">
                                                <Badge className="bg-slate-800/20 border-blue-500/20 text-blue-400">Ethereum</Badge>
                                                <ArrowRight className="h-4 w-4 mx-2 text-slate-400" />
                                                <Badge className="bg-slate-800/20 border-blue-500/20 text-blue-400">Ethereum</Badge>
                                            </div>
                                        </div>

                                        <div className="bg-slate-800/50 p-4 rounded-lg">
                                            <h4 className="font-medium text-emerald-400 flex items-center">
                                                <Badge variant="outline" className="mr-2 bg-emerald-900/20 border-emerald-500/20 text-emerald-400">
                                                    Cross-chain
                                                </Badge>
                                                Different Network Swap
                                            </h4>
                                            <p className="text-slate-400 text-sm mt-2">
                                                Use when trading tokens between different blockchain networks (e.g., ETH on Ethereum to MATIC on Polygon)
                                            </p>
                                            <div className="flex items-center justify-center mt-3">
                                                <Badge className="bg-slate-800/20 border-blue-500/20 text-blue-400">Ethereum</Badge>
                                                <ArrowRight className="h-4 w-4 mx-2 text-slate-400" />
                                                <Badge className="bg-purple-900/20 border-purple-500/20 text-purple-400">Polygon</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* On-Chain Swap Tab Content */}
                    <TabsContent value="onchain">
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium flex items-center">
                                            <Layers className="h-5 w-5 mr-2 text-blue-400" />
                                            On-Chain Swap Guide
                                        </h3>
                                        <Badge variant="outline" className="bg-slate-800/20 border-blue-500/20 text-blue-400">
                                            Same Network
                                        </Badge>
                                    </div>

                                    <p className="text-slate-300 mb-4">
                                        On-chain swaps allow you to trade tokens that exist on the same blockchain network.
                                        These are typically faster and have lower fees than cross-chain swaps.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-md font-medium mb-4">Step-by-Step Guide for On-Chain Swaps</h3>

                                    <div className="space-y-6">
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Connect your wallet</h4>
                                                <p className="text-slate-400 text-sm mb-2">Click the "Connect Wallet" button to connect your Web3 wallet</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-blue-400 mb-1">💡 Tip:</p>
                                                    <p>Make sure your wallet is on the correct network for the tokens you want to swap</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Select your networks</h4>
                                                <p className="text-slate-400 text-sm mb-2">For on-chain swaps, select the same network for both "From" and "To" fields</p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <Badge className="bg-slate-800/20 border-blue-500/20">Ethereum</Badge>
                                                    <Badge className="bg-purple-900/20 border-purple-500/20">Polygon</Badge>
                                                    <Badge className="bg-yellow-900/20 border-yellow-500/20">BSC</Badge>
                                                    <Badge className="bg-slate-800/20 border-blue-500/20">Arbitrum</Badge>
                                                    <Badge className="bg-red-900/20 border-red-500/20">Avalanche</Badge>
                                                </div>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-blue-400 mb-1">💡 Tip:</p>
                                                    <p>The wallet network will automatically switch if needed when you initiate the swap</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Select tokens & enter amount</h4>
                                                <p className="text-slate-400 text-sm mb-2">Choose the tokens you want to swap and enter the amount</p>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge className="bg-slate-800/20 border-blue-500/20 px-3 py-1">ETH</Badge>
                                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                                    <Badge className="bg-green-900/20 border-green-500/20 px-3 py-1">USDT</Badge>
                                                </div>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-blue-400 mb-1">💡 Tip:</p>
                                                    <p>You can use the token search function to quickly find your desired tokens</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Adjust slippage (optional)</h4>
                                                <p className="text-slate-400 text-sm mb-2">Set your slippage tolerance based on market volatility</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-blue-400 mb-1">💡 What is slippage?</p>
                                                    <p>Slippage is the difference between the expected price and the executed price due to market movement. Higher slippage tolerance means your transaction is more likely to go through, but potentially at a worse price.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                5
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Review swap details</h4>
                                                <p className="text-slate-400 text-sm mb-2">Check the exchange rate, fees, gas costs, and minimum received amount</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-blue-400 mb-1">⚠️ Important:</p>
                                                    <p>Always verify the token addresses with trusted sources for security</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                6
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Approve tokens (if needed)</h4>
                                                <p className="text-slate-400 text-sm mb-2">For ERC20 tokens, you'll need to approve the contract to spend your tokens</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-blue-400 mb-1">💡 Note:</p>
                                                    <p>This is a one-time approval per token and is required for security reasons</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-800/30 text-blue-400">
                                                7
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Confirm and swap</h4>
                                                <p className="text-slate-400 text-sm mb-2">Click the "Swap" button and confirm the transaction in your wallet</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-green-400 mb-1">✓ Success:</p>
                                                    <p>Once confirmed, you'll be able to see the transaction in your history</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Cross-Chain Swap Tab Content */}
                    <TabsContent value="crosschain">
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium flex items-center">
                                            <Layers className="h-5 w-5 mr-2 text-emerald-400" />
                                            Cross-Chain Swap Guide
                                        </h3>
                                        <Badge variant="outline" className="bg-emerald-900/20 border-emerald-500/20 text-emerald-400">
                                            Different Networks
                                        </Badge>
                                    </div>

                                    <p className="text-slate-300 mb-4">
                                        Cross-chain swaps allow you to trade tokens between different blockchain networks without using a centralized exchange.
                                        These swaps typically take longer and cost more than on-chain swaps due to the complexity of bridging assets between blockchains.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-md font-medium mb-4">Step-by-Step Guide for Cross-Chain Swaps</h3>

                                    <div className="space-y-6">
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-900/30 text-emerald-400">
                                                1
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Connect your wallet</h4>
                                                <p className="text-slate-400 text-sm mb-2">Click the "Connect Wallet" button to connect your Web3 wallet</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-emerald-400 mb-1">💡 Tip:</p>
                                                    <p>Make sure your wallet has funds on the source network for the swap and gas fees</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-900/30 text-emerald-400">
                                                2
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Select different networks</h4>
                                                <p className="text-slate-400 text-sm mb-2">For cross-chain swaps, select different networks for "From" and "To" fields</p>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Badge className="bg-slate-800/20 border-blue-500/20">Ethereum</Badge>
                                                    <ArrowRight className="h-4 w-4 text-slate-400" />
                                                    <Badge className="bg-purple-900/20 border-purple-500/20">Polygon</Badge>
                                                </div>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-emerald-400 mb-1">💡 Example Combinations:</p>
                                                    <ul className="list-disc pl-4 space-y-1">
                                                        <li>Ethereum → BSC</li>
                                                        <li>Polygon → Arbitrum</li>
                                                        <li>BSC → Avalanche</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-900/30 text-emerald-400">
                                                3
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Select tokens & enter amount</h4>
                                                <p className="text-slate-400 text-sm mb-2">Choose source and destination tokens and enter the amount to swap</p>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="flex flex-col items-center">
                                                        <Badge className="bg-slate-800/20 border-blue-500/20 mb-1">Ethereum</Badge>
                                                        <Badge className="bg-slate-800/20 border-blue-500/20 px-3 py-1">ETH</Badge>
                                                    </div>
                                                    <ArrowRight className="h-4 w-4 text-slate-400 mx-2" />
                                                    <div className="flex flex-col items-center">
                                                        <Badge className="bg-purple-900/20 border-purple-500/20 mb-1">Polygon</Badge>
                                                        <Badge className="bg-purple-900/20 border-purple-500/20 px-3 py-1">MATIC</Badge>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-emerald-400 mb-1">💡 Tip:</p>
                                                    <p>Native tokens (ETH, MATIC, BNB, etc.) and major stablecoins usually have the best cross-chain liquidity</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-900/30 text-emerald-400">
                                                4
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Set higher slippage for cross-chain</h4>
                                                <p className="text-slate-400 text-sm mb-2">Cross-chain swaps typically need higher slippage than on-chain swaps</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-emerald-400 mb-1">💡 Recommendation:</p>
                                                    <p>Consider setting slippage to 1-3% for cross-chain swaps to account for price differences between chains</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-900/30 text-emerald-400">
                                                5
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Review cross-chain details carefully</h4>
                                                <p className="text-slate-400 text-sm mb-2">Pay close attention to bridge fees, estimated completion time, and gas costs</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-blue-400 mb-1">⚠️ Important:</p>
                                                    <p>Cross-chain swaps typically take 2-15 minutes to complete depending on the networks involved</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-900/30 text-emerald-400">
                                                6
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Approve and initiate the swap</h4>
                                                <p className="text-slate-400 text-sm mb-2">Approve the token access if needed, then confirm the swap transaction</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-emerald-400 mb-1">💡 Note:</p>
                                                    <p>The wallet will need to be on the source blockchain network to initiate the swap</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-emerald-900/30 text-emerald-400">
                                                7
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Monitor progress and completion</h4>
                                                <p className="text-slate-400 text-sm mb-2">Track the status of your cross-chain swap in the transaction history</p>
                                                <div className="bg-slate-800/50 p-3 rounded-lg text-xs text-slate-300">
                                                    <p className="font-medium text-blue-400 mb-1">💡 Tip:</p>
                                                    <p>Don't worry if the transaction takes longer to complete. Cross-chain swaps involve multiple transactions across different networks.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <h3 className="text-md font-medium mb-3 flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2 text-blue-400" />
                                        Important Notes for Cross-Chain Swaps
                                    </h3>

                                    <ul className="list-disc pl-5 space-y-2 text-slate-300">
                                        <li>
                                            <span className="text-blue-400 font-medium">Longer completion time: </span>
                                            Cross-chain swaps typically take 2-15 minutes to complete
                                        </li>
                                        <li>
                                            <span className="text-blue-400 font-medium">Higher fees: </span>
                                            Bridge fees add to the overall cost of the transaction
                                        </li>
                                        <li>
                                            <span className="text-blue-400 font-medium">Gas on source chain only: </span>
                                            You only need to pay gas on the source blockchain
                                        </li>
                                        <li>
                                            <span className="text-blue-400 font-medium">Keep funds for gas: </span>
                                            Always keep a small amount of native tokens for gas on both chains
                                        </li>
                                        <li>
                                            <span className="text-blue-400 font-medium">Provider differences: </span>
                                            Different cross-chain bridge providers may have varying speed, security, and fees
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
