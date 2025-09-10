"use client";

import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of the RubicSDK context
export interface RubicSDKContextType {
    sdkInstance: any;
    isInitialized: boolean;
    error: string | null;
    calculateOnChainTrade: (fromBlockchain: any, fromTokenAddress: string, toTokenAddress: string, amount: string) => Promise<any>;
    calculateCrossChainTrade: (fromBlockchain: any, toBlockchain: any, fromTokenAddress: string, toTokenAddress: string, amount: string) => Promise<any>;
    executeSwap: (trade: any, options?: any) => Promise<any>;
    updateWalletProvider: (walletProvider: any) => void;
    connectWalletToSDK: (chainType: any, address: string) => void;
    BLOCKCHAIN_NAME: any;
    CHAIN_TYPE: any;
    getChainId: (blockchainName: string) => number;
}

// Create the context with default values
const RubicSDKContext = createContext<RubicSDKContextType>({
    sdkInstance: null,
    isInitialized: false,
    error: null,
    calculateOnChainTrade: async () => [],
    calculateCrossChainTrade: async () => [],
    executeSwap: async () => ({}),
    updateWalletProvider: () => { },
    connectWalletToSDK: () => { },
    BLOCKCHAIN_NAME: {},
    CHAIN_TYPE: {},
    getChainId: () => 1,
});

// Provider component that wraps parts of the app that need the context
interface RubicSDKProviderProps {
    children: ReactNode;
    sdkContext: RubicSDKContextType;
}

export const RubicSDKProvider = ({ children, sdkContext }: RubicSDKProviderProps) => {
    return (
        <RubicSDKContext.Provider value={sdkContext}>
            {children}
        </RubicSDKContext.Provider>
    );
};

// Custom hook to use the context
export const useRubicSDK = () => {
    const context = useContext(RubicSDKContext);
    if (!context) {
        throw new Error('useRubicSDK must be used within a RubicSDKProvider');
    }
    return context;
};