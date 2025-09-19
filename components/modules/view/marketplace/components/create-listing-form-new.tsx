import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { useMarketplaceWrite } from '../hooks/use-marketplace-write';
import { Plus, Loader2, CheckCircle2, AlertCircle, ExternalLink, Wallet } from 'lucide-react';

export function CreateListingForm() {
    const { address, isConnected } = useAppKitAccount();
    const { open } = useAppKit();
    const { 
        createListing, 
        isLoading, 
        isConfirming, 
        isConfirmed, 
        error: contractError,
        hash,
        isPending,
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
        console.log('🔄 Form submission started');
        console.log('📝 Form data:', formData);
        console.log('🔗 Connected:', isConnected);
        console.log('⚡ Loading states:', { isLoading, isConfirming, isConfirmed });
        
        if (!isConnected) {
            console.log('❌ Wallet not connected');
            toast.error("Please connect your wallet to create a listing");
            return;
        }

        // Enhanced validation
        if (!formData.price || !formData.tokenAddress || !formData.lpAddress || !formData.lockUrl || !formData.contactMethod) {
            console.log('❌ Missing required fields');
            toast.error("Please fill in all required fields");
            return;
        }

        // Validate price
        if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            console.log('❌ Invalid price:', formData.price);
            toast.error("Please enter a valid price greater than 0");
            return;
        }

        // Validate addresses (basic check for 0x prefix and length)
        if (!formData.tokenAddress.startsWith('0x') || formData.tokenAddress.length !== 42) {
            console.log('❌ Invalid token address:', formData.tokenAddress);
            toast.error("Please enter a valid token address");
            return;
        }

        if (!formData.lpAddress.startsWith('0x') || formData.lpAddress.length !== 42) {
            console.log('❌ Invalid LP address:', formData.lpAddress);
            toast.error("Please enter a valid LP token address");
            return;
        }

        // Validate URL format
        try {
            new URL(formData.lockUrl);
        } catch {
            console.log('❌ Invalid URL:', formData.lockUrl);
            toast.error("Please enter a valid lock URL");
            return;
        }

        console.log('✅ All validations passed, calling createListing...');
        try {
            await createListing(
                formData.price,
                formData.tokenAddress,
                formData.lpAddress,
                formData.lockUrl,
                formData.contactMethod
            );

            // Don't show success toast here - let the transaction state handle it
        } catch (err: any) {
            // Error is already handled in the hook, but we can add additional handling if needed
            console.error('Create listing error:', err);
        }
    };

    // Show success toast when transaction is submitted (hash available)
    React.useEffect(() => {
        if (hash && !isConfirming && !isConfirmed) {
            toast.success("Your listing transaction has been submitted!", {
                description: "Please wait for confirmation..."
            });
        }
    }, [hash, isConfirming, isConfirmed]);

    // Show error toast when there's a contract error
    React.useEffect(() => {
        if (contractError) {
            toast.error("Failed to create listing", {
                description: contractError
            });
        }
    }, [contractError]);

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
        <div className="relative">
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
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-mono py-3 shadow-lg shadow-cyan-500/25 border border-cyan-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

                    {/* Debug Info for Button State */}
                    <div className="text-xs font-mono text-slate-500 mt-2">
                        Button disabled: {(!isConnected || isLoading || isConfirming).toString()} | 
                        Connected: {isConnected.toString()} | 
                        Loading: {isLoading.toString()} | 
                        Pending: {isPending.toString()} | 
                        Confirming: {isConfirming.toString()}
                    </div>

                    {/* Debug Test Button */}
                    <Button
                        type="button"
                        onClick={() => {
                            console.log('🔍 DEBUG INFO:');
                            console.log('  Form Data:', formData);
                            console.log('  Connected:', isConnected);
                            console.log('  Address:', address);
                            console.log('  Loading States:', { isLoading, isPending, isConfirming, isConfirmed });
                            console.log('  Contract Error:', contractError);
                            console.log('  Hash:', hash);
                            
                            // Test createListing with sample data
                            const testData = {
                                price: '1.0',
                                tokenAddress: '0x1234567890123456789012345678901234567890',
                                lpAddress: '0x0987654321098765432109876543210987654321',
                                lockUrl: 'https://unicrypt.network/amm/pancake-v2/pair/0x123',
                                contactMethod: 'telegram: @test'
                            };
                            console.log('  Test Data:', testData);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-mono py-2 text-sm"
                    >
                        🔍 Debug Info
                    </Button>

                    {/* Test with Valid Data Button */}
                    <Button
                        type="button"
                        onClick={async () => {
                            if (!isConnected) {
                                toast.error('Please connect your wallet first');
                                return;
                            }
                            
                            console.log('🧪 Testing with valid data...');
                            try {
                                await createListing(
                                    '1.0', // Valid price
                                    '0x55d398326f99059fF775485246999027B3197955', // USDT BSC address (valid)
                                    '0x16b9a82891338f9bA80E2D6970FddA79D1eb0daE', // Random valid LP address
                                    'https://www.unicrypt.network/amm/pancake-v2/pair/0x123456789', // Valid URL
                                    'Telegram: @testuser123' // Valid contact
                                );
                            } catch (err: any) {
                                console.error('❌ Test failed:', err);
                                toast.error(`Test failed: ${err.message}`);
                            }
                        }}
                        disabled={!isConnected || isLoading || isConfirming}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-mono py-2 text-sm disabled:opacity-50"
                    >
                        🧪 Test with Valid Data
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

        {/* Wallet Connection Overlay */}
        {!isConnected && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center p-8 bg-slate-900/90 border border-slate-700/50 rounded-xl shadow-2xl shadow-cyan-500/10 max-w-md mx-4">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h3 className="text-white font-mono text-xl font-bold mb-2">
                            Connect Your Wallet
                        </h3>
                        <p className="text-slate-400 font-mono text-sm">
                            You need to connect your wallet to create a listing on the marketplace
                        </p>
                    </div>
                    <Button
                        onClick={() => open()}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-mono py-3 shadow-lg shadow-cyan-500/25 border border-cyan-500/30 transition-all duration-200"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                    </Button>
                </div>
            </div>
        )}
    </div>
    );
}
