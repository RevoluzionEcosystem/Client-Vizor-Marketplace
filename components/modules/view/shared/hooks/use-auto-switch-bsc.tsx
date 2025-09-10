"use client";

import { useEffect, useRef } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { toast } from 'sonner';

/**
 * A hook that automatically switches to BSC network when a page loads
 * if the user has a connected wallet but is on a different network
 */
export function useAutoSwitchBsc() {
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const hasAutoSwitched = useRef(false);

    useEffect(() => {
        // Only auto-switch once per page load
        if (hasAutoSwitched.current) return;

        // Only proceed if wallet is connected
        if (!isConnected) return;

        // Only proceed if not already on BSC
        if (chainId === bsc.id) return;

        // Only proceed if switchChain is available
        if (!switchChain) return;

        const performAutoSwitch = async () => {
            try {
                console.log('Auto-switching to BSC network...');
                toast.info('Switching to Binance Smart Chain...', {
                    duration: 2000,
                });

                await switchChain({ chainId: bsc.id });

                // Mark as completed to prevent re-switching
                hasAutoSwitched.current = true;

                toast.success('Successfully switched to BSC network', {
                    duration: 3000,
                });
            } catch (error) {
                console.error('Auto-switch to BSC failed:', error);
                // Don't show error toast for auto-switch failures to avoid being intrusive
                // Users can still manually switch if needed
            }
        };

        // Add a small delay to ensure wallet state is fully loaded
        const timer = setTimeout(performAutoSwitch, 1000);

        return () => clearTimeout(timer);
    }, [isConnected, chainId, switchChain]);

    return {
        isBscNetwork: chainId === bsc.id,
        hasAutoSwitched: hasAutoSwitched.current
    };
}
