import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppKitAccount } from '@reown/appkit/react';
import { useReadContract, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { marketplaceAbi, MARKETPLACE_CONTRACT_ADDRESS } from '../abi/marketplace-abi';
import { bscTestnet } from 'wagmi/chains';

export function DebugMarketplace() {
    const { address, isConnected } = useAppKitAccount();
    const chainId = useChainId();

    // Read contract data
    const { data: listingFee, error: feeError } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'listingFee',
    });

    const { data: isPaused, error: pausedError } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'paused',
    });

    const { data: owner, error: ownerError } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'owner',
    });

    const { data: currentListingId, error: listingIdError } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'getCurrentListingId',
    });

    return (
        <Card className="bg-slate-900/90 border-slate-700/50">
            <CardHeader>
                <CardTitle className="text-white font-mono">Marketplace Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Wallet Connection */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-cyan-400 font-mono text-sm mb-2">Wallet Status</h3>
                        <div className="space-y-1 text-xs font-mono">
                            <div>Connected: <Badge className={isConnected ? 'bg-green-600' : 'bg-red-600'}>{isConnected ? 'Yes' : 'No'}</Badge></div>
                            <div>Chain ID: <span className="text-white">{chainId || 'Unknown'}</span></div>
                            <div>Expected: <span className="text-white">{bscTestnet.id}</span></div>
                            <div>Address: <span className="text-white">{address ? `${address.slice(0, 10)}...` : 'None'}</span></div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-cyan-400 font-mono text-sm mb-2">Contract Info</h3>
                        <div className="space-y-1 text-xs font-mono">
                            <div>Contract: <span className="text-white">{MARKETPLACE_CONTRACT_ADDRESS.slice(0, 10)}...</span></div>
                            <div>Owner: <span className="text-white">{owner ? `${owner.slice(0, 10)}...` : 'Loading...'}</span></div>
                            {ownerError && <div className="text-red-400">Owner Error: {ownerError.message}</div>}
                        </div>
                    </div>
                </div>

                {/* Contract State */}
                <div className="space-y-2">
                    <h3 className="text-cyan-400 font-mono text-sm">Contract State</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                            <div>Paused: <Badge className={isPaused ? 'bg-red-600' : 'bg-green-600'}>{isPaused ? 'Yes' : 'No'}</Badge></div>
                            {pausedError && <div className="text-red-400">Pause Error: {pausedError.message}</div>}
                        </div>
                        <div>
                            <div>Listing Fee: <span className="text-white">{listingFee ? `${formatEther(listingFee)} BNB` : 'Loading...'}</span></div>
                            {feeError && <div className="text-red-400">Fee Error: {feeError.message}</div>}
                        </div>
                    </div>
                    <div>
                        <div>Current Listing ID: <span className="text-white">{currentListingId?.toString() || 'Loading...'}</span></div>
                        {listingIdError && <div className="text-red-400">ID Error: {listingIdError.message}</div>}
                    </div>
                </div>

                {/* Chain Verification */}
                <div className="space-y-2">
                    <h3 className="text-cyan-400 font-mono text-sm">Chain Verification</h3>
                    <div className="text-xs font-mono">
                        <div>Current Chain: <span className="text-white">{chainId}</span></div>
                        <div>Required Chain: <span className="text-white">{bscTestnet.id} (BSC Testnet)</span></div>
                        <div>Chain Match: <Badge className={chainId === bscTestnet.id ? 'bg-green-600' : 'bg-red-600'}>
                            {chainId === bscTestnet.id ? 'Correct' : 'Wrong Chain'}
                        </Badge></div>
                    </div>
                </div>

                {/* Common Issues */}
                <div className="space-y-2">
                    <h3 className="text-cyan-400 font-mono text-sm">Common Issues</h3>
                    <div className="text-xs font-mono space-y-1">
                        {!isConnected && <div className="text-red-400">❌ Wallet not connected</div>}
                        {chainId !== bscTestnet.id && <div className="text-red-400">❌ Wrong network</div>}
                        {isPaused && <div className="text-red-400">❌ Contract is paused</div>}
                        {!listingFee && <div className="text-yellow-400">⚠️ Cannot read listing fee</div>}
                        {isConnected && chainId === bscTestnet.id && !isPaused && listingFee && (
                            <div className="text-green-400">✅ All checks passed</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
