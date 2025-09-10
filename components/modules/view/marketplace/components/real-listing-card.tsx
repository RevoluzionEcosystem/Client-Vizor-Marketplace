import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatEther } from 'viem';
import { 
    ExternalLink, 
    Clock, 
    DollarSign, 
    Timer, 
    Shield,
    Calendar,
    Link,
    User
} from 'lucide-react';

// Contract Listing structure based on ABI
interface ContractListing {
    id: bigint;
    seller: string;
    buyer: string;
    price: bigint;
    tokenAddress: string;
    lpAddress: string;
    lockUrl: string;
    transferProofHash: string;
    contactMethod: string;
    status: number; // 0=Available, 1=InEscrow, 2=AwaitingConfirmation, 3=Completed, 4=Cancelled, 5=InDispute
    purchaseTimestamp: bigint;
    createdAt: bigint;
}

interface RealListingCardProps {
    listing: ContractListing;
    onPurchase?: (listingId: number) => void;
    isLoading?: boolean;
}

export function RealListingCard({ listing, onPurchase, isLoading }: RealListingCardProps) {
    const getStatusInfo = (status: number) => {
        switch (status) {
            case 0: return { text: 'Available', color: 'text-green-400 border-green-400/30 bg-green-400/10' };
            case 1: return { text: 'In Escrow', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' };
            case 2: return { text: 'Awaiting Confirmation', color: 'text-blue-400 border-blue-400/30 bg-blue-400/10' };
            case 3: return { text: 'Completed', color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' };
            case 4: return { text: 'Cancelled', color: 'text-red-400 border-red-400/30 bg-red-400/10' };
            case 5: return { text: 'In Dispute', color: 'text-orange-400 border-orange-400/30 bg-orange-400/10' };
            default: return { text: 'Unknown', color: 'text-slate-400 border-slate-400/30 bg-slate-400/10' };
        }
    };

    const formatTimestamp = (timestamp: bigint) => {
        if (timestamp === BigInt(0)) return 'Not set';
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const statusInfo = getStatusInfo(listing.status);
    const priceInBNB = formatEther(listing.price);
    const isAvailable = listing.status === 0;
    const hasTransferProof = listing.transferProofHash && listing.transferProofHash !== '';

    return (
        <Card className={`bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-all duration-300 ${
            isAvailable ? 'hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/10' : ''
        }`}>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {/* Header with ID and Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-bold text-white font-mono">
                                Listing #{Number(listing.id)}
                            </h3>
                            <Badge className={`${statusInfo.color} font-mono text-xs px-3 py-1`}>
                                {statusInfo.text}
                            </Badge>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-cyan-400 font-mono">
                                {priceInBNB} BNB
                            </p>
                        </div>
                    </div>

                    {/* Seller and Buyer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-slate-400 font-mono text-xs">Seller</p>
                                <p className="text-white font-mono text-sm">
                                    {listing.seller.slice(0, 8)}...{listing.seller.slice(-6)}
                                </p>
                            </div>
                        </div>
                        
                        {listing.buyer !== '0x0000000000000000000000000000000000000000' && (
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-slate-400 font-mono text-xs">Buyer</p>
                                    <p className="text-white font-mono text-sm">
                                        {listing.buyer.slice(0, 8)}...{listing.buyer.slice(-6)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Token Addresses */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-mono text-sm">Token Address:</span>
                            <a 
                                href={`https://testnet.bscscan.com/address/${listing.tokenAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                            >
                                <span>{listing.tokenAddress.slice(0, 8)}...{listing.tokenAddress.slice(-6)}</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 font-mono text-sm">LP Address:</span>
                            <a 
                                href={`https://testnet.bscscan.com/address/${listing.lpAddress}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                            >
                                <span>{listing.lpAddress.slice(0, 8)}...{listing.lpAddress.slice(-6)}</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-slate-400 font-mono text-xs">Created</p>
                                <p className="text-white font-mono text-sm">
                                    {formatTimestamp(listing.createdAt)}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <div>
                                <p className="text-slate-400 font-mono text-xs">Contact Method</p>
                                <p className="text-white font-mono text-sm">
                                    {listing.contactMethod || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chain Info - BSC Testnet */}
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 font-mono text-sm">
                                BSC Testnet
                            </span>
                        </div>
                        <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30 font-mono text-xs">
                            Chain 97
                        </Badge>
                    </div>

                    {/* Lock URL */}
                    {listing.lockUrl && (
                        <div className="flex items-center justify-between p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <Link className="w-4 h-4 text-amber-400" />
                                <span className="text-amber-400 font-mono text-sm">Lock Details</span>
                            </div>
                            <a 
                                href={listing.lockUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-mono text-sm"
                            >
                                <span>View Lock</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    )}

                    {/* Transfer Proof (if exists) */}
                    {hasTransferProof && (
                        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                                <Shield className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 font-mono text-sm">Transfer Proof Submitted</span>
                            </div>
                            <p className="text-green-300 font-mono text-xs break-all">
                                {listing.transferProofHash}
                            </p>
                        </div>
                    )}

                    {/* Purchase Timestamp (if sold) */}
                    {listing.purchaseTimestamp > 0 && (
                        <div className="flex items-center space-x-2">
                            <Timer className="w-4 h-4 text-yellow-400" />
                            <div>
                                <p className="text-slate-400 font-mono text-xs">Purchased</p>
                                <p className="text-yellow-400 font-mono text-sm">
                                    {formatTimestamp(listing.purchaseTimestamp)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-2">
                        {isAvailable && onPurchase && (
                            <Button
                                onClick={() => onPurchase(Number(listing.id))}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono font-bold shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
                            >
                                <DollarSign className="w-4 h-4 mr-2" />
                                {isLoading ? 'Processing...' : `Buy for ${priceInBNB} BNB`}
                            </Button>
                        )}
                        
                        {!isAvailable && (
                            <div className="text-center py-2">
                                <p className="text-slate-400 font-mono text-sm">
                                    {listing.status === 1 ? 'This listing has been sold' :
                                     listing.status === 2 ? 'Transaction in escrow' :
                                     listing.status === 3 ? 'Transaction completed' :
                                     'Listing no longer available'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
