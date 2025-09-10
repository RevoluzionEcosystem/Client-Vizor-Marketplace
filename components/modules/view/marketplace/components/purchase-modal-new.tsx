import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMarketplaceWrite } from '../hooks/use-marketplace-write';
import { toast } from 'sonner';
import { 
    ShoppingCart, 
    Shield, 
    Clock, 
    AlertTriangle, 
    CheckCircle2,
    Loader2,
    ExternalLink,
    Lock
} from 'lucide-react';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    listing: {
        id: number;
        price: string;
        tokenPair: string;
        seller: string;
        lockUrl: string;
        unlockDate: string;
    };
}

export function PurchaseModal({ isOpen, onClose, listing }: PurchaseModalProps) {
    const { address, isConnected } = useAppKitAccount();
    const { 
        purchaseListing, 
        isLoading, 
        isConfirming, 
        isConfirmed, 
        error: contractError,
        hash,
        clearError
    } = useMarketplaceWrite();

    const handlePurchase = async () => {
        if (!isConnected) {
            toast.error('Please connect your wallet');
            return;
        }

        try {
            await purchaseListing(listing.id, listing.price);
            
            if (!contractError) {
                toast.success('Purchase transaction submitted');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to purchase listing');
        }
    };

    React.useEffect(() => {
        if (isConfirmed) {
            toast.success('Purchase completed successfully!');
            onClose();
        }
    }, [isConfirmed, onClose]);

    if (isConfirmed) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-green-900/90 border-green-500/50 text-white max-w-md">
                    <div className="text-center py-6">
                        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-400 font-mono mb-2">
                            Purchase Successful!
                        </h3>
                        <p className="text-green-300 font-mono mb-4">
                            LP tokens are now in escrow. You have 24 hours to confirm receipt.
                        </p>
                        {hash && (
                            <a 
                                href={`https://testnet.bscscan.com/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                            >
                                <span>View Transaction</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-cyan-400 font-mono">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Purchase LP Position</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Listing Details */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-mono text-sm">Token Pair:</span>
                            <span className="text-white font-mono font-bold">{listing.tokenPair}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-mono text-sm">Price:</span>
                            <span className="text-cyan-400 font-mono font-bold">{listing.price} BNB</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-mono text-sm">Seller:</span>
                            <span className="text-white font-mono text-sm">
                                {listing.seller.slice(0, 8)}...{listing.seller.slice(-6)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-mono text-sm">Unlock Date:</span>
                            <span className="text-white font-mono text-sm">{listing.unlockDate}</span>
                        </div>
                    </div>

                    <Separator className="bg-slate-700" />

                    {/* Security Information */}
                    <div className="space-y-4">
                        <h4 className="text-white font-mono font-bold flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span>Escrow Protection</span>
                        </h4>
                        
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start space-x-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <Lock className="w-4 h-4 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-blue-400 font-mono font-bold">Secure Escrow</p>
                                    <p className="text-blue-300 font-mono text-xs">
                                        Your BNB is held in smart contract escrow until transfer is confirmed
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                                <Clock className="w-4 h-4 text-yellow-400 mt-0.5" />
                                <div>
                                    <p className="text-yellow-400 font-mono font-bold">24-Hour Window</p>
                                    <p className="text-yellow-300 font-mono text-xs">
                                        After seller submits transfer proof, you have 24 hours to confirm receipt
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                                <div>
                                    <p className="text-green-400 font-mono font-bold">Auto-Release</p>
                                    <p className="text-green-300 font-mono text-xs">
                                        Funds automatically release to seller if no dispute is raised
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-700" />

                    {/* Lock URL Verification */}
                    <div className="space-y-2">
                        <p className="text-slate-400 font-mono text-sm">Verify locked LP position:</p>
                        <a 
                            href={listing.lockUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                        >
                            <span>View Lock Details</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Error Display */}
                    {contractError && (
                        <div className="flex items-center space-x-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-mono text-sm">{contractError}</span>
                        </div>
                    )}

                    {/* Connection Status */}
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                            <span className="text-white font-mono text-sm">
                                {isConnected ? `Connected: ${address?.slice(0, 8)}...` : 'Wallet Not Connected'}
                            </span>
                        </div>
                        <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30 font-mono">
                            BSC Testnet
                        </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 font-mono"
                            disabled={isLoading || isConfirming}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePurchase}
                            disabled={!isConnected || isLoading || isConfirming}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-mono"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Purchasing...</span>
                                </div>
                            ) : isConfirming ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Confirming...</span>
                                </div>
                            ) : (
                                `Purchase for ${listing.price} BNB`
                            )}
                        </Button>
                    </div>

                    {/* Transaction Hash */}
                    {hash && (
                        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-400 font-mono text-sm mb-2">Transaction Submitted:</p>
                            <a 
                                href={`https://testnet.bscscan.com/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                            >
                                <span>{hash.slice(0, 20)}...</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
