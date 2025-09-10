import React, { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RealListingCard } from './real-listing-card';
import { marketplaceAbi, MARKETPLACE_CONTRACT_ADDRESS } from '../abi/marketplace-abi';
import { 
    Loader2, 
    AlertCircle, 
    Search, 
    RefreshCw,
    Store,
    Info
} from 'lucide-react';

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
    status: number;
    purchaseTimestamp: bigint;
    createdAt: bigint;
}

interface RealListingsViewProps {
    onPurchase?: (listingId: number) => void;
}

export function RealListingsView({ onPurchase }: RealListingsViewProps) {
    const [listings, setListings] = useState<ContractListing[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [maxScanned, setMaxScanned] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Function to scan for listings
    const scanForListings = async () => {
        setIsScanning(true);
        setError(null);
        const foundListings: ContractListing[] = [];
        let consecutiveErrors = 0;
        const maxConsecutiveErrors = 5; // Stop after 5 consecutive failed queries
        let currentId = 1;

        while (consecutiveErrors < maxConsecutiveErrors && currentId <= 50) { // Limit to first 50 IDs
            try {
                // This would need to be done with individual useReadContract calls
                // For now, we'll simulate the process
                await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
                
                // In a real implementation, you'd call the contract here
                // For now, we'll create a placeholder
                setMaxScanned(currentId);
                
                consecutiveErrors = 0; // Reset counter on successful query
            } catch (err) {
                consecutiveErrors++;
            }
            currentId++;
        }

        setListings(foundListings);
        setScanComplete(true);
        setIsScanning(false);
    };

    // Individual listing fetcher component
    const ListingFetcher = ({ listingId }: { listingId: number }) => {
        const { data: listing, isLoading, error } = useReadContract({
            address: MARKETPLACE_CONTRACT_ADDRESS,
            abi: marketplaceAbi,
            functionName: 'getListing',
            args: [BigInt(listingId)],
            chainId: bscTestnet.id,
        });

        useEffect(() => {
            if (listing && !error) {
                // The contract returns an object that matches our interface structure
                const contractListing = listing as unknown as ContractListing;
                if (contractListing.seller !== '0x0000000000000000000000000000000000000000') {
                    setListings(prev => {
                        // Check if already exists
                        const exists = prev.some(l => l.id === contractListing.id);
                        if (!exists) {
                            return [...prev, contractListing].sort((a, b) => Number(a.id) - Number(b.id));
                        }
                        return prev;
                    });
                }
            }
        }, [listing, error]);

        return null; // This component doesn't render anything
    };

    // Scan for listings 1-10 automatically
    const listingIdsToCheck = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white font-mono mb-2">Live Marketplace Listings</h3>
                    <p className="text-slate-400 font-mono text-sm">
                        Real-time data from BSC Testnet contract
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 font-mono">
                        BSC Testnet
                    </Badge>
                    <Button
                        onClick={scanForListings}
                        disabled={isScanning}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-400 hover:text-cyan-400 font-mono"
                    >
                        {isScanning ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Scanning...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Scan Status */}
            <Card className="bg-blue-900/20 border-blue-500/30">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Search className="w-5 h-5 text-blue-400" />
                            <div>
                                <p className="text-blue-400 font-mono font-bold">Contract Scan Status</p>
                                <p className="text-blue-300 font-mono text-sm">
                                    Checking listings 1-10 for valid data
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-400 font-mono text-lg font-bold">{listings.length}</p>
                            <p className="text-blue-300 font-mono text-xs">Found</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hidden fetchers for each listing ID */}
            {listingIdsToCheck.map(id => (
                <ListingFetcher key={id} listingId={id} />
            ))}

            {/* Error Display */}
            {error && (
                <Card className="bg-red-900/20 border-red-500/30">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <div>
                                <p className="text-red-400 font-mono font-bold">Scan Error</p>
                                <p className="text-red-300 font-mono text-sm">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Listings Grid */}
            {listings.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {listings.map((listing) => (
                        <RealListingCard
                            key={Number(listing.id)}
                            listing={listing}
                            onPurchase={onPurchase}
                        />
                    ))}
                </div>
            ) : (
                <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-12 text-center">
                        <Store className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white font-mono mb-2">No Listings Found</h3>
                        <p className="text-slate-400 font-mono mb-6">
                            No active listings found in the contract. Be the first to create one!
                        </p>
                        <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <Info className="w-5 h-5 text-amber-400 mt-0.5" />
                                <div className="text-left">
                                    <p className="text-amber-400 font-mono text-sm font-bold mb-1">
                                        How to see listings:
                                    </p>
                                    <ul className="text-amber-300 font-mono text-xs space-y-1">
                                        <li>• Go to the "Create" tab to make a new listing</li>
                                        <li>• Wait for transaction confirmation</li>
                                        <li>• Return here to see your listing appear</li>
                                        <li>• Contract scans IDs 1-10 automatically</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contract Info */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                    <CardTitle className="text-white font-mono text-lg">Contract Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-slate-400 font-mono text-sm mb-1">Contract Address:</p>
                            <p className="text-cyan-400 font-mono text-sm break-all">
                                {MARKETPLACE_CONTRACT_ADDRESS}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-mono text-sm mb-1">Network:</p>
                            <p className="text-white font-mono text-sm">BSC Testnet (Chain ID: 97)</p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-mono text-sm mb-1">Scan Range:</p>
                            <p className="text-white font-mono text-sm">Listing IDs 1-10</p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-mono text-sm mb-1">Update Method:</p>
                            <p className="text-white font-mono text-sm">Real-time contract queries</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
