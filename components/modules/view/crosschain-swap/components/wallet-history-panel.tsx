"use client";

import React, { useState, useEffect } from "react";
import {
    Clock,
    ExternalLink,
    Trash2,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowRight,
    DownloadCloud,
    Calendar,
    AlertCircle,
    ArrowDownUp,
    Search,
    Wallet
} from "lucide-react";
import { useAccount } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconImage, getNetworkIconPath } from "@/lib/icon-utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Transaction,
    getTransactionHistory,
    clearTransactionHistory
} from "../utils/transaction-history";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getNetworkName } from "@/lib/network-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTokenImage } from "../hooks/use-token-image";

interface WalletHistoryPanelProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function WalletHistoryPanel({ isOpen, onOpenChange = (open: boolean) => { } }: WalletHistoryPanelProps) {
    const { address, isConnected } = useAccount();
    const isMobile = useIsMobile();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [timeFilter, setTimeFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");    // Load transaction history from cloud and local storage
    useEffect(() => {
        if (isOpen && isConnected && address) {
            setIsLoading(true);

            // Use async function inside useEffect
            const loadHistory = async () => {
                try {
                    const history = await getTransactionHistory(address);
                    setTransactions(history);
                    setFilteredTransactions(history);
                } catch (error) {
                    console.error("Error loading transaction history:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            // Call the async function
            loadHistory();
        }
    }, [isOpen, isConnected, address]);

    // Apply filters when search term, time filter or tab changes
    useEffect(() => {
        if (transactions.length === 0) return;

        let filtered = [...transactions];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(tx =>
                tx.fromToken.symbol.toLowerCase().includes(term) ||
                tx.toToken.symbol.toLowerCase().includes(term) ||
                tx.hash.toLowerCase().includes(term) ||
                tx.provider?.toLowerCase().includes(term) ||
                getNetworkName(tx.fromNetwork).toLowerCase().includes(term) ||
                getNetworkName(tx.toNetwork).toLowerCase().includes(term)
            );
        }

        // Apply time filter
        const now = Date.now();
        if (timeFilter === "day") {
            filtered = filtered.filter(tx => now - tx.timestamp < 86400000); // 24 hours
        } else if (timeFilter === "week") {
            filtered = filtered.filter(tx => now - tx.timestamp < 604800000); // 7 days
        } else if (timeFilter === "month") {
            filtered = filtered.filter(tx => now - tx.timestamp < 2592000000); // 30 days
        } else if (timeFilter === "year") {
            filtered = filtered.filter(tx => now - tx.timestamp < 31536000000); // 1 year
        }

        // Apply tab filter
        if (activeTab === "onchain") {
            filtered = filtered.filter(tx => tx.type === "on-chain");
        } else if (activeTab === "crosschain") {
            filtered = filtered.filter(tx => tx.type === "cross-chain");
        }

        // Apply sorting
        if (sortOrder === "newest") {
            filtered.sort((a, b) => b.timestamp - a.timestamp);
        } else if (sortOrder === "oldest") {
            filtered.sort((a, b) => a.timestamp - b.timestamp);
        }

        setFilteredTransactions(filtered);
    }, [searchTerm, timeFilter, activeTab, sortOrder, transactions]);

    // Format timestamp to relative time
    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        let interval = seconds / 31536000; // seconds in a year
        if (interval > 1) return Math.floor(interval) + " years ago";

        interval = seconds / 2592000; // seconds in a month
        if (interval > 1) return Math.floor(interval) + " months ago";

        interval = seconds / 86400; // seconds in a day
        if (interval > 1) return Math.floor(interval) + " days ago";

        interval = seconds / 3600; // seconds in an hour
        if (interval > 1) return Math.floor(interval) + " hours ago";

        interval = seconds / 60; // seconds in a minute
        if (interval > 1) return Math.floor(interval) + " minutes ago";

        return Math.floor(seconds) + " seconds ago";
    };

    // Format date and time
    const formatDateTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true
        });
    };

    // Safe utility to format token and network display data
    const formatTokenDisplay = (tx: Transaction) => {
        return {
            fromTokenSymbol: tx.fromToken?.symbol || "Unknown",
            toTokenSymbol: tx.toToken?.symbol || "Unknown",
            fromNetworkName: getNetworkName(tx.fromNetwork || "unknown"),
            toNetworkName: getNetworkName(tx.toNetwork || "unknown"),
            amount: tx.amount || "0"
        };
    };

    // Format hash for display
    const formatHash = (hash: string) => {
        if (!hash) return "";
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
    };

    // Handle clearing transaction history
    const handleClearHistory = () => {
        if (address && confirm("Are you sure you want to clear your transaction history?")) {
            clearTransactionHistory(address);
            setTransactions([]);
            setFilteredTransactions([]);
        }
    };

    // Export transaction history as JSON
    const handleExportHistory = () => {
        if (transactions.length === 0) return;

        const dataStr = JSON.stringify(transactions, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

        const exportFileDefaultName = `revoluzion-swap-history-${new Date().toISOString().slice(0, 10)}.json`;

        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
    };

    // Function to determine status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
            case 'pending':
                return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-400" />;
            default:
                return <AlertCircle className="h-4 w-4 text-amber-400" />;
        }
    };

    return (
        <TooltipProvider>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className={`${isMobile ? 'max-w-[95vw] p-3' : 'max-w-4xl p-5'} max-h-[90vh] overflow-y-auto bg-gradient-to-br from-black to-slate-950/30 border-slate-800 text-slate-300`}>
                    <DialogHeader className="pb-2">
                        <DialogTitle className="text-2xl flex items-center text-slate-100">
                            <Clock className="h-6 w-6 mr-2 text-blue-400" />
                            Transaction History
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            View your past swaps and bridge transactions on Revoluzion Swap
                        </DialogDescription>
                    </DialogHeader>

                    <div className="w-full">
                        {/* Transaction Filters */}
                        {transactions.length > 0 && !isLoading && (
                            <div className="pb-4">
                                <div className="flex flex-wrap gap-3 mb-3">
                                    <div className="relative flex-1 min-w-[240px]">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                        <Input
                                            placeholder="Search by token, network, or hash"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 bg-slate-900 border-slate-700 text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Select value={timeFilter} onValueChange={setTimeFilter}>
                                            <SelectTrigger className="w-[130px] h-10 bg-slate-900 border-slate-700 text-sm">
                                                <SelectValue placeholder="Time period" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700">
                                                <SelectItem value="all">All time</SelectItem>
                                                <SelectItem value="day">Past 24 hours</SelectItem>
                                                <SelectItem value="week">Past week</SelectItem>
                                                <SelectItem value="month">Past month</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={sortOrder} onValueChange={setSortOrder}>
                                            <SelectTrigger className="w-[130px] h-10 bg-slate-900 border-slate-700 text-sm">
                                                <SelectValue placeholder="Sort order" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700">
                                                <SelectItem value="newest">Newest first</SelectItem>
                                                <SelectItem value="oldest">Oldest first</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <div className="flex ml-auto">
                                            {transactions.length > 0 && (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-10 w-10 rounded-full hover:bg-blue-900/20 text-blue-500"
                                                                onClick={handleExportHistory}
                                                            >
                                                                <DownloadCloud className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs">Export transaction history</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-10 w-10 rounded-full hover:bg-red-900/20 text-red-500"
                                                                onClick={handleClearHistory}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs">Clear all history</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction counts summary */}
                                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                                    <div>
                                        {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                                        {searchTerm && ` matched "${searchTerm}"`}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center">
                                            <Badge variant="outline" className="bg-blue-900/20 border-blue-500/20 text-blue-400 mr-1.5">
                                                {transactions.filter(tx => tx.type === "on-chain").length}
                                            </Badge>
                                            <span>On-chain</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Badge variant="outline" className="bg-emerald-900/20 border-emerald-500/20 text-emerald-400 mr-1.5">
                                                {transactions.filter(tx => tx.type === "cross-chain").length}
                                            </Badge>
                                            <span>Cross-chain</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            {transactions.length > 0 && !isLoading && (<TabsList className={`grid w-full grid-cols-3 ${isMobile ? 'mb-4' : 'mb-6'} bg-slate-900/50`}>
                                <TabsTrigger value="all" className={`${isMobile ? 'text-xs py-1.5' : ''}`}>
                                    {isMobile ? 'All' : 'All Transactions'}
                                </TabsTrigger>
                                <TabsTrigger value="onchain" className={`${isMobile ? 'text-xs py-1.5' : ''}`}>On-Chain</TabsTrigger>
                                <TabsTrigger value="crosschain" className={`${isMobile ? 'text-xs py-1.5' : ''}`}>
                                    {isMobile ? 'Cross' : 'Cross-Chain'}
                                </TabsTrigger>
                            </TabsList>
                            )}

                            <TabsContent value="all">
                                {renderTransactionContent()}
                            </TabsContent>

                            <TabsContent value="onchain">
                                {renderTransactionContent("on-chain")}
                            </TabsContent>

                            <TabsContent value="crosschain">
                                {renderTransactionContent("cross-chain")}
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );

    function renderTransactionContent(typeFilter?: string) {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 text-blue-400 animate-spin mb-4" />
                    <p className="text-base text-slate-300">Loading transaction history...</p>
                    <p className="text-sm text-slate-400 mt-2">Please wait while we fetch your past transactions</p>
                </div>
            );
        }

        if (!isConnected) {
            return (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Wallet className="h-12 w-12 text-slate-700 mb-4" />
                    <p className="text-base text-slate-300 text-center">Connect your wallet to view transaction history</p>
                    <p className="text-sm text-slate-400 mt-2 text-center">Your transaction history will be displayed here once you connect your wallet</p>
                </div>
            );
        }

        if (transactions.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-14 w-14 text-slate-700 mb-4" />
                    <p className="text-base text-slate-300">No transaction history found</p>
                    <p className="text-sm text-slate-400 mt-2 text-center">
                        When you make swaps using Revoluzion Swap, they will appear here
                    </p>
                </div>
            );
        }

        let displayTxs = typeFilter
            ? filteredTransactions.filter(tx => tx.type === typeFilter)
            : filteredTransactions;

        if (!showAll) {
            displayTxs = displayTxs.slice(0, 10);
        }

        if (displayTxs.length === 0) {
            return (
                <Alert variant="default" className="bg-slate-900/50 border-slate-700 mb-4">
                    <AlertCircle className="h-4 w-4 text-slate-400" />
                    <AlertDescription>
                        No transactions found matching your current filters.
                    </AlertDescription>
                </Alert>
            );
        }

        return (
            <div className="space-y-3 pb-3">
                {displayTxs.map((tx) => (
                    <Card key={tx.hash} className="bg-slate-900/40 border-slate-700/50 shadow overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <Badge
                                        variant="outline"
                                        className={`
                                            mr-2 py-0.5 px-2 text-xs flex items-center 
                                            ${tx.type === 'cross-chain'
                                                ? 'bg-emerald-900/20 border-emerald-500/20 text-emerald-400'
                                                : 'bg-blue-900/20 border-blue-500/20 text-blue-400'
                                            }
                                        `}
                                    >
                                        {tx.type === 'cross-chain'
                                            ? (<><ArrowRight className="h-3 w-3 mr-1" /> Cross-chain</>)
                                            : (<><ArrowDownUp className="h-3 w-3 mr-1" /> On-chain</>)
                                        }
                                    </Badge>
                                    <div className={`
                                        flex items-center py-0.5 px-2 rounded-sm text-xs
                                        ${tx.status === 'success'
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : tx.status === 'pending'
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : 'bg-red-500/10 text-red-400'
                                        }
                                    `}>
                                        {getStatusIcon(tx.status)}
                                        <span className="ml-1">{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</span>
                                    </div>
                                    {tx.provider && (
                                        <Badge
                                            variant="outline"
                                            className="ml-2 py-0.5 px-2 text-xs bg-slate-900 border-slate-700 text-slate-300"
                                        >
                                            {tx.provider}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 rounded-full p-0"
                                                title="View on explorer"
                                                onClick={() => tx.explorerUrl && window.open(tx.explorerUrl, "_blank")}
                                                disabled={!tx.explorerUrl}
                                            >
                                                <ExternalLink className="h-4 w-4 text-blue-400" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">{tx.explorerUrl ? "View on blockchain explorer" : "No explorer URL available"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>

                            {/* Transaction details */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex items-center mb-2 md:mb-0">
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                                                <TokenImage token={tx.fromToken} network={tx.fromNetwork} />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center">
                                                <NetworkImage network={tx.fromNetwork} />
                                            </div>
                                        </div>
                                        <div className="mx-2 text-slate-400">
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                        <div className="relative">
                                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                                                <TokenImage token={tx.toToken} network={tx.toNetwork} />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center">
                                                <NetworkImage network={tx.toNetwork} />
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-slate-200">
                                                {tx.amount} {tx.fromToken.symbol} {tx.type === 'cross-chain' ? '→' : '↔'} {tx.toToken.symbol}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">
                                                {getNetworkName(tx.fromNetwork)} {tx.type === 'cross-chain' ? '→' : '↔'} {getNetworkName(tx.toNetwork)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col text-right">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="text-xs text-slate-400 flex items-center justify-end">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {formatTimeAgo(tx.timestamp)}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">{formatDateTime(tx.timestamp)}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {formatHash(tx.hash)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredTransactions.length > 10 && (
                    <div className="text-center pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-blue-400 hover:text-blue-300 border-slate-700 hover:border-blue-800/50"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? "Show less" : `View all transactions (${filteredTransactions.length})`}
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

// Add utility functions for getting token and network images with useTokenImage
const TokenImage = ({ token, network }: { token: any, network: string }) => {
    const { logoUrl } = useTokenImage({
        address: token.address || "",
        symbol: token.symbol || "",
        network: network
    });

    // Create a unique key for this token to ensure proper refresh
    const tokenKey = React.useMemo(() =>
        `token-${token.symbol}-${network}-${token.address?.substring(0, 8) || "native"}`,
        [token.symbol, network, token.address]
    );

    return (
        <IconImage
            src={logoUrl || `/assets/tokens/${token.symbol?.toLowerCase()}.svg`}
            alt={token.symbol || "Unknown token"}
            className="h-8 w-8"
            fallbackSrc="/assets/tokens/default.svg"
            key={tokenKey}
        />
    );
};

const NetworkImage = ({ network }: { network: string }) => {
    // Use the proper network icon utility that's already imported
    const networkIconPath = getNetworkIconPath(network);

    return (
        <IconImage
            src={networkIconPath}
            alt={network || "Unknown network"}
            className="h-4 w-4"
            fallbackSrc="/assets/networks/default.svg"
            key={`network-${network}`} // Add a key based on network to ensure component refreshes when network changes
        />
    );
};
