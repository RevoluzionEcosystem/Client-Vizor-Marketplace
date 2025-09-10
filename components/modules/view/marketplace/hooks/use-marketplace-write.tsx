import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { bscTestnet } from 'wagmi/chains';
import { marketplaceAbi, MARKETPLACE_CONTRACT_ADDRESS } from '../abi/marketplace-abi';
import { useState } from 'react';

export function useMarketplaceWrite() {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { writeContract, data: hash, isPending } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({ 
            hash,
        });

    const createListing = async (
        price: string,
        tokenAddress: string,
        lpAddress: string,
        lockUrl: string,
        contactMethod: string
    ) => {
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            await writeContract({
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: marketplaceAbi,
                functionName: 'createListing',
                args: [
                    parseEther(price),
                    [tokenAddress as `0x${string}`, lpAddress as `0x${string}`],
                    lockUrl,
                    contactMethod
                ],
                value: parseEther('0.01'), // Default listing fee (0.01 BNB)
                chain: bscTestnet,
                account: address
            });
        } catch (err: any) {
            setError(err.message || 'Failed to create listing');
            console.error('Error creating listing:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const purchaseListing = async (listingId: number, price: string) => {
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            await writeContract({
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: marketplaceAbi,
                functionName: 'purchaseListing',
                args: [BigInt(listingId)],
                value: parseEther(price),
                chain: bscTestnet,
                account: address
            });
        } catch (err: any) {
            setError(err.message || 'Failed to purchase listing');
            console.error('Error purchasing listing:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const submitTransferProof = async (listingId: number, txHash: string) => {
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            writeContract({
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: marketplaceAbi,
                functionName: 'submitTransferProof',
                args: [BigInt(listingId), txHash],
                chain: bscTestnet,
                account: address
            });
        } catch (err: any) {
            setError(err.message || 'Failed to submit transfer proof');
            console.error('Error submitting transfer proof:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmReceiptAndRelease = async (listingId: number) => {
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            writeContract({
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: marketplaceAbi,
                functionName: 'confirmReceiptAndRelease',
                args: [BigInt(listingId)],
                chain: bscTestnet,
                account: address
            });
        } catch (err: any) {
            setError(err.message || 'Failed to confirm receipt');
            console.error('Error confirming receipt:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const editPrice = async (listingId: number, newPrice: string) => {
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            writeContract({
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: marketplaceAbi,
                functionName: 'editPrice',
                args: [BigInt(listingId), parseEther(newPrice)],
                chain: bscTestnet,
                account: address
            });
        } catch (err: any) {
            setError(err.message || 'Failed to edit price');
            console.error('Error editing price:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelListing = async (listingId: number) => {
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            writeContract({
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: marketplaceAbi,
                functionName: 'cancelListing',
                args: [BigInt(listingId)],
                chain: bscTestnet,
                account: address
            });
        } catch (err: any) {
            setError(err.message || 'Failed to cancel listing');
            console.error('Error cancelling listing:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // State
        isLoading: isLoading || isPending,
        isConfirming,
        isConfirmed,
        error,
        hash,
        
        // Functions
        createListing,
        purchaseListing,
        submitTransferProof,
        confirmReceiptAndRelease,
        editPrice,
        cancelListing,
        
        // Utils
        clearError: () => setError(null)
    };
}
