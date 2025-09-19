import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { bscTestnet } from 'wagmi/chains';
import { marketplaceAbi, MARKETPLACE_CONTRACT_ADDRESS } from '../abi/marketplace-abi';
import { useState } from 'react';

export function useMarketplaceWrite() {
    const { address } = useAccount();
    const chainId = useChainId();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { writeContract, data: hash, isPending } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({ 
            hash,
        });

    // Read the current listing fee from the contract
    const { data: listingFeeData, error: listingFeeError } = useReadContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'listingFee',
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

        // Check if we're on BSC Testnet
        if (chainId !== bscTestnet.id) {
            setError(`Please switch to BSC Testnet (Chain ID: ${bscTestnet.id}). Current chain: ${chainId}`);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            // Use the actual listing fee from the contract, fallback to 0.01 BNB if not available
            const listingFeeValue = listingFeeData || parseEther('0.01');
            
            console.log('🔍 Creating listing with parameters:');
            console.log('  - Price (original):', price);
            console.log('  - Price (parsed):', parseEther(price).toString());
            console.log('  - Token Address:', tokenAddress);
            console.log('  - LP Address:', lpAddress);
            console.log('  - Lock URL:', lockUrl);
            console.log('  - Contact Method:', contactMethod);
            console.log('  - Listing Fee:', listingFeeValue.toString());
            console.log('  - User Address:', address);
            
            // Validate inputs before sending
            if (!price || parseFloat(price) <= 0) {
                throw new Error('Price must be greater than 0');
            }
            
            if (!tokenAddress || tokenAddress.length !== 42 || !tokenAddress.startsWith('0x') || !/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
                throw new Error(`Invalid token address: ${tokenAddress}. Must be a valid Ethereum address.`);
            }
            
            if (!lpAddress || lpAddress.length !== 42 || !lpAddress.startsWith('0x') || !/^0x[a-fA-F0-9]{40}$/.test(lpAddress)) {
                throw new Error(`Invalid LP token address: ${lpAddress}. Must be a valid Ethereum address.`);
            }
            
            // Validate URL format
            try {
                new URL(lockUrl);
                if (!lockUrl.includes('.') || lockUrl.length < 8) {
                    throw new Error('URL appears to be incomplete');
                }
            } catch {
                throw new Error(`Invalid lock URL: ${lockUrl}. Must be a valid URL.`);
            }
            
            if (!contactMethod || contactMethod.trim().length < 5) {
                throw new Error(`Contact method too short: ${contactMethod}. Must be at least 5 characters.`);
            }
            
            console.log('✅ All validations passed, submitting transaction...');
            
            console.log('🚀 Calling writeContract directly...');
            
            const result = await writeContract({
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: marketplaceAbi,
                functionName: 'createListing',
                args: [
                    parseEther(price),
                    [tokenAddress as `0x${string}`, lpAddress as `0x${string}`] as const,
                    lockUrl,
                    contactMethod
                ] as const,
                value: listingFeeValue,
                chain: bscTestnet,
                account: address
            });
            
            console.log('📤 WriteContract result:', result);
            console.log('🎉 Transaction submitted successfully!');
        } catch (err: any) {
            console.error('❌ CreateListing failed:', err);
            console.error('❌ Error details:', {
                message: err.message,
                code: err.code,
                reason: err.reason,
                data: err.data,
                stack: err.stack
            });
            
            let errorMessage = 'Failed to create listing';
            
            if (err.message?.includes('User rejected')) {
                errorMessage = 'Transaction was cancelled by user';
            } else if (err.message?.includes('insufficient funds')) {
                errorMessage = 'Insufficient funds for transaction fee';
            } else if (err.message?.includes('network')) {
                errorMessage = 'Network error - please check your connection';
            } else if (err.message?.includes('gas')) {
                errorMessage = 'Transaction failed due to gas issues';
            } else if (err.message?.includes('Incorrect listing fee')) {
                errorMessage = 'Incorrect listing fee amount';
            } else if (err.message?.includes('Invalid address')) {
                errorMessage = 'One or more addresses are invalid';
            } else if (err.message?.includes('Price must be greater than 0')) {
                errorMessage = 'Price must be greater than 0';
            } else if (err.message?.includes('String cannot be empty')) {
                errorMessage = 'All fields must be filled';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            console.error('❌ Final error message:', errorMessage);
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
            let errorMessage = 'Failed to purchase listing';
            
            if (err.message?.includes('User rejected')) {
                errorMessage = 'Transaction was cancelled by user';
            } else if (err.message?.includes('insufficient funds')) {
                errorMessage = 'Insufficient funds for purchase';
            } else if (err.message?.includes('network')) {
                errorMessage = 'Network error - please check your connection';
            } else if (err.message?.includes('gas')) {
                errorMessage = 'Transaction failed due to gas issues';
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
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
        isPending, // Add isPending for debugging
        
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
