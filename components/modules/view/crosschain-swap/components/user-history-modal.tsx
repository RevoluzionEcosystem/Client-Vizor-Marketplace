"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTransactionHistory, Transaction, clearTransactionHistory } from "../utils/transaction-history";
import { getImportedTokens, ImportedToken, getFavoriteTokens, FavoriteToken } from "../utils/token-history-utils";
import { ArrowUpDown, Clock, Trash, ExternalLink, Star, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface UserHistoryProps {
    isOpen: boolean;
    onClose: () => void;
    walletAddress: string;
}

export default function UserHistoryModal({ isOpen, onClose, walletAddress }: UserHistoryProps) {
    const [activeTab, setActiveTab] = useState("transactions");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [importedTokens, setImportedTokens] = useState<ImportedToken[]>([]);
    const [favoriteTokens, setFavoriteTokens] = useState<FavoriteToken[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [network, setNetwork] = useState<string | undefined>(undefined);

    // Function to load transaction history
    const loadTransactions = useCallback(async () => {
        if (!walletAddress) return;

        setLoading(true);
        try {
            const history = await getTransactionHistory(walletAddress, 50, network);
            setTransactions(history);
        } catch (error) {
            console.error("Error loading transaction history:", error);
        } finally {
            setLoading(false);
        }
    }, [walletAddress, network]);

    // Function to load imported tokens
    const loadImportedTokens = useCallback(async () => {
        if (!walletAddress) return;

        setLoading(true);
        try {
            const tokens = await getImportedTokens(walletAddress, network);
            setImportedTokens(tokens);
        } catch (error) {
            console.error("Error loading imported tokens:", error);
        } finally {
            setLoading(false);
        }
    }, [walletAddress, network]);

    // Function to load favorite tokens
    const loadFavoriteTokens = useCallback(async () => {
        if (!walletAddress) return;

        setLoading(true);
        try {
            const tokens = await getFavoriteTokens(walletAddress, network);
            setFavoriteTokens(tokens);
        } catch (error) {
            console.error("Error loading favorite tokens:", error);
        } finally {
            setLoading(false);
        }
    }, [walletAddress, network]);

    // Clear transaction history
    const handleClearHistory = async () => {
        if (!walletAddress) return;

        if (window.confirm("Are you sure you want to clear your transaction history?")) {
            try {
                await clearTransactionHistory(walletAddress);
                setTransactions([]);
            } catch (error) {
                console.error("Error clearing history:", error);
            }
        }
    };

    // Load data based on active tab
    useEffect(() => {
        if (!isOpen || !walletAddress) return;

        if (activeTab === "transactions") {
            loadTransactions();
        } else if (activeTab === "imported") {
            loadImportedTokens();
        } else if (activeTab === "favorites") {
            loadFavoriteTokens();
        }
    }, [activeTab, isOpen, walletAddress, loadTransactions, loadImportedTokens, loadFavoriteTokens]);

    // Format date from timestamp
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    // Get network icon
    const getNetworkIcon = (networkId: string) => {
        const networkIcons: Record<string, string> = {
            ethereum: "/assets/images/networks/ethereum.svg",
            eth: "/assets/images/networks/ethereum.svg",
            polygon: "/assets/images/networks/polygon.svg",
            matic: "/assets/images/networks/polygon.svg",
            bsc: "/assets/images/networks/binance.svg",
            avalanche: "/assets/images/networks/avalanche.svg",
            avax: "/assets/images/networks/avalanche.svg",
            fantom: "/assets/images/networks/fantom.svg",
            ftm: "/assets/images/networks/fantom.svg",
            arbitrum: "/assets/images/networks/arbitrum.svg",
            optimism: "/assets/images/networks/optimism.svg",
            base: "/assets/images/networks/base.svg",
        };

        return networkIcons[networkId.toLowerCase()] || "/assets/images/networks/ethereum.svg";
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "success": return "text-green-500";
            case "pending": return "text-yellow-500";
            case "failed": return "text-red-500";
            default: return "text-muted-foreground";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl">User History</DialogTitle>
                    <DialogDescription>
                        Your transaction history, imported tokens, and favorite tokens
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-between my-4">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList>
                            <TabsTrigger value="transactions">Transactions</TabsTrigger>
                            <TabsTrigger value="imported">Imported Tokens</TabsTrigger>
                            <TabsTrigger value="favorites">Favorite Tokens</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center ml-4">
                        <Select value={network} onValueChange={setNetwork}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Network" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Networks</SelectItem>
                                <SelectItem value="ethereum">Ethereum</SelectItem>
                                <SelectItem value="bsc">BNB Chain</SelectItem>
                                <SelectItem value="polygon">Polygon</SelectItem>
                                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                                <SelectItem value="avalanche">Avalanche</SelectItem>
                                <SelectItem value="optimism">Optimism</SelectItem>
                                <SelectItem value="base">Base</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="ghost" size="icon" onClick={() => {
                            if (activeTab === "transactions") loadTransactions();
                            if (activeTab === "imported") loadImportedTokens();
                            if (activeTab === "favorites") loadFavoriteTokens();
                        }}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>

                        {activeTab === "transactions" && (
                            <Button variant="ghost" size="icon" onClick={handleClearHistory}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-y-auto flex-grow">
                    {activeTab === "transactions" && (
                        <div className="space-y-2">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="p-4 rounded-md bg-secondary/30">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-5 w-24" />
                                        </div>
                                        <div className="flex mt-2">
                                            <Skeleton className="h-8 w-8 rounded-full mr-2" />
                                            <Skeleton className="h-8 w-40" />
                                            <Skeleton className="h-8 w-8 mx-2" />
                                            <Skeleton className="h-8 w-40" />
                                        </div>
                                    </div>
                                ))
                            ) : transactions.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground">
                                    No transaction history found
                                </div>
                            ) : (
                                transactions.map((tx) => (
                                    <div key={tx.hash} className="p-4 rounded-md bg-secondary/30 hover:bg-secondary/50">
                                        <div className="flex justify-between">
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDate(tx.timestamp)}
                                                </span>
                                            </div>
                                            <span className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                                                {tx.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="flex items-center mt-2">
                                            <div className="flex items-center">
                                                <Image
                                                    src={getNetworkIcon(tx.fromNetwork)}
                                                    width={20}
                                                    height={20}
                                                    alt={tx.fromNetwork}
                                                    className="rounded-full"
                                                />
                                                <span className="ml-1 font-medium">{tx.fromToken.symbol}</span>
                                            </div>

                                            <ArrowUpDown className="h-4 w-4 mx-2" />

                                            <div className="flex items-center">
                                                <Image
                                                    src={getNetworkIcon(tx.toNetwork)}
                                                    width={20}
                                                    height={20}
                                                    alt={tx.toNetwork}
                                                    className="rounded-full"
                                                />
                                                <span className="ml-1 font-medium">{tx.toToken.symbol}</span>
                                            </div>

                                            {tx.amount && (
                                                <span className="ml-auto text-sm text-muted-foreground">
                                                    {tx.amount} {tx.fromToken.symbol}
                                                </span>
                                            )}
                                        </div>

                                        {tx.explorerUrl && (
                                            <div className="flex justify-end mt-2">
                                                <a
                                                    href={tx.explorerUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                                                >
                                                    View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "imported" && (
                        <div className="space-y-2">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="p-4 rounded-md bg-secondary/30">
                                        <div className="flex">
                                            <Skeleton className="h-8 w-8 rounded-full mr-2" />
                                            <div>
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-4 w-40 mt-1" />
                                            </div>
                                            <Skeleton className="h-8 w-24 ml-auto" />
                                        </div>
                                    </div>
                                ))
                            ) : importedTokens.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground">
                                    No imported tokens found
                                </div>
                            ) : (
                                importedTokens.map((token) => (
                                    <div key={`${token.network}-${token.address}`} className="p-4 rounded-md bg-secondary/30 hover:bg-secondary/50">
                                        <div className="flex items-center">
                                            {token.logoURI ? (
                                                <Image
                                                    src={token.logoURI}
                                                    width={32}
                                                    height={32}
                                                    alt={token.symbol}
                                                    className="rounded-full mr-3"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-secondary mr-3 flex items-center justify-center">
                                                    {token.symbol.substring(0, 2)}
                                                </div>
                                            )}

                                            <div>
                                                <div className="font-medium">{token.symbol}</div>
                                                <div className="text-sm text-muted-foreground">{token.name}</div>
                                            </div>

                                            <div className="flex items-center ml-auto">
                                                <Image
                                                    src={getNetworkIcon(token.network)}
                                                    width={16}
                                                    height={16}
                                                    alt={token.network}
                                                    className="rounded-full mr-1"
                                                />
                                                <span className="text-sm">{token.network}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === "favorites" && (
                        <div className="space-y-2">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="p-4 rounded-md bg-secondary/30">
                                        <div className="flex">
                                            <Skeleton className="h-8 w-8 rounded-full mr-2" />
                                            <div>
                                                <Skeleton className="h-5 w-32" />
                                                <Skeleton className="h-4 w-40 mt-1" />
                                            </div>
                                            <Star className="h-4 w-4 ml-auto text-yellow-400" />
                                        </div>
                                    </div>
                                ))
                            ) : favoriteTokens.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground">
                                    No favorite tokens found
                                </div>
                            ) : (
                                favoriteTokens.map((token) => (
                                    <div key={`${token.network}-${token.address}`} className="p-4 rounded-md bg-secondary/30 hover:bg-secondary/50">
                                        <div className="flex items-center">
                                            {token.logoURI ? (
                                                <Image
                                                    src={token.logoURI}
                                                    width={32}
                                                    height={32}
                                                    alt={token.symbol}
                                                    className="rounded-full mr-3"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-secondary mr-3 flex items-center justify-center">
                                                    {token.symbol.substring(0, 2)}
                                                </div>
                                            )}

                                            <div>
                                                <div className="font-medium">{token.symbol}</div>
                                                <div className="text-sm text-muted-foreground">{token.name}</div>
                                                {token.notes && (
                                                    <div className="text-xs text-muted-foreground mt-1">{token.notes}</div>
                                                )}
                                            </div>

                                            <div className="flex items-center ml-auto">
                                                <Image
                                                    src={getNetworkIcon(token.network)}
                                                    width={16}
                                                    height={16}
                                                    alt={token.network}
                                                    className="rounded-full mr-1"
                                                />
                                                <span className="text-sm">{token.network}</span>
                                                <Star className="h-4 w-4 ml-2 text-yellow-400" />
                                            </div>
                                        </div>

                                        {token.tags && token.tags.length > 0 && (
                                            <div className="flex flex-wrap mt-2">
                                                {token.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-xs bg-secondary rounded-full px-2 py-0.5 mr-1 mb-1"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
