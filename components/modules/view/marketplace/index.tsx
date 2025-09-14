"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Store,
    Plus,
    Search,
    TrendingUp,
    Clock,
    Shield,
    Zap,
    Calendar,
    BarChart3,
    Lock,
    Unlock,
    DollarSign,
    Users,
    AlertCircle,
    CheckCircle2,
    Timer,
    Coins,
    ArrowUpRight,
    Eye,
    Star,
    Link,
    RefreshCcw,
    LockKeyhole,
    BanknoteArrowDown,
    BanknoteArrowUp,
    List
} from "lucide-react";
import { useAppKitAccount } from '@reown/appkit/react';
import { DebugMarketplace } from './components/debug-marketplace';
import { useMarketplaceListings } from './hooks/use-marketplace-listings';
import { isAdminWallet } from '@/lib/api-permissions';
import { useRouter } from 'next/navigation';
import CardStats from "../../card/stats";
import ButtonCustom from "../../button/custom";
import CardListing from "../../card/listing";
import CardIcons from "../../card/icons";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CardCustom from "../../card/custom";
import SellCarousel from "../../carousel/sell";
import BuyCarousel from "../../carousel/buy";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function MarketplaceView() {
    const [selectedTab, setSelectedTab] = useState("browse");
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<any>(null);
    const { address, isConnected } = useAppKitAccount();
    const router = useRouter();
    
    // Check if current user is admin
    const isAdmin = isConnected && address ? isAdminWallet(address) : false;
    
    // Fetch real marketplace data
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

    const ListingCard = ({ listing }: { listing: any }) => {
        const getStatusColor = (status: string) => {
            switch (status) {
                case 'Available': return 'text-green-400 border-green-400/30 bg-green-400/10';
                case 'In Escrow': return 'text-yellow-300 border-yellow-300/30 bg-yellow-300/10';
                case 'Awaiting Confirmation': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
                case 'Completed': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
                case 'Sold': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
                case 'Canceled': return 'text-red-400 border-red-400/30 bg-red-400/10';
                case 'In Dispute': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
                default: return 'text-slate-400 border-slate-400/30 bg-slate-400/10';
            }
        };

        const getCardBorderColor = (status: string) => {
            switch (status) {
                case 'Available': return 'border-green-400/50 hover:border-green-400/70 hover:shadow-green-400/10';
                case 'In Escrow': return 'border-yellow-300/50 hover:border-yellow-300/70 hover:shadow-yellow-300/10';
                case 'Awaiting Confirmation': return 'border-blue-400/50 hover:border-blue-400/70 hover:shadow-blue-400/10';
                case 'Completed': return 'border-emerald-400/50 hover:border-emerald-400/70 hover:shadow-emerald-400/10';
                case 'Sold': return 'border-purple-400/50 hover:border-purple-400/70 hover:shadow-purple-400/10';
                case 'Canceled': return 'border-red-400/50 hover:border-red-400/70 hover:shadow-red-400/10';
                case 'In Dispute': return 'border-orange-400/50 hover:border-orange-400/70 hover:shadow-orange-400/10';
                default: return 'border-slate-700/30 hover:border-cyan-400/50 hover:shadow-cyan-400/10';
            }
        };

        const getDiscountColor = (discount: string) => {
            const num = parseInt(discount);
            if (num >= 20) return 'text-red-400 border-red-400/30 bg-red-400/10';
            if (num >= 10) return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
            return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
        };

        return (
            <Card className={`group bg-slate-900/90 border ${getCardBorderColor(listing.status)} hover:shadow-lg hover:shadow-cyan-400/10 transition-all duration-300 overflow-hidden backdrop-blur-sm`}>
                <CardContent className="p-0">
                    {/* Header Section */}
                    <div className="p-6 pb-4 border-b border-slate-800/50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Badge variant="outline" className={`${getStatusColor(listing.status)} font-mono text-xs px-2 py-1 font-semibold`}>
                                        {listing.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-500/10 font-mono text-xs px-2 py-1">
                                        BSC Testnet
                                    </Badge>
                                    <Badge variant="outline" className={`${getDiscountColor(listing.discount)} font-mono text-xs px-2 py-1 font-bold`}>
                                        -{listing.discount}
                                    </Badge>
                                </div>
                                <h3 className="text-white font-bold font-mono text-xl mb-2 group-hover:text-cyan-400 transition-colors">
                                    {listing.tokenPair}
                                    <span className="text-slate-400 text-sm font-normal ml-2">LP Position</span>
                                </h3>
                                <div className="flex items-center space-x-2 text-slate-400 font-mono text-sm">
                                    <Users className="w-4 h-4" />
                                    <span>Seller: {listing.seller}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-cyan-400 font-mono mb-1">
                                    {listing.price}
                                    <span className="text-lg text-slate-400 ml-1">BNB</span>
                                </div>
                                <div className="text-sm text-slate-500 font-mono line-through">
                                    was {listing.originalValue} BNB
                                </div>
                                <div className="text-xs text-emerald-400 font-mono font-semibold mt-1">
                                    Save {((parseFloat(listing.originalValue) - parseFloat(listing.price)) * 100 / parseFloat(listing.originalValue)).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="p-6 py-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-800/60 border border-cyan-400/20 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="p-1 bg-orange-400/20 rounded-lg">
                                        <Clock className="w-4 h-4 text-orange-400" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono font-semibold">UNLOCK</span>
                                </div>
                                <div className="text-sm text-white font-mono font-bold">{listing.unlockDate}</div>
                                <div className="text-xs text-orange-400 font-mono">{listing.daysLeft} days remaining</div>
                            </div>
                            
                            <div className="bg-slate-800/60 border border-cyan-400/20 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="p-1 bg-green-400/20 rounded-lg">
                                        <Coins className="w-4 h-4 text-green-400" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono font-semibold">FEES EARNED</span>
                                </div>
                                <div className="text-sm text-white font-mono font-bold">{listing.fees}</div>
                                <div className="text-xs text-green-400 font-mono">Trading rewards</div>
                            </div>
                            
                            <div className="bg-slate-800/60 border border-cyan-400/20 rounded-xl p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="p-1 bg-blue-400/20 rounded-lg">
                                        <BarChart3 className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono font-semibold">IL</span>
                                </div>
                                <div className={`text-sm font-mono font-bold ${listing.impermanentLoss.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                    {listing.impermanentLoss}
                                </div>
                                <div className="text-xs text-slate-400 font-mono">Impermanent loss</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="p-6 pt-4 bg-slate-800/40 border-t border-cyan-400/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-600/50 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 font-mono text-xs px-4 py-2 transition-all"
                                >
                                    <Eye className="w-3 h-3 mr-2" />
                                    Details
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-600/50 text-slate-300 hover:text-purple-400 hover:border-purple-400/50 font-mono text-xs px-4 py-2 transition-all"
                                    onClick={() => window.open(listing.lockUrl, '_blank')}
                                >
                                    <ArrowUpRight className="w-3 h-3 mr-2" />
                                    Verify Lock
                                </Button>
                            </div>
                            {listing.status === 'Available' && (
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setSelectedListing(listing);
                                        setPurchaseModalOpen(true);
                                    }}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-sm px-6 py-2 font-bold shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
                                >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Buy Now
                                </Button>
                            )}
                            {listing.status === 'In Escrow' && (
                                <Badge variant="outline" className="text-yellow-300 border-yellow-300/30 bg-yellow-300/10 font-mono text-sm px-4 py-2">
                                    <Timer className="w-4 h-4 mr-2" />
                                    In Escrow
                                </Badge>
                            )}
                            {listing.status === 'Awaiting Confirmation' && (
                                <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/10 font-mono text-sm px-4 py-2">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Awaiting Confirmation
                                </Badge>
                            )}
                            {listing.status === 'Completed' && (
                                <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10 font-mono text-sm px-4 py-2">
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Completed
                                </Badge>
                            )}
                            {(listing.status === 'Canceled' || listing.status === 'Cancelled') && (
                                <Badge variant="outline" className="text-red-400 border-red-400/30 bg-red-400/10 font-mono text-sm px-4 py-2">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Cancelled
                                </Badge>
                            )}
                            {listing.status === 'In Dispute' && (
                                <Badge variant="outline" className="text-orange-400 border-orange-400/30 bg-orange-400/10 font-mono text-sm px-4 py-2">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    In Dispute
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6 p-6"
        >
            {/* Debug Info */}
            <motion.div variants={fadeInUp}>
                <DebugMarketplace />
                {formattedListings.length > 0 && (
                    <div className="mb-4 p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
                        <div className="text-green-400 font-mono text-sm">
                            ✅ Successfully loaded {formattedListings.length} listings from BSC Testnet contract
                        </div>
                    </div>
                )}
                {formattedListings.length === 0 && !isLoadingListings && (
                    <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
                        <div className="text-yellow-400 font-mono text-sm">
                            ⚠️ No listings found on contract. Create a new listing to test the marketplace.
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Header */}
            <motion.div variants={fadeInUp}>
                <div className="text-[#1DBBFF] grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 align-middle">
                    <h1 className="font-bold text-2xl my-auto">
                        Key Metric
                    </h1>
                    <div className="flex align-middle gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div>
                                    <ButtonCustom
                                        title={(
                                            <h2 className={`flex gap-1 items-center align-middle`}>
                                                <BanknoteArrowDown className={`mr-2`} />
                                                Sell <span className="hidden md:block">Locked Positions</span>
                                            </h2>
                                        )}
                                        variant={`custom`}
                                        onClick={() => setSelectedTab("create")}
                                        className={`button-gradient rounded-full mb-4`}
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-[600px] bg-[#000513]">
                                <DialogTitle>
                                    <CardCustom
                                        className="rounded-2xl"
                                        gradient="three-points-gradient-light"
                                        border="three-points-gradient-border-listing"
                                        content={(
                                            <div className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <Plus className="w-6 h-6 text-cyan-400 drop-shadow-sm" />
                                                    <CardTitle className="text-white font-mono text-xl">Create New Listing</CardTitle>
                                                </div>
                                                <p className="text-slate-400 font-mono text-sm">
                                                    List your locked LP tokens for sale to other traders
                                                </p>
                                            </div>
                                        )}
                                    />
                                </DialogTitle>
                                <div className="w-full mt-4">
                                    <SellCarousel slides={[0, 1, 2]} options={{ loop: false }} />
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <div>
                                    <ButtonCustom
                                        title={(
                                            <h2 className={`flex gap-1 items-center align-middle`}>
                                                <BanknoteArrowUp className={`mr-2`} />
                                                View <span className="hidden md:block">My Dashboard</span>
                                            </h2>
                                        )}
                                        variant={`custom`}
                                        onClick={() => setSelectedTab("create")}
                                        className={`button-gradient rounded-full mb-4`}
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-[600px] bg-[#000513]">
                                <DialogTitle>
                                    <CardCustom
                                        className="rounded-2xl"
                                        gradient="three-points-gradient-light"
                                        border="three-points-gradient-border-listing"
                                        content={(
                                            <div className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <List className="w-6 h-6 text-cyan-400 drop-shadow-sm" />
                                                    <CardTitle className="text-white font-mono text-xl">
                                                        Live Marketplace Listings ({totalListings})
                                                    </CardTitle>
                                                </div>
                                                <p className="text-slate-400 font-mono text-sm">
                                                    Real-time data from BSC Testnet contract
                                                </p>
                                            </div>
                                        )}
                                    />
                                </DialogTitle>
                                <div className="w-full mt-4">
                                    {isLoadingListings ? (
                                        <div className="text-center text-slate-400 p-8">
                                            <div className="animate-spin inline-block w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mb-2"></div>
                                            <div>Loading listings...</div>
                                        </div>
                                    ) : availableListings.length > 0 ? (
                                        <BuyCarousel 
                                            slides={[0]} 
                                            listing={availableListings[0]} 
                                            options={{ loop: false }} 
                                        />
                                    ) : formattedListings.length > 0 ? (
                                        <div className="text-center text-yellow-400 p-8">
                                            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                                            <div className="font-mono text-lg">No Available Listings</div>
                                            <div className="text-sm text-slate-400 mt-2">All current listings are sold or in escrow</div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-slate-400 p-8">
                                            <List className="w-12 h-12 mx-auto mb-2" />
                                            <div className="font-mono text-lg">No Listings Found</div>
                                            <div className="text-sm text-slate-400 mt-2">Be the first to create a listing!</div>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                        
                        {/* Admin Debug Button - Only visible to authorized wallets */}
                        {isAdmin && (
                            <ButtonCustom
                                title={(
                                    <h2 className={`flex gap-1 items-center align-middle`}>
                                        <Shield className={`mr-2`} />
                                        Admin <span className="hidden md:block">Debug Panel</span>
                                    </h2>
                                )}
                                variant={`custom`}
                                onClick={() => router.push('/admin/debug')}
                                className={`button-gradient rounded-full mb-4 border-purple-500/50 hover:border-purple-400/70`}
                            />
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={fadeInUp}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CardStats
                        className={`text-white`}
                        icon={(
                            <CardIcons
                                className={`w-fit h-fit text-center text-[#000513] border-[1px] border-[#1DBBFF] bg-gradient-to-b from-[#000513] via-[#1DBBFF]/75 to-[#000513]`}
                                icon={(
                                    <Link
                                        className={`rounded-full p-1 bg-white/75`}
                                    />
                                )}
                            />
                        )}
                        title={`${availableCount}`}
                        description={`Active Pairs`}
                    />
                    <CardStats
                        className={`text-white`}
                        icon={(
                            <CardIcons
                                className={`w-fit h-fit text-center text-[#000513] border-[1px] border-[#1DBBFF] bg-gradient-to-b from-[#000513] via-[#1DBBFF]/75 to-[#000513]`}
                                icon={(
                                    <LockKeyhole
                                        className={`rounded-full p-1 bg-white/75`}
                                    />
                                )}
                            />
                        )}
                        title={`${totalListings}`}
                        description={`Total Listings`}
                    />
                    <CardStats
                        className={`text-white`}
                        icon={(
                            <CardIcons
                                className={`w-fit h-fit text-center text-[#000513] border-[1px] border-[#1DBBFF] bg-gradient-to-b from-[#000513] via-[#1DBBFF]/75 to-[#000513]`}
                                icon={(
                                    <LockKeyhole
                                        className={`rounded-full p-1 bg-white/75`}
                                    />
                                )}
                            />
                        )}
                        title={`${inEscrowCount}`}
                        description={`In Escrow`}
                    />
                    <CardStats
                        className={`text-white`}
                        icon={(
                            <CardIcons
                                className={`w-fit h-fit text-center "text-[#000513] border-[1px] border-[#1DBBFF] bg-gradient-to-b from-[#000513] via-[#1DBBFF]/75 to-[#000513]"`}
                                icon={(
                                    <RefreshCcw
                                        className={`rounded-full p-1 bg-white/75`}
                                    />
                                )}
                            />
                        )}
                        title={`${completedCount}`}
                        description={`Completed Sales`}
                    />
                </div>
            </motion.div>
            
            {/* Main Content */}
            <motion.div variants={fadeInUp}>
                {isLoadingListings ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="text-cyan-400 font-mono">Loading marketplace data from BSC Testnet...</div>
                    </div>
                ) : listingsError ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="text-red-400 font-mono">Error loading marketplace data from contract</div>
                    </div>
                ) : formattedListings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-2xl border border-slate-700/30">
                        <List className="w-16 h-16 text-slate-600 mb-4" />
                        <h3 className="text-slate-400 font-mono text-xl mb-2">No Listings Found</h3>
                        <p className="text-slate-500 font-mono text-center max-w-md">
                            No listings have been created on the BSC Testnet marketplace contract yet. 
                            Be the first to list your locked LP position!
                        </p>
                    </div>
                ) : (
                    <CardListing
                        listings={formattedListings}
                    />
                )}
            </motion.div>
        </motion.div>
    );
}
