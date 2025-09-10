import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMarketplaceWrite } from '../hooks/use-marketplace-write';
import { Plus, Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export function CreateListingForm() {
    const { address, isConnected } = useAppKitAccount();
    const { 
        createListing, 
        isLoading, 
        isConfirming, 
        isConfirmed, 
        error: contractError,
        hash,
        clearError
    } = useMarketplaceWrite();
    
    const [formData, setFormData] = useState({
        price: '',
        tokenAddress: '',
        lpAddress: '',
        lockUrl: '',
        contactMethod: '',
        tokenPair: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (contractError) clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isConnected) {
            toast.error("Please connect your wallet to create a listing");
            return;
        }

        // Basic validation
        if (!formData.price || !formData.tokenAddress || !formData.lpAddress || !formData.lockUrl || !formData.contactMethod) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            await createListing(
                formData.price,
                formData.tokenAddress,
                formData.lpAddress,
                formData.lockUrl,
                formData.contactMethod
            );

            if (!contractError) {
                toast.success("Your listing transaction has been submitted");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to create listing");
        }
    };

    // Reset form when transaction is confirmed
    React.useEffect(() => {
        if (isConfirmed) {
            setFormData({
                price: '',
                tokenAddress: '',
                lpAddress: '',
                lockUrl: '',
                contactMethod: '',
                tokenPair: ''
            });
            toast.success("Your LP position has been listed successfully!");
        }
    }, [isConfirmed, toast]);

    if (isConfirmed) {
        return (
            <Card className="bg-green-900/30 border-green-500/50 shadow-2xl shadow-green-500/20">
                <CardContent className="p-6 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4 drop-shadow-lg" />
                    <h3 className="text-xl font-bold text-green-300 font-mono mb-2">
                        Listing Created Successfully!
                    </h3>
                    <p className="text-green-200/80 font-mono mb-4">
                        Your LP position is now available for trading
                    </p>
                    {hash && (
                        <a 
                            href={`https://testnet.bscscan.com/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm mb-4 transition-colors"
                        >
                            <span>View Transaction</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                    <div className="mt-4">
                        <Button 
                            onClick={() => window.location.reload()}
                            className="bg-green-600 hover:bg-green-700 text-white font-mono shadow-lg shadow-green-500/25 border border-green-500/30"
                        >
                            Create Another Listing
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900/90 border-slate-700/50 shadow-2xl shadow-cyan-500/10">
            <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center space-x-3">
                    <Plus className="w-6 h-6 text-cyan-400 drop-shadow-sm" />
                    <CardTitle className="text-white font-mono text-xl">Create New Listing</CardTitle>
                </div>
                <p className="text-slate-400 font-mono text-sm">
                    List your locked LP tokens for sale to other traders
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Connection Status */}
                <div className="flex items-center justify-between p-4 bg-slate-800/60 border border-slate-700/50 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-cyan-400 shadow-cyan-400/50 shadow-sm' : 'bg-red-400 shadow-red-400/50 shadow-sm'}`} />
                        <span className="text-white font-mono text-sm">
                            {isConnected ? `Connected: ${address?.slice(0, 8)}...` : 'Wallet Not Connected'}
                        </span>
                    </div>
                    <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 font-mono shadow-sm">
                        BSC Testnet
                    </Badge>
                </div>

                {/* Error Display */}
                {contractError && (
                    <div className="flex items-center space-x-3 p-4 bg-red-900/30 border border-red-500/40 rounded-lg shadow-lg shadow-red-500/10">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-300 font-mono text-sm">{contractError}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">{/* ...existing code... */}
                    {/* Price */}
                    <div className="space-y-2">
                        <Label className="text-cyan-100 font-mono text-sm font-medium">Price (BNB) *</Label>
                        <Input
                            type="number"
                            step="0.001"
                            placeholder="1.5"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className="bg-slate-800/60 border-slate-600/60 text-white font-mono focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
                            disabled={isLoading || isConfirming}
                        />
                    </div>

                    {/* Token Pair */}
                    <div className="space-y-2">
                        <Label className="text-cyan-100 font-mono text-sm font-medium">Token Pair</Label>
                        <Input
                            placeholder="BNB/USDT"
                            value={formData.tokenPair}
                            onChange={(e) => handleInputChange('tokenPair', e.target.value)}
                            className="bg-slate-800/60 border-slate-600/60 text-white font-mono focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
                            disabled={isLoading || isConfirming}
                        />
                    </div>

                    {/* Token Address */}
                    <div className="space-y-2">
                        <Label className="text-cyan-100 font-mono text-sm font-medium">Token Address *</Label>
                        <Input
                            placeholder="0x..."
                            value={formData.tokenAddress}
                            onChange={(e) => handleInputChange('tokenAddress', e.target.value)}
                            className="bg-slate-800/60 border-slate-600/60 text-white font-mono focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
                            disabled={isLoading || isConfirming}
                        />
                    </div>

                    {/* LP Address */}
                    <div className="space-y-2">
                        <Label className="text-cyan-100 font-mono text-sm font-medium">LP Token Address *</Label>
                        <Input
                            placeholder="0x..."
                            value={formData.lpAddress}
                            onChange={(e) => handleInputChange('lpAddress', e.target.value)}
                            className="bg-slate-800/60 border-slate-600/60 text-white font-mono focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
                            disabled={isLoading || isConfirming}
                        />
                    </div>

                    {/* Lock URL */}
                    <div className="space-y-2">
                        <Label className="text-cyan-100 font-mono text-sm font-medium">Lock URL *</Label>
                        <Input
                            placeholder="https://app.uncx.network/services/pancakeswap-liquidity-locks/..."
                            value={formData.lockUrl}
                            onChange={(e) => handleInputChange('lockUrl', e.target.value)}
                            className="bg-slate-800/60 border-slate-600/60 text-white font-mono focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
                            disabled={isLoading || isConfirming}
                        />
                        <p className="text-slate-400 font-mono text-xs">
                            Link to your locked LP position on UNCX or similar platform
                        </p>
                    </div>

                    {/* Contact Method */}
                    <div className="space-y-2">
                        <Label className="text-cyan-100 font-mono text-sm font-medium">Contact Method *</Label>
                        <Input
                            type="text"
                            placeholder="e.g., Telegram: @username, Discord: username#1234, Email: contact@email.com"
                            value={formData.contactMethod}
                            onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                            className="bg-slate-800/60 border-slate-600/60 text-white font-mono focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
                            disabled={isLoading || isConfirming}
                        />
                        <p className="text-slate-400 font-mono text-xs">
                            How buyers can contact you to coordinate the LP token transfer
                        </p>
                    </div>

                    {/* Listing Fee Info */}
                    <div className="p-4 bg-blue-900/30 border border-cyan-500/40 rounded-lg shadow-lg shadow-cyan-500/10">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-cyan-400 drop-shadow-sm" />
                            <div>
                                <p className="text-cyan-300 font-mono text-sm font-bold">
                                    Listing Fee: 0.01 BNB
                                </p>
                                <p className="text-cyan-200/80 font-mono text-xs">
                                    One-time fee to create your listing on the marketplace
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!isConnected || isLoading || isConfirming}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-mono py-3 shadow-lg shadow-cyan-500/25 border border-cyan-500/30 transition-all duration-200"
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Creating Listing...</span>
                            </div>
                        ) : isConfirming ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Confirming Transaction...</span>
                            </div>
                        ) : (
                            'Create Listing'
                        )}
                    </Button>
                </form>

                {/* Transaction Hash */}
                {hash && (
                    <div className="p-4 bg-slate-800/60 border border-cyan-500/40 rounded-lg shadow-lg shadow-cyan-500/10">
                        <p className="text-cyan-300 font-mono text-sm mb-2 font-medium">Transaction Submitted:</p>
                        <a 
                            href={`https://testnet.bscscan.com/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors"
                        >
                            <span>{hash.slice(0, 20)}...</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
