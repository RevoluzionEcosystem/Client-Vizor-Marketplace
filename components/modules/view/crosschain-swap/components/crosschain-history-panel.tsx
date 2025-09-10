"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCloudTransactionHistory } from '../utils/crosschain-history-utils';
import { useAccount } from 'wagmi';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

/**
 * A panel component that displays a user's crosschain swap transaction history
 */
export function CrosschainHistoryPanel() {
    const { address } = useAccount();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!address) return;

            setIsLoading(true);
            try {
                const history = await getCloudTransactionHistory(address);
                setTransactions(history);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch transaction history:', err);
                setError('Failed to load transaction history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();

        // Refresh every 30 seconds
        const intervalId = setInterval(fetchHistory, 30000);

        return () => clearInterval(intervalId);
    }, [address]);

    // Format the time to a user-friendly string
    const formatTime = (timestamp) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
        } catch (error) {
            return 'Unknown time';
        }
    };

    // Get the appropriate status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'failed':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    // Format token amount with correct decimal places
    const formatAmount = (amount, decimals = 18) => {
        if (!amount) return '0';

        const num = parseFloat(amount);
        if (isNaN(num)) return '0';

        if (num < 0.00001) {
            return '<0.00001';
        }

        return num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 5
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                    <span>Transaction History</span>
                    {!isLoading && <Badge variant="outline">{transactions.length} Transactions</Badge>}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        {renderTransactionList(transactions, isLoading, error)}
                    </TabsContent>

                    <TabsContent value="pending">
                        {renderTransactionList(
                            transactions.filter(tx => tx.status?.toLowerCase() === 'pending'),
                            isLoading,
                            error
                        )}
                    </TabsContent>

                    <TabsContent value="completed">
                        {renderTransactionList(
                            transactions.filter(tx => tx.status?.toLowerCase() === 'success'),
                            isLoading,
                            error
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );

    function renderTransactionList(txList, isLoading, error) {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 border rounded-md">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                            <Skeleton className="h-8 w-16" />
                        </div>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-6 border border-red-200 rounded-md bg-red-50">
                    <p className="text-red-500">{error}</p>
                    <button
                        className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            );
        }

        if (!txList.length) {
            return (
                <div className="text-center p-6 border border-gray-200 rounded-md">
                    <p className="text-gray-500">No transactions found</p>
                </div>
            );
        }

        return (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {txList.map((tx) => {
                    // Parse the token objects if they are strings
                    const fromToken = typeof tx.fromToken === 'string'
                        ? JSON.parse(tx.fromToken)
                        : tx.fromToken;

                    const toToken = typeof tx.toToken === 'string'
                        ? JSON.parse(tx.toToken)
                        : tx.toToken;

                    return (
                        <a
                            key={tx.id || tx.hash}
                            href={tx.explorerUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 border rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <div className="relative mr-3">
                                        {fromToken?.image && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                                <Image
                                                    src={fromToken.image}
                                                    alt={fromToken.symbol}
                                                    width={32}
                                                    height={32}
                                                />
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full overflow-hidden bg-gray-100 border-2 border-white">
                                            {toToken?.image && (
                                                <Image
                                                    src={toToken.image}
                                                    alt={toToken.symbol}
                                                    width={20}
                                                    height={20}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-medium text-sm">
                                            {formatAmount(tx.amount)} {fromToken?.symbol || '?'}
                                            <span className="text-gray-500 mx-1">→</span>
                                            {toToken?.symbol || '?'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {tx.fromNetwork} to {tx.toNetwork} • {formatTime(tx.timestamp)}
                                        </p>
                                    </div>
                                </div>

                                <Badge
                                    variant="outline"
                                    className={`${getStatusColor(tx.status)} capitalize`}
                                >
                                    {tx.status || 'Unknown'}
                                </Badge>
                            </div>

                            {tx.provider && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Via {tx.provider}
                                </p>
                            )}
                        </a>
                    );
                })}
            </div>
        );
    }
}
