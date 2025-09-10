import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContractInteraction } from './contract-interaction';
import { useMarketplaceListing, useConfirmationStatus } from '../hooks/use-real-analytics';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    DollarSign, 
    Clock, 
    Percent,
    Activity,
    Target,
    Award,
    Zap,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ExternalLink
} from 'lucide-react';

export function RealAnalyticsView() {
    // Test with a few listing IDs to see what exists
    const { listing: listing1, isLoading: loading1, exists: exists1 } = useMarketplaceListing(1);
    const { listing: listing2, isLoading: loading2, exists: exists2 } = useMarketplaceListing(2);
    const { listing: listing3, isLoading: loading3, exists: exists3 } = useMarketplaceListing(3);
    const { isExpired: isExpired1 } = useConfirmationStatus(1);

    const isLoading = loading1 || loading2 || loading3;
    const totalListings = [exists1, exists2, exists3].filter(Boolean).length;

    return (
        <div className="space-y-6">
            {/* Contract Testing Section */}
            <div>
                <h3 className="text-xl font-bold text-white font-mono mb-4">Contract Connection Test</h3>
                <ContractInteraction listingId={1} />
            </div>

            {/* Real Contract Data */}
            <div>
                <h3 className="text-xl font-bold text-white font-mono mb-4">Live Contract Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Contract Address</p>
                                    <p className="text-cyan-400 font-mono text-xs break-all">
                                        0xe36087316038f78A34530D6e418831198E5582Cf
                                    </p>
                                    <a 
                                        href="https://testnet.bscscan.com/address/0xe36087316038f78A34530D6e418831198E5582Cf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-mono text-xs mt-1"
                                    >
                                        <span>View on BSCScan</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Discovered Listings</p>
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                            <span className="text-cyan-400 font-mono">Scanning...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-2xl font-bold text-cyan-400 font-mono">{totalListings}</p>
                                            <p className="text-green-400 font-mono text-xs">From contract scan</p>
                                        </>
                                    )}
                                </div>
                                <BarChart3 className="w-8 h-8 text-cyan-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 font-mono text-sm">Network</p>
                                    <p className="text-2xl font-bold text-purple-400 font-mono">BSC</p>
                                    <p className="text-purple-400 font-mono text-xs">Testnet (Chain 97)</p>
                                </div>
                                <Award className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Listing Details */}
            {totalListings > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-white font-mono mb-4">Live Listing Data</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {exists1 && listing1 && (
                            <Card className="bg-slate-800/50 border-slate-700/50">
                                <CardHeader>
                                    <CardTitle className="text-white font-mono text-lg flex items-center space-x-2">
                                        <Target className="w-5 h-5 text-blue-400" />
                                        <span>Listing #1</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 font-mono text-sm">Seller:</span>
                                            <span className="text-white font-mono text-sm">
                                                {listing1.seller?.slice(0, 8)}...{listing1.seller?.slice(-6)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 font-mono text-sm">Price:</span>
                                            <span className="text-cyan-400 font-mono font-bold">
                                                {listing1.price ? (Number(listing1.price) / 1e18).toFixed(3) : '0'} BNB
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 font-mono text-sm">Status:</span>
                                            <Badge className={`font-mono text-xs ${
                                                listing1.status === 0 ? 'bg-green-400/20 text-green-400 border-green-400/30' :
                                                listing1.status === 1 ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' :
                                                'bg-blue-400/20 text-blue-400 border-blue-400/30'
                                            }`}>
                                                {listing1.status === 0 ? 'Available' :
                                                 listing1.status === 1 ? 'Sold' :
                                                 listing1.status === 2 ? 'In Escrow' :
                                                 listing1.status === 3 ? 'Completed' :
                                                 'Cancelled'}
                                            </Badge>
                                        </div>
                                        {listing1.status === 2 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-400 font-mono text-sm">Confirmation:</span>
                                                <Badge className={`font-mono text-xs ${
                                                    isExpired1 ? 'bg-red-400/20 text-red-400 border-red-400/30' :
                                                    'bg-green-400/20 text-green-400 border-green-400/30'
                                                }`}>
                                                    {isExpired1 ? 'Expired' : 'Active'}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Contract Functions Available */}
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader>
                                <CardTitle className="text-white font-mono text-lg flex items-center space-x-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    <span>Available Functions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-2 bg-green-900/20 border border-green-500/30 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 font-mono text-sm">createListing()</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-2 bg-green-900/20 border border-green-500/30 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 font-mono text-sm">purchaseListing()</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-2 bg-green-900/20 border border-green-500/30 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 font-mono text-sm">getListing()</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-2 bg-green-900/20 border border-green-500/30 rounded">
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 font-mono text-sm">confirmReceiptAndRelease()</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
                                        <Activity className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-400 font-mono text-sm">All functions operational</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Limitations Notice */}
            <Card className="bg-amber-900/20 border-amber-500/30">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-6 h-6 text-amber-400 mt-1" />
                        <div>
                            <h4 className="text-amber-400 font-mono font-bold mb-2">Analytics Limitations</h4>
                            <div className="space-y-2 text-amber-300 font-mono text-sm">
                                <p>• Contract doesn't have aggregated analytics functions</p>
                                <p>• Total volume requires querying blockchain events</p>
                                <p>• Historical data needs event indexing service</p>
                                <p>• Real-time stats limited to individual listing queries</p>
                            </div>
                            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                                <p className="text-blue-400 font-mono text-sm">
                                    💡 <strong>Recommendation:</strong> Implement The Graph protocol or similar indexing 
                                    service for comprehensive analytics and historical data.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mock Data Notice */}
            <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="p-6">
                    <h4 className="text-white font-mono font-bold mb-4">Development vs Production Analytics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h5 className="text-red-400 font-mono">❌ Current (Mock Data)</h5>
                            <ul className="text-slate-400 font-mono text-sm space-y-1">
                                <li>• Static volume numbers</li>
                                <li>• Fake trading pairs</li>
                                <li>• Simulated user activity</li>
                                <li>• No real-time updates</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-green-400 font-mono">✅ Needed (Real Analytics)</h5>
                            <ul className="text-slate-400 font-mono text-sm space-y-1">
                                <li>• Event-driven analytics</li>
                                <li>• Real transaction volume</li>
                                <li>• Live marketplace activity</li>
                                <li>• Historical trend data</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
