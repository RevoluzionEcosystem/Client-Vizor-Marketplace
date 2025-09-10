import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppKitAccount } from '@reown/appkit/react';
import { DollarSign, Loader2, CheckCircle2, AlertCircle, ExternalLink, Shield, Clock } from 'lucide-react';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    listing: any;
}

export function PurchaseModal({ isOpen, onClose, listing }: PurchaseModalProps) {
    const { address, isConnected } = useAppKitAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePurchase = async () => {
        if (!isConnected) {
            setError('Please connect your wallet');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Simulate transaction for now - replace with actual contract call
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            setSuccess(true);
            
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 3000);
            
        } catch (err: any) {
            setError(err.message || 'Failed to purchase listing');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-green-900/90 border-green-500/50 text-white">
                    <div className="text-center p-6">
                        <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-400 font-mono mb-2">
                            Purchase Successful!
                        </h3>
                        <p className="text-green-300 font-mono mb-4">
                            Your funds are now in escrow. The seller will transfer the LP position.
                        </p>
                        <Badge className="bg-green-600 text-white font-mono">
                            Status: In Escrow
                        </Badge>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900/95 border-slate-700 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-white font-mono text-xl flex items-center space-x-2">
                        <DollarSign className="w-6 h-6 text-cyan-400" />
                        <span>Purchase LP Position</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Listing Details */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-cyan-400 font-mono font-bold mb-3">{listing.tokenPair} LP Position</h4>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-400 font-mono">Price</p>
                                <p className="text-white font-mono font-bold">{listing.price} BNB</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-mono">Seller</p>
                                <p className="text-white font-mono">{listing.seller}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-mono">Unlock Date</p>
                                <p className="text-white font-mono">{listing.unlockDate}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 font-mono">Days Left</p>
                                <p className="text-orange-400 font-mono">{listing.daysLeft} days</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 font-mono text-xs"
                                onClick={() => window.open(listing.lockUrl, '_blank')}
                            >
                                <ExternalLink className="w-3 h-3 mr-2" />
                                Verify Lock
                            </Button>
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <h4 className="text-blue-400 font-mono font-bold">Secure Escrow Process</h4>
                        </div>
                        <div className="space-y-2 text-sm text-slate-300 font-mono">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Your payment is held in smart contract escrow</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Seller transfers LP ownership to you</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>You confirm receipt and release payment</span>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Window */}
                    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-5 h-5 text-orange-400" />
                            <h4 className="text-orange-400 font-mono font-bold">24 Hour Confirmation Window</h4>
                        </div>
                        <p className="text-slate-300 text-sm font-mono">
                            After the seller submits transfer proof, you have 24 hours to confirm receipt.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <p className="text-red-400 font-mono text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 font-mono"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePurchase}
                            disabled={!isConnected || isLoading}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono font-bold"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Buy for {listing.price} BNB
                                </>
                            )}
                        </Button>
                    </div>

                    {!isConnected && (
                        <p className="text-center text-slate-400 font-mono text-sm">
                            Connect your wallet to purchase
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
