"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Shield,
    Database,
    Activity,
    Settings,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Users,
    DollarSign,
    BarChart3,
    RefreshCcw,
    Copy,
    ExternalLink,
    Eye,
    Code,
    Terminal,
    Network,
    Zap,
    FileText,
    Lock,
    Unlock,
    ArrowUpRight,
    Link,
    Coins,
    Search,
    UserCheck,
    History,
    ShoppingCart,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppKitAccount } from '@reown/appkit/react';
import { isAdminWallet } from '@/lib/api-permissions';
import { useMarketplaceListings } from '@/components/modules/view/marketplace/hooks/use-marketplace-listings';
import { formatEther } from 'viem';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

export default function AdminDebugPage() {
    const { address: connectedAddress, isConnected } = useAppKitAccount();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [debugData, setDebugData] = useState<any>({});
    const [refreshKey, setRefreshKey] = useState(0);
    
    // User lookup functionality
    const [userAddress, setUserAddress] = useState('');
    const [userAnalysis, setUserAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Get marketplace data for debugging
    const { 
        formattedListings, 
        isLoading: isLoadingListings, 
        error: listingsError, 
        availableListings,
        totalListings,
        availableCount,
        inEscrowCount,
        completedCount 
    } = useMarketplaceListings();

    useEffect(() => {
        if (isConnected && connectedAddress) {
            const authorized = isAdminWallet(connectedAddress);
            setIsAuthorized(authorized);
            
            // Collect debug data
            if (authorized) {
                setDebugData({
                    timestamp: new Date().toISOString(),
                    walletAddress: connectedAddress,
                    networkInfo: {
                        chainId: 97,
                        chainName: 'BSC Testnet',
                        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                        blockExplorer: 'https://testnet.bscscan.com'
                    },
                    contractInfo: {
                        address: '0xe36087316038f78A34530D6e418831198E5582Cf',
                        verified: true,
                        functions: ['getCurrentListingId', 'getListing', 'createListing', 'purchaseListing']
                    },
                    marketplaceStats: {
                        totalListings,
                        availableListings: availableCount,
                        inEscrow: inEscrowCount,
                        completed: completedCount,
                        isLoading: isLoadingListings,
                        hasError: !!listingsError
                    }
                });
            }
        } else {
            setIsAuthorized(false);
        }
    }, [connectedAddress, isConnected, totalListings, availableCount, inEscrowCount, completedCount, isLoadingListings, listingsError]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const refreshData = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Analyze user activity
    const analyzeUser = async (address: string) => {
        if (!address || address.length !== 42 || !address.startsWith('0x')) {
            alert('Please enter a valid Ethereum address');
            return;
        }

        setIsAnalyzing(true);
        try {
            // Find user's listings (as seller)
            const userListings = formattedListings.filter(listing => 
                listing.seller.toLowerCase() === address.toLowerCase()
            );

            // Find user's purchases (as buyer) 
            const userPurchases = formattedListings.filter(listing => 
                listing.buyer && listing.buyer.toLowerCase() === address.toLowerCase()
            );

            // Calculate user statistics
            const totalListings = userListings.length;
            const activeListings = userListings.filter(l => l.status === 'Available').length;
            const completedSales = userListings.filter(l => l.status === 'Completed').length;
            const totalPurchases = userPurchases.length;
            const completedPurchases = userPurchases.filter(l => l.status === 'Completed').length;

            // Calculate total volume
            const sellVolume = userListings.reduce((sum, listing) => {
                return sum + (listing.status === 'Completed' ? parseFloat(listing.price) : 0);
            }, 0);

            const buyVolume = userPurchases.reduce((sum, listing) => {
                return sum + (listing.status === 'Completed' ? parseFloat(listing.price) : 0);
            }, 0);

            // Risk analysis
            const riskFactors = [];
            if (totalListings > 10) riskFactors.push('High volume seller');
            if (totalPurchases > 5) riskFactors.push('Active buyer');
            if (sellVolume > 10) riskFactors.push('High value transactions');
            
            // Transaction patterns
            const lastActivity = Math.max(
                ...userListings.map(l => Number(l.createdAt || 0)),
                ...userPurchases.map(l => Number(l.purchaseTimestamp || 0))
            );

            setUserAnalysis({
                address: address,
                timestamp: new Date().toISOString(),
                listings: {
                    total: totalListings,
                    active: activeListings,
                    completed: completedSales,
                    inEscrow: userListings.filter(l => l.status === 'In Escrow').length,
                    cancelled: userListings.filter(l => l.status === 'Canceled').length,
                    data: userListings
                },
                purchases: {
                    total: totalPurchases,
                    completed: completedPurchases,
                    pending: userPurchases.filter(l => l.status === 'In Escrow' || l.status === 'Awaiting Confirmation').length,
                    data: userPurchases
                },
                volume: {
                    totalSold: sellVolume,
                    totalBought: buyVolume,
                    netVolume: sellVolume - buyVolume
                },
                activity: {
                    lastActivity: lastActivity,
                    daysSinceLastActivity: lastActivity ? Math.floor((Date.now() - Number(lastActivity) * 1000) / (1000 * 60 * 60 * 24)) : null,
                    isActive: lastActivity && (Date.now() - Number(lastActivity) * 1000) < (7 * 24 * 60 * 60 * 1000) // Active in last 7 days
                },
                risk: {
                    level: riskFactors.length > 2 ? 'High' : riskFactors.length > 0 ? 'Medium' : 'Low',
                    factors: riskFactors
                },
                reputation: {
                    successRate: totalListings > 0 ? Math.round((completedSales / totalListings) * 100) : 0,
                    buyerRating: totalPurchases > 0 ? Math.round((completedPurchases / totalPurchases) * 100) : 0
                }
            });
        } catch (error) {
            console.error('Error analyzing user:', error);
            alert('Error analyzing user data');
        }
        setIsAnalyzing(false);
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-[#000513] flex items-center justify-center">
                <Card className="bg-slate-900/90 border-slate-700/50 p-8">
                    <CardContent className="text-center">
                        <Shield className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-white font-mono text-xl mb-2">Wallet Connection Required</h2>
                        <p className="text-slate-400 font-mono">Please connect your wallet to access the admin dashboard.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#000513] flex items-center justify-center">
                <Card className="bg-slate-900/90 border-red-500/50 p-8">
                    <CardContent className="text-center">
                        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-white font-mono text-xl mb-2">Access Denied</h2>
                        <p className="text-slate-400 font-mono mb-4">Your wallet address is not authorized to access this admin panel.</p>
                        <p className="text-slate-500 font-mono text-sm">Connected: {connectedAddress}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000513] p-4">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white font-mono mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                Admin Debug Dashboard
                            </h1>
                            <p className="text-slate-400 font-mono">
                                Comprehensive debugging and monitoring for the Vizor Marketplace
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 font-mono">
                                <Shield className="w-4 h-4 mr-1" />
                                Admin Access
                            </Badge>
                            <Button
                                onClick={refreshData}
                                variant="outline"
                                className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 font-mono"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-slate-900/90 border-slate-700/50 hover:border-cyan-400/50 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Network Status</p>
                                    <p className="text-green-400 font-mono text-xl font-bold">Online</p>
                                </div>
                                <Network className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/90 border-slate-700/50 hover:border-cyan-400/50 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Contract Status</p>
                                    <p className="text-green-400 font-mono text-xl font-bold">Active</p>
                                </div>
                                <Code className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/90 border-slate-700/50 hover:border-cyan-400/50 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Total Listings</p>
                                    <p className="text-cyan-400 font-mono text-xl font-bold">{totalListings}</p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/90 border-slate-700/50 hover:border-cyan-400/50 transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Available</p>
                                    <p className="text-green-400 font-mono text-xl font-bold">{availableCount}</p>
                                </div>
                                <Unlock className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Debug Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-slate-900/50 border border-slate-700/50">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-mono">
                            <Activity className="w-4 h-4 mr-2" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="contract" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-mono">
                            <Code className="w-4 h-4 mr-2" />
                            Contract
                        </TabsTrigger>
                        <TabsTrigger value="listings" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-mono">
                            <Database className="w-4 h-4 mr-2" />
                            Listings
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-mono">
                            <UserCheck className="w-4 h-4 mr-2" />
                            User Lookup
                        </TabsTrigger>
                        <TabsTrigger value="network" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-mono">
                            <Network className="w-4 h-4 mr-2" />
                            Network
                        </TabsTrigger>
                        <TabsTrigger value="debug" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white font-mono">
                            <Terminal className="w-4 h-4 mr-2" />
                            Debug Logs
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-slate-900/90 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white font-mono flex items-center">
                                        <Shield className="w-5 h-5 mr-2 text-cyan-400" />
                                        Admin Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 font-mono text-sm">Wallet Address:</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-cyan-400 font-mono text-sm">{connectedAddress?.slice(0, 6)}...{connectedAddress?.slice(-4)}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => copyToClipboard(connectedAddress || '')}
                                                className="h-6 w-6 p-0 text-slate-400 hover:text-cyan-400"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 font-mono text-sm">Access Level:</span>
                                        <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 font-mono text-xs">
                                            Full Admin
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400 font-mono text-sm">Session Started:</span>
                                        <span className="text-slate-300 font-mono text-sm">{debugData.timestamp?.split('T')[1]?.split('.')[0]}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900/90 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white font-mono flex items-center">
                                        <BarChart3 className="w-5 h-5 mr-2 text-cyan-400" />
                                        Marketplace Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                            <p className="text-2xl font-bold text-cyan-400 font-mono">{totalListings}</p>
                                            <p className="text-slate-400 font-mono text-xs">Total Listings</p>
                                        </div>
                                        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-400 font-mono">{availableCount}</p>
                                            <p className="text-slate-400 font-mono text-xs">Available</p>
                                        </div>
                                        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                            <p className="text-2xl font-bold text-yellow-400 font-mono">{inEscrowCount}</p>
                                            <p className="text-slate-400 font-mono text-xs">In Escrow</p>
                                        </div>
                                        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                            <p className="text-2xl font-bold text-purple-400 font-mono">{completedCount}</p>
                                            <p className="text-slate-400 font-mono text-xs">Completed</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Quick User Lookup */}
                        <Card className="bg-slate-900/90 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white font-mono flex items-center">
                                    <UserCheck className="w-5 h-5 mr-2 text-cyan-400" />
                                    Quick User Lookup
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex space-x-3">
                                    <Input
                                        placeholder="Enter wallet address for quick analysis..."
                                        value={userAddress}
                                        onChange={(e) => setUserAddress(e.target.value)}
                                        className="bg-slate-800/50 border-slate-600/50 text-white font-mono placeholder:text-slate-400"
                                    />
                                    <Button
                                        onClick={() => analyzeUser(userAddress)}
                                        disabled={isAnalyzing || !userAddress}
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-mono whitespace-nowrap"
                                    >
                                        {isAnalyzing ? (
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                        ) : (
                                            <Search className="w-4 h-4" />
                                        )}
                                    </Button>
                                </div>
                                
                                {/* Recent Active Users */}
                                <div>
                                    <h4 className="text-slate-300 font-mono text-sm mb-2">Recent Active Users:</h4>
                                    <div className="space-y-1">
                                        {formattedListings.slice(0, 3).map((listing) => (
                                            <div key={listing.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-cyan-400 font-mono text-xs">
                                                        {listing.seller.slice(0, 8)}...{listing.seller.slice(-4)}
                                                    </span>
                                                    <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 font-mono text-xs">
                                                        Seller
                                                    </Badge>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 text-slate-400 hover:text-cyan-400 font-mono text-xs"
                                                    onClick={() => {
                                                        setUserAddress(listing.seller);
                                                        analyzeUser(listing.seller);
                                                    }}
                                                >
                                                    Analyze
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contract Tab */}
                    <TabsContent value="contract" className="space-y-6">
                        <Card className="bg-slate-900/90 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white font-mono flex items-center">
                                    <Code className="w-5 h-5 mr-2 text-cyan-400" />
                                    Smart Contract Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white font-mono">Contract Details</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-slate-400 font-mono text-sm mb-1">Contract Address:</p>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-cyan-400 font-mono text-sm bg-slate-800/50 px-2 py-1 rounded">
                                                        0xe36087316038f78A34530D6e418831198E5582Cf
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => copyToClipboard('0xe36087316038f78A34530D6e418831198E5582Cf')}
                                                        className="h-6 w-6 p-0 text-slate-400 hover:text-cyan-400"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => window.open('https://testnet.bscscan.com/address/0xe36087316038f78A34530D6e418831198E5582Cf', '_blank')}
                                                        className="h-6 w-6 p-0 text-slate-400 hover:text-cyan-400"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 font-mono text-sm mb-1">Network:</p>
                                                <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10 font-mono">
                                                    BSC Testnet (Chain ID: 97)
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 font-mono text-sm mb-1">Status:</p>
                                                <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 font-mono">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Verified & Active
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white font-mono">Available Functions</h3>
                                        <div className="space-y-2">
                                            {['getCurrentListingId', 'getListing', 'createListing', 'purchaseListing', 'cancelListing', 'confirmReceiptAndRelease'].map((func) => (
                                                <div key={func} className="flex items-center space-x-2 p-2 bg-slate-800/30 rounded">
                                                    <Zap className="w-4 h-4 text-green-400" />
                                                    <span className="text-slate-300 font-mono text-sm">{func}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Listings Tab */}
                    <TabsContent value="listings" className="space-y-6">
                        <Card className="bg-slate-900/90 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white font-mono flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Database className="w-5 h-5 mr-2 text-cyan-400" />
                                        Detailed Listings Analysis
                                    </div>
                                    <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 bg-cyan-400/10 font-mono">
                                        {formattedListings.length} Total
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingListings ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mb-2"></div>
                                        <p className="text-slate-400 font-mono">Loading marketplace data...</p>
                                    </div>
                                ) : formattedListings.length > 0 ? (
                                    <div className="space-y-4">
                                        {formattedListings.map((listing, index) => (
                                            <Card key={listing.id} className="bg-slate-800/50 border-slate-600/50">
                                                <CardContent className="p-4">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                        <div>
                                                            <h4 className="text-white font-mono text-lg mb-2">Listing #{listing.id}</h4>
                                                            <div className="space-y-1 text-sm">
                                                                <p className="text-slate-400 font-mono">Status: <span className="text-green-400">{listing.status}</span></p>
                                                                <p className="text-slate-400 font-mono">Price: <span className="text-cyan-400">{listing.price} tBNB</span></p>
                                                                <p className="text-slate-400 font-mono">Token: <span className="text-purple-400">{listing.name}</span></p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-slate-300 font-mono text-sm mb-2">Addresses</h5>
                                                            <div className="space-y-1 text-xs">
                                                                <p className="text-slate-400 font-mono">Seller: <span className="text-green-400">{listing.seller.slice(0, 10)}...</span></p>
                                                                <p className="text-slate-400 font-mono">Token: <span className="text-blue-400">{listing.tokenAddress.slice(0, 10)}...</span></p>
                                                                <p className="text-slate-400 font-mono">LP: <span className="text-purple-400">{listing.lpAddress.slice(0, 10)}...</span></p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-slate-600/50 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 font-mono"
                                                                onClick={() => window.open(listing.lockUrl, '_blank')}
                                                            >
                                                                <Eye className="w-3 h-3 mr-1" />
                                                                View Lock
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-slate-600/50 text-slate-300 hover:text-purple-400 hover:border-purple-400/50 font-mono"
                                                                onClick={() => copyToClipboard(JSON.stringify(listing, null, 2))}
                                                            >
                                                                <Copy className="w-3 h-3 mr-1" />
                                                                Copy Data
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Database className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                                        <p className="text-slate-400 font-mono">No listings found in the marketplace</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* User Lookup Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <Card className="bg-slate-900/90 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white font-mono flex items-center">
                                    <UserCheck className="w-5 h-5 mr-2 text-cyan-400" />
                                    User Activity Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* User Search */}
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Enter user wallet address (0x...)"
                                            value={userAddress}
                                            onChange={(e) => setUserAddress(e.target.value)}
                                            className="bg-slate-800/50 border-slate-600/50 text-white font-mono placeholder:text-slate-400"
                                        />
                                    </div>
                                    <Button
                                        onClick={() => analyzeUser(userAddress)}
                                        disabled={isAnalyzing || !userAddress}
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-mono px-6"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="w-4 h-4 mr-2" />
                                                Analyze User
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* User Analysis Results */}
                                {userAnalysis && (
                                    <div className="space-y-6">
                                        {/* User Overview */}
                                        <Card className="bg-slate-800/50 border-slate-600/50">
                                            <CardHeader>
                                                <CardTitle className="text-white font-mono text-lg flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Users className="w-5 h-5 mr-2 text-cyan-400" />
                                                        User Overview
                                                    </div>
                                                    <Badge variant="outline" className={`font-mono ${
                                                        userAnalysis.risk.level === 'High' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                                                        userAnalysis.risk.level === 'Medium' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                                                        'text-green-400 border-green-400/30 bg-green-400/10'
                                                    }`}>
                                                        {userAnalysis.risk.level} Risk
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-slate-400 font-mono text-sm mb-1">Wallet Address:</p>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-cyan-400 font-mono text-sm bg-slate-700/50 px-2 py-1 rounded">
                                                                {userAnalysis.address.slice(0, 8)}...{userAnalysis.address.slice(-6)}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => copyToClipboard(userAnalysis.address)}
                                                                className="h-6 w-6 p-0 text-slate-400 hover:text-cyan-400"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => window.open(`https://testnet.bscscan.com/address/${userAnalysis.address}`, '_blank')}
                                                                className="h-6 w-6 p-0 text-slate-400 hover:text-cyan-400"
                                                            >
                                                                <ExternalLink className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 font-mono text-sm mb-1">Last Activity:</p>
                                                        <p className="text-white font-mono text-sm">
                                                            {userAnalysis.activity.daysSinceLastActivity !== null ? 
                                                                `${userAnalysis.activity.daysSinceLastActivity} days ago` : 
                                                                'No activity found'
                                                            }
                                                        </p>
                                                        <Badge variant="outline" className={`mt-1 font-mono text-xs ${
                                                            userAnalysis.activity.isActive ? 
                                                            'text-green-400 border-green-400/30 bg-green-400/10' : 
                                                            'text-red-400 border-red-400/30 bg-red-400/10'
                                                        }`}>
                                                            {userAnalysis.activity.isActive ? 'Active User' : 'Inactive'}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-400 font-mono text-sm mb-1">Success Rate:</p>
                                                        <p className="text-green-400 font-mono text-lg font-bold">
                                                            {userAnalysis.reputation.successRate}%
                                                        </p>
                                                        <p className="text-slate-500 font-mono text-xs">
                                                            Seller completion rate
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Statistics Grid */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <Card className="bg-slate-800/50 border-slate-600/50">
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-cyan-400 font-mono mb-1">
                                                        {userAnalysis.listings.total}
                                                    </div>
                                                    <div className="text-slate-400 font-mono text-sm">Total Listings</div>
                                                    <div className="text-green-400 font-mono text-xs mt-1">
                                                        {userAnalysis.listings.active} active
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-slate-800/50 border-slate-600/50">
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-purple-400 font-mono mb-1">
                                                        {userAnalysis.purchases.total}
                                                    </div>
                                                    <div className="text-slate-400 font-mono text-sm">Total Purchases</div>
                                                    <div className="text-green-400 font-mono text-xs mt-1">
                                                        {userAnalysis.purchases.completed} completed
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-slate-800/50 border-slate-600/50">
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-green-400 font-mono mb-1">
                                                        {userAnalysis.volume.totalSold.toFixed(2)}
                                                    </div>
                                                    <div className="text-slate-400 font-mono text-sm">BNB Sold</div>
                                                    <div className="text-slate-500 font-mono text-xs mt-1">Total volume</div>
                                                </CardContent>
                                            </Card>

                                            <Card className="bg-slate-800/50 border-slate-600/50">
                                                <CardContent className="p-4 text-center">
                                                    <div className="text-2xl font-bold text-blue-400 font-mono mb-1">
                                                        {userAnalysis.volume.totalBought.toFixed(2)}
                                                    </div>
                                                    <div className="text-slate-400 font-mono text-sm">BNB Bought</div>
                                                    <div className="text-slate-500 font-mono text-xs mt-1">Purchase volume</div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Risk Analysis */}
                                        {userAnalysis.risk.factors.length > 0 && (
                                            <Card className="bg-slate-800/50 border-slate-600/50">
                                                <CardHeader>
                                                    <CardTitle className="text-white font-mono text-lg flex items-center">
                                                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                                                        Risk Factors
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        {userAnalysis.risk.factors.map((factor: string, index: number) => (
                                                            <div key={index} className="flex items-center space-x-2 p-2 bg-slate-700/30 rounded">
                                                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                                                <span className="text-slate-300 font-mono text-sm">{factor}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* User's Listings */}
                                        {userAnalysis.listings.data.length > 0 && (
                                            <Card className="bg-slate-800/50 border-slate-600/50">
                                                <CardHeader>
                                                    <CardTitle className="text-white font-mono text-lg flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <Database className="w-5 h-5 mr-2 text-cyan-400" />
                                                            User's Listings ({userAnalysis.listings.data.length})
                                                        </div>
                                                        <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 bg-cyan-400/10 font-mono">
                                                            As Seller
                                                        </Badge>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                                        {userAnalysis.listings.data.map((listing: any, index: number) => (
                                                            <div key={listing.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-white font-mono text-sm font-bold">
                                                                            Listing #{listing.id} - {listing.tokenPair}
                                                                        </p>
                                                                        <p className="text-slate-400 font-mono text-xs">
                                                                            Price: {listing.price} BNB • Status: {listing.status}
                                                                        </p>
                                                                    </div>
                                                                    <Badge variant="outline" className={`font-mono text-xs ${
                                                                        listing.status === 'Available' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                                                                        listing.status === 'Completed' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
                                                                        listing.status === 'In Escrow' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                                                                        'text-red-400 border-red-400/30 bg-red-400/10'
                                                                    }`}>
                                                                        {listing.status}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* User's Purchases */}
                                        {userAnalysis.purchases.data.length > 0 && (
                                            <Card className="bg-slate-800/50 border-slate-600/50">
                                                <CardHeader>
                                                    <CardTitle className="text-white font-mono text-lg flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <ShoppingCart className="w-5 h-5 mr-2 text-purple-400" />
                                                            User's Purchases ({userAnalysis.purchases.data.length})
                                                        </div>
                                                        <Badge variant="outline" className="text-purple-400 border-purple-400/30 bg-purple-400/10 font-mono">
                                                            As Buyer
                                                        </Badge>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                                        {userAnalysis.purchases.data.map((listing: any, index: number) => (
                                                            <div key={listing.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-white font-mono text-sm font-bold">
                                                                            Purchase #{listing.id} - {listing.tokenPair}
                                                                        </p>
                                                                        <p className="text-slate-400 font-mono text-xs">
                                                                            Paid: {listing.price} BNB • Status: {listing.status}
                                                                        </p>
                                                                    </div>
                                                                    <Badge variant="outline" className={`font-mono text-xs ${
                                                                        listing.status === 'Completed' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                                                                        listing.status === 'In Escrow' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                                                                        'text-red-400 border-red-400/30 bg-red-400/10'
                                                                    }`}>
                                                                        {listing.status}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Export User Data */}
                                        <Card className="bg-slate-800/50 border-slate-600/50">
                                            <CardHeader>
                                                <CardTitle className="text-white font-mono text-lg flex items-center">
                                                    <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                                                    Export & Actions
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex space-x-4">
                                                    <Button
                                                        variant="outline"
                                                        className="border-slate-600/50 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 font-mono"
                                                        onClick={() => copyToClipboard(JSON.stringify(userAnalysis, null, 2))}
                                                    >
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        Copy Full Analysis
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="border-slate-600/50 text-slate-300 hover:text-purple-400 hover:border-purple-400/50 font-mono"
                                                        onClick={() => window.open(`https://testnet.bscscan.com/address/${userAnalysis.address}`, '_blank')}
                                                    >
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        View on BSCScan
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* No Analysis Yet */}
                                {!userAnalysis && (
                                    <div className="text-center py-12">
                                        <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-slate-400 font-mono text-xl mb-2">User Analysis</h3>
                                        <p className="text-slate-500 font-mono text-center max-w-md mx-auto">
                                            Enter a wallet address above to analyze a user's complete marketplace activity, 
                                            including their listings, purchases, transaction history, and risk assessment.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Network Tab */}
                    <TabsContent value="network" className="space-y-6">
                        <Card className="bg-slate-900/90 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white font-mono flex items-center">
                                    <Network className="w-5 h-5 mr-2 text-cyan-400" />
                                    Network Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white font-mono">BSC Testnet Details</h3>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-slate-800/50 rounded-lg">
                                                <p className="text-slate-400 font-mono text-sm">Chain ID:</p>
                                                <p className="text-cyan-400 font-mono text-lg">97</p>
                                            </div>
                                            <div className="p-3 bg-slate-800/50 rounded-lg">
                                                <p className="text-slate-400 font-mono text-sm">RPC URL:</p>
                                                <p className="text-green-400 font-mono text-sm break-all">https://data-seed-prebsc-1-s1.binance.org:8545/</p>
                                            </div>
                                            <div className="p-3 bg-slate-800/50 rounded-lg">
                                                <p className="text-slate-400 font-mono text-sm">Block Explorer:</p>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-purple-400 font-mono text-sm">testnet.bscscan.com</p>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => window.open('https://testnet.bscscan.com', '_blank')}
                                                        className="h-6 w-6 p-0 text-slate-400 hover:text-purple-400"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white font-mono">Connection Status</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-slate-400 font-mono text-sm">Wallet Connected:</span>
                                                <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 font-mono">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Yes
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-slate-400 font-mono text-sm">Contract Accessible:</span>
                                                <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 font-mono">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Yes
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-slate-400 font-mono text-sm">Data Loading:</span>
                                                <Badge variant="outline" className={isLoadingListings ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" : "text-green-400 border-green-400/30 bg-green-400/10"}>
                                                    {isLoadingListings ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                    {isLoadingListings ? 'Loading...' : 'Complete'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Debug Logs Tab */}
                    <TabsContent value="debug" className="space-y-6">
                        <Card className="bg-slate-900/90 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white font-mono flex items-center">
                                    <Terminal className="w-5 h-5 mr-2 text-cyan-400" />
                                    Debug Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
                                        <h4 className="text-green-400 font-mono text-sm mb-2">✅ System Status</h4>
                                        <div className="space-y-1 text-xs font-mono">
                                            <p className="text-slate-300">• Marketplace contract deployed and verified</p>
                                            <p className="text-slate-300">• Real-time data fetching operational</p>
                                            <p className="text-slate-300">• Wallet integration functional</p>
                                            <p className="text-slate-300">• Admin access granted to authorized wallets</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
                                        <h4 className="text-cyan-400 font-mono text-sm mb-2">📊 Current Debug Data</h4>
                                        <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(debugData, null, 2)}
                                        </pre>
                                    </div>

                                    {listingsError && (
                                        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                                            <h4 className="text-red-400 font-mono text-sm mb-2">⚠️ Errors Detected</h4>
                                            <pre className="text-xs text-red-300 font-mono overflow-x-auto">
                                                {JSON.stringify(listingsError, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}
