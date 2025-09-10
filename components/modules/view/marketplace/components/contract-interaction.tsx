import React from 'react';
import { useMarketplaceContract } from '../hooks/use-marketplace-contract';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContractInteractionProps {
    listingId?: number;
}

export function ContractInteraction({ listingId = 1 }: ContractInteractionProps) {
    const { useListing, useIsConfirmationExpired, formatPrice, formatListing } = useMarketplaceContract();
    
    const { data: listingData, isLoading: listingLoading, error: listingError } = useListing(listingId);
    const { data: isExpired, isLoading: expiredLoading } = useIsConfirmationExpired(listingId);
    
    if (listingLoading) {
        return (
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6 text-center">
                    <Loader2 className="w-8 h-8 text-cyan-400 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-400 font-mono">Loading listing data...</p>
                </CardContent>
            </Card>
        );
    }
    
    if (listingError) {
        return (
            <Card className="bg-slate-800/50 border-red-500/50">
                <CardContent className="p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400 font-mono mb-2">Error loading listing</p>
                    <p className="text-slate-400 text-sm">{listingError.message}</p>
                </CardContent>
            </Card>
        );
    }
    
    if (!listingData) {
        return (
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                    <p className="text-orange-400 font-mono">No listing found</p>
                    <p className="text-slate-400 text-sm">Listing ID {listingId} does not exist</p>
                </CardContent>
            </Card>
        );
    }
    
    const listing = formatListing(listingData);
    
    return (
        <Card className="bg-slate-800/50 border-green-500/50">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                    <CardTitle className="text-white font-mono">Contract Connected</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-slate-400 text-sm font-mono">Listing ID</p>
                        <p className="text-white font-mono font-bold">{listing.id.toString()}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-mono">Price</p>
                        <p className="text-cyan-400 font-mono font-bold">{formatPrice(listing.price)} BNB</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-mono">Seller</p>
                        <p className="text-white font-mono text-sm">{listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-mono">Status</p>
                        <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10 font-mono">
                            {listing.status}
                        </Badge>
                    </div>
                </div>
                
                {listing.lockUrl && (
                    <div>
                        <p className="text-slate-400 text-sm font-mono mb-2">Lock URL</p>
                        <p className="text-blue-400 font-mono text-sm break-all">{listing.lockUrl}</p>
                    </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-slate-400 font-mono text-sm">Confirmation Expired:</span>
                    <Badge variant="outline" className={isExpired ? "text-red-400 border-red-400/30" : "text-green-400 border-green-400/30"}>
                        {expiredLoading ? "Loading..." : isExpired ? "Yes" : "No"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
