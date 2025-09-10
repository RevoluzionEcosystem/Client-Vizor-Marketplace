"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { 
    Check,
    X, 
    Search, 
    Star, 
    ChevronLeft
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { getNetworkName } from "@/lib/network-utils";
import { getNetworkIconPath, getTokenIconPath, IconImage } from "@/lib/icon-utils";
import { isValidAddress } from "@/lib/helpers";
import { useAccount } from "wagmi";
import { useTokens, getTokensByNetwork, getSupportedNetworks } from "./whitelist";
import { useTokenImage } from "../hooks/use-token-image";
import { useIsMobile } from "@/hooks/use-mobile";
import { addFavoriteToken, removeFavoriteToken, importToken } from "../utils/token-history-utils";

// Define Token interface
interface Token {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    image?: string;
    logoURI?: string;
    imgLink?: string;
    value?: string;
    balance?: string | null;
    chainId?: number;
    isPopular?: boolean;
    isPasted?: boolean;
    isFavorite?: boolean;
    network?: string;
}

// Token Image Component
const TokenImage = ({ token, network }: { token: Token, network: string }) => {
    const { logoUrl } = useTokenImage({
        address: token.address,
        symbol: token.symbol,
        network: network
    });

    // Get fallback image if API fails
    const fallbackImage = token.image || token.logoURI || token.imgLink || getTokenIconPath(token.symbol, token.address);

    return (
        <IconImage
            src={logoUrl || fallbackImage}
            alt={token.symbol}
            className="h-full w-full object-cover"
            fallbackSrc="/assets/tokens/default.svg"
            key={`token-${network}-${token.address}`}
        />
    );
};

// Network Image Component
const NetworkImage = ({ networkId }: { networkId: string }) => {
    return (
        <IconImage
            src={getNetworkIconPath(networkId)}
            alt={getNetworkName(networkId)}
            className="h-full w-full object-cover"
            fallbackSrc="/assets/networks/default.svg"
            key={`network-${networkId}`}
        />
    );
};

interface UnifiedTokenSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    currentNetwork: string;
    selectedTokenAddress?: string;
    onSelectNetworkAndToken: (network: string, token: Token) => void;
    title?: string;
    description?: string;
}

export default function UnifiedTokenSelector({
    isOpen,
    onClose,
    currentNetwork,
    selectedTokenAddress,
    onSelectNetworkAndToken,
}: UnifiedTokenSelectorProps) {
    // State management
    const [selectedNetwork, setSelectedNetwork] = useState<string>(currentNetwork);
    const [networkSearch, setNetworkSearch] = useState("");
    const [tokenSearch, setTokenSearch] = useState("");
    const [activeNetworkTab, setActiveNetworkTab] = useState("all");
    const [activeTokenTab, setActiveTokenTab] = useState("all");
    const [tokenList, setTokenList] = useState<Token[]>([]);
    const [favoriteTokens, setFavoriteTokens] = useState<Token[]>([]);    
    const [importedTokens, setImportedTokens] = useState<Token[]>([]);
    const [isTokenLoading, setIsTokenLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isValidatingToken, setIsValidatingToken] = useState(false);
    const [pastedTokenData, setPastedTokenData] = useState<Token | null>(null);
    
    // For mobile view - toggle between networks and tokens panels
    const [mobileView, setMobileView] = useState<'networks' | 'tokens'>('networks');
    
    // Check if on mobile device
    const isMobile = useIsMobile();

    // Always update selectedNetwork when currentNetwork changes
    useEffect(() => {
        setSelectedNetwork(currentNetwork);
    }, [currentNetwork]);

    // Get connected account
    const { address: walletAddress } = useAccount();
    
    // Get token data from whitelist
    const { tokens: rubicTokens, loading: rubicLoading, fetchNetworkTokens } = useTokens();
    
    // Networks
    const allNetworks = useMemo(() => getSupportedNetworks(), []);

    // Filter networks based on search
    const filteredNetworks = useMemo(() => {
        const searchLower = networkSearch.toLowerCase();
        return allNetworks.filter(network => {
            const networkName = getNetworkName(network.id).toLowerCase();
            return networkName.includes(searchLower) || network.id.includes(searchLower);
        });
    }, [allNetworks, networkSearch]);

    // Load favorite tokens from localStorage
    const loadFavoriteTokens = useCallback(() => {
        try {
            const storageKey = walletAddress
                ? `favorite-tokens-${walletAddress.toLowerCase()}`
                : 'favorite-tokens';

            const storedFavorites = localStorage.getItem(storageKey);
            return storedFavorites ? JSON.parse(storedFavorites) : [];
        } catch (error) {
            console.error("Error loading favorite tokens:", error);
            return [];
        }
    }, [walletAddress]);

    // Save favorite tokens to localStorage
    const saveFavoriteTokens = useCallback((favorites) => {
        try {
            const storageKey = walletAddress
                ? `favorite-tokens-${walletAddress.toLowerCase()}`
                : 'favorite-tokens';

            localStorage.setItem(storageKey, JSON.stringify(favorites));
        } catch (error) {
            console.error("Error saving favorite tokens:", error);
        }
    }, [walletAddress]);

    // Load imported tokens from localStorage
    const loadImportedTokens = useCallback(() => {
        try {
            const storageKey = walletAddress
                ? `imported-tokens-${walletAddress.toLowerCase()}`
                : 'imported-tokens';

            const storedTokens = localStorage.getItem(storageKey);
            return storedTokens ? JSON.parse(storedTokens) : [];
        } catch (error) {
            console.error("Error loading imported tokens:", error);
            return [];
        }
    }, [walletAddress]);

    // Save imported tokens to localStorage
    const saveImportedTokens = useCallback((tokens) => {
        try {
            const storageKey = walletAddress
                ? `imported-tokens-${walletAddress.toLowerCase()}`
                : 'imported-tokens';

            localStorage.setItem(storageKey, JSON.stringify(tokens));
        } catch (error) {
            console.error("Error saving imported tokens:", error);
        }
    }, [walletAddress]);

    // Effect to fetch tokens for selected network
    useEffect(() => {
        if (selectedNetwork && !rubicTokens[selectedNetwork.toLowerCase()] && !rubicLoading) {
            setIsTokenLoading(true);
            fetchNetworkTokens(selectedNetwork).finally(() => {
                setIsTokenLoading(false);
            });
        }
    }, [selectedNetwork, rubicTokens, fetchNetworkTokens, rubicLoading]);

    // Initialize token lists when network changes
    useEffect(() => {
        if (!selectedNetwork) return;

        setIsInitialized(true);
        setIsTokenLoading(true);

        // Get static tokens
        const staticNetworkTokens = getTokensByNetwork(selectedNetwork);

        // Try to get dynamic tokens from Rubic if available
        const dynamicNetworkTokens = rubicTokens[selectedNetwork.toLowerCase()] || [];

        // If we have dynamic tokens, use those with static as fallback
        // Otherwise just use static tokens
        const mergedTokens = dynamicNetworkTokens.length > 0
            ? dynamicNetworkTokens
            : staticNetworkTokens;

        // Load favorite tokens from local storage
        const storedFavorites = loadFavoriteTokens();

        // Load imported tokens from local storage
        const storedImported = loadImportedTokens();

        // Mark favorite tokens in the token list
        const tokensWithFavorites = mergedTokens.map(token => ({
            ...token,
            isFavorite: storedFavorites.some(
                fav => fav.address.toLowerCase() === token.address.toLowerCase() &&
                    fav.network && fav.network.toLowerCase() === selectedNetwork.toLowerCase()
            )
        }));

        // Set the token list
        setTokenList(tokensWithFavorites);

        // Set favorite tokens for this network
        setFavoriteTokens(
            storedFavorites.filter(
                token => token.network && token.network.toLowerCase() === selectedNetwork.toLowerCase()
            )
        );

        // Set imported tokens for this network
        setImportedTokens(
            storedImported.filter(
                token => token.network && token.network.toLowerCase() === selectedNetwork.toLowerCase()
            )
        );

        setIsTokenLoading(false);
    }, [selectedNetwork, rubicTokens, loadFavoriteTokens, loadImportedTokens]);    // Filter tokens based on search and active tab
    const filteredTokens = useMemo(() => {
        const searchTerm = tokenSearch.toLowerCase();

        let baseList: Token[] = [];

        switch (activeTokenTab) {
            case "favorites":
                baseList = favoriteTokens;
                break;
            case "imported":
                baseList = importedTokens;
                break;
            case "all":
            default:
                baseList = tokenList;
                break;
        }

        // If we have a pasted token that's not in the list and matches search, include it
        if (pastedTokenData && searchTerm && isValidAddress(searchTerm)) {
            const tokenExists = baseList.some(token => 
                token.address.toLowerCase() === pastedTokenData.address.toLowerCase()
            );
            if (!tokenExists) {
                baseList = [...baseList, pastedTokenData];
            }
        }

        if (!searchTerm) return baseList;

        return baseList.filter(token =>
            token.symbol.toLowerCase().includes(searchTerm) ||
            token.name.toLowerCase().includes(searchTerm) ||
            token.address.toLowerCase().includes(searchTerm)
        );
    }, [tokenList, favoriteTokens, importedTokens, activeTokenTab, tokenSearch, pastedTokenData]);// Toggle token favorite status
    const toggleFavorite = useCallback(async (token: Token) => {
        const updatedTokenList = tokenList.map(t => {
            if (t.address.toLowerCase() === token.address.toLowerCase()) {
                return { ...t, isFavorite: !t.isFavorite };
            }
            return t;
        });

        setTokenList(updatedTokenList);

        // Update favorites list
        const tokenWithNetwork = { ...token, network: selectedNetwork, isFavorite: !token.isFavorite };

        let updatedFavorites: Token[];
        if (tokenWithNetwork.isFavorite) {
            // Add to favorites
            updatedFavorites = [...favoriteTokens, tokenWithNetwork];
            setFavoriteTokens(updatedFavorites);

            // Save to cloud database
            if (walletAddress) {
                try {
                    await addFavoriteToken(walletAddress, {
                        network: selectedNetwork,
                        address: token.address,
                        symbol: token.symbol,
                        name: token.name,
                        decimals: token.decimals,
                        logoURI: token.image || token.logoURI || token.imgLink,
                        timestamp: Date.now()
                    });
                } catch (error) {
                    console.error("Error adding favorite token to cloud:", error);
                }
            }
        } else {
            // Remove from favorites
            updatedFavorites = favoriteTokens.filter(
                t => !(t.address.toLowerCase() === token.address.toLowerCase() &&
                    t.network && t.network.toLowerCase() === selectedNetwork.toLowerCase())
            );
            setFavoriteTokens(updatedFavorites);

            // Remove from cloud database
            if (walletAddress) {
                try {
                    await removeFavoriteToken(walletAddress, token.address, selectedNetwork);
                } catch (error) {
                    console.error("Error removing favorite token from cloud:", error);
                }
            }
        }

        // Update all favorites in local storage
        const allStoredFavorites = loadFavoriteTokens().filter(
            t => !(t.network && t.network.toLowerCase() === selectedNetwork.toLowerCase())
        );        saveFavoriteTokens([...allStoredFavorites, ...updatedFavorites]);
    }, [tokenList, favoriteTokens, selectedNetwork, loadFavoriteTokens, saveFavoriteTokens, walletAddress]);

    // Validate and fetch token data when address is pasted
    const validateTokenAddress = useCallback(async (address: string, network: string) => {
        if (!isValidAddress(address)) return null;

        setIsValidatingToken(true);
        try {
            // Call the validation API for the specific network
            const response = await fetch(`/crosschain-swap/api/validate/${network}?address=${address}`);
            
            if (!response.ok) {
                console.error(`Failed to validate token: ${response.status}`);
                return null;
            }

            const result = await response.json();
            
            if (result.success && result.token) {
                return {
                    address: result.token.address,
                    symbol: result.token.symbol,
                    name: result.token.name,
                    decimals: result.token.decimals,
                    logoURI: result.token.logoUrl,
                    network: network,
                    isPasted: true
                };
            }
            
            return null;
        } catch (error) {
            console.error("Error validating token:", error);
            return null;
        } finally {
            setIsValidatingToken(false);
        }
    }, []);

    // Handle token search input changes
    const handleTokenSearchChange = useCallback(async (value: string) => {
        setTokenSearch(value);
        
        // Clear previous pasted token data
        setPastedTokenData(null);
        
        // Check if the input looks like an address
        if (isValidAddress(value)) {
            const tokenData = await validateTokenAddress(value, selectedNetwork);
            if (tokenData) {
                setPastedTokenData(tokenData);
            }
        }
    }, [selectedNetwork, validateTokenAddress]);

    // Import a pasted token
    const handleImportToken = useCallback(async (token: Token) => {
        if (!walletAddress) {
            console.error("Wallet not connected");
            return;
        }

        try {
            // Add to imported tokens state
            const newImportedToken = { ...token, network: selectedNetwork };
            setImportedTokens(prev => [...prev, newImportedToken]);
            
            // Add to main token list
            setTokenList(prev => [...prev, newImportedToken]);

            // Save to database
            await importToken(walletAddress, {
                network: selectedNetwork,
                address: token.address,
                symbol: token.symbol,
                name: token.name,
                decimals: token.decimals,
                logoURI: token.logoURI,
                timestamp: Date.now()
            });

            // Clear search and pasted token data
            setTokenSearch("");
            setPastedTokenData(null);
            
            console.log("Token imported successfully");
        } catch (error) {
            console.error("Error importing token:", error);
        }
    }, [walletAddress, selectedNetwork]);    // When a network is selected, load tokens for that network
    // On mobile, automatically switch to tokens view
    const handleNetworkSelect = (networkId: string) => {
        setSelectedNetwork(networkId);
        setNetworkSearch("");
        setTokenSearch("");
        setPastedTokenData(null);
        setIsValidatingToken(false);
        
        // On mobile, switch to tokens view when a network is selected
        if (isMobile) {
            setMobileView('tokens');
        }
    };
    
    // Handle selecting a token
    const handleSelectToken = (token: Token) => {
        onSelectNetworkAndToken(selectedNetwork, token);
        onClose();
    };
      // Reset everything when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setNetworkSearch("");
                setTokenSearch("");
                setActiveNetworkTab("all");
                setActiveTokenTab("all");
                setPastedTokenData(null);
                setIsValidatingToken(false);
                // Reset mobile view to networks when dialog closes
                if (isMobile) {
                    setMobileView('networks');
                }
            }, 300);
        }
    }, [isOpen, isMobile]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`max-w-5xl max-h-[85vh] overflow-hidden bg-gradient-to-br from-black to-slate-950/30 border-slate-800 text-slate-300 p-0`}>
                <DialogHeader className="px-6 pt-4">
                    <DialogTitle className="text-slate-100 text-xl">
                        Select Chain and Token
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Choose from available tokens on your selected network
                    </DialogDescription>
                </DialogHeader>

                {/* Two-panel interface */}
                <div className={`flex ${isMobile ? "flex-col" : "h-[600px]"} overflow-hidden border-t border-slate-800 mt-2`}>
                    {/* Left panel - Network selection */}
                    {(!isMobile || mobileView === 'networks') && (
                        <div className={`border-r border-slate-800 flex flex-col ${isMobile ? "w-full" : "w-1/3"}`}>
                            <div className="px-4 py-3 border-b border-slate-800">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <Input
                                        placeholder="Search networks"
                                        value={networkSearch}
                                        onChange={(e) => setNetworkSearch(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 bg-slate-900 border-slate-700 focus:border-blue-600 focus-visible:ring-blue-600 text-slate-100 placeholder:text-slate-500"
                                    />
                                    {networkSearch && (
                                        <button
                                            onClick={() => setNetworkSearch("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Network filters */}
                            <div className="flex p-3 gap-1 flex-wrap">
                                <Button
                                    variant={activeNetworkTab === "all" ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => setActiveNetworkTab("all")}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={activeNetworkTab === "popular" ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => setActiveNetworkTab("popular")}
                                >
                                    Popular
                                </Button>
                                <Button
                                    variant={activeNetworkTab === "evm" ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => setActiveNetworkTab("evm")}
                                >
                                    EVM
                                </Button>
                                <Button
                                    variant={activeNetworkTab === "layer2" ? "default" : "outline"}
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => setActiveNetworkTab("layer2")}
                                >
                                    Layer-2
                                </Button>
                            </div>

                            {/* Networks list */}
                            <ScrollArea className="flex-1 px-3">
                                <div className="space-y-1 py-1">
                                    {filteredNetworks.map((network) => (
                                        <motion.div
                                            key={network.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className={`
                                                flex items-center p-2 rounded-lg cursor-pointer
                                                ${selectedNetwork === network.id ?
                                                    'bg-blue-600/20 border border-blue-500/40 text-blue-100' :
                                                    'hover:bg-slate-900/70 border border-transparent hover:border-slate-700 text-slate-300'
                                                }
                                            `}
                                            onClick={() => handleNetworkSelect(network.id)}
                                        >
                                            <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 mr-3 bg-slate-900 border border-slate-700">
                                                <NetworkImage networkId={network.id} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-base">{getNetworkName(network.id)}</div>
                                            </div>
                                            {selectedNetwork === network.id && (
                                                <Check className="h-4 w-4 text-blue-400" />
                                            )}
                                        </motion.div>
                                    ))}

                                    {filteredNetworks.length === 0 && (
                                        <div className="text-center py-8 text-slate-400">
                                            No networks found matching "{networkSearch}"
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    {/* Right panel - Token selection */}
                    {(!isMobile || mobileView === 'tokens') && (
                        <div className={`flex flex-col ${isMobile ? "w-full" : "w-2/3"}`}>
                            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
                                {isMobile && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mr-2"
                                        onClick={() => setMobileView('networks')}
                                    >
                                        <ChevronLeft className="h-5 w-5 text-slate-400" />
                                    </Button>
                                )}
                                <div className="flex items-center">
                                    <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 mr-2 bg-slate-900 border border-slate-700">
                                        <NetworkImage networkId={selectedNetwork} />
                                    </div>
                                    <span className="text-slate-200 font-medium">{getNetworkName(selectedNetwork)}</span>
                                </div>

                                <Tabs defaultValue="all" className="w-auto">
                                    <TabsList className="bg-slate-900">
                                        <TabsTrigger
                                            value="all"
                                            className="text-xs"
                                            onClick={() => setActiveTokenTab("all")}
                                        >
                                            All
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="favorites"
                                            className="text-xs"
                                            onClick={() => setActiveTokenTab("favorites")}
                                        >
                                            Favorites
                                            {favoriteTokens.length > 0 && (
                                                <Badge className="ml-1 bg-blue-900/60 text-blue-200 text-[10px] px-1">{favoriteTokens.length}</Badge>
                                            )}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="imported"
                                            className="text-xs"
                                            onClick={() => setActiveTokenTab("imported")}
                                        >
                                            Imported
                                            {importedTokens.length > 0 && (
                                                <Badge className="ml-1 bg-purple-900/60 text-purple-200 text-[10px] px-1">{importedTokens.length}</Badge>
                                            )}
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Token search */}
                            <div className="px-6 py-3 border-b border-slate-800">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <Input
                                        placeholder="Search name or paste address"
                                        value={tokenSearch}
                                        onChange={(e) => handleTokenSearchChange(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 bg-slate-900 border-slate-700 focus:border-blue-600 focus-visible:ring-blue-600 text-slate-100 placeholder:text-slate-500"
                                    />
                                    {tokenSearch && (
                                        <button
                                            onClick={() => setTokenSearch("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Token validation loading */}
                            {isValidatingToken && (
                                <div className="flex items-center justify-center py-3 px-6 border-b border-slate-800">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                    <span className="text-sm text-slate-400">Validating token...</span>
                                </div>
                            )}

                            {/* Pasted token import option */}
                            {pastedTokenData && !isValidatingToken && (
                                <div className="px-6 py-3 border-b border-slate-800">
                                    <div className="border border-blue-500/40 bg-blue-600/10 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mr-3 bg-slate-800 border border-slate-700">
                                                    <TokenImage token={pastedTokenData} network={selectedNetwork} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-200">{pastedTokenData.symbol}</div>
                                                    <div className="text-xs text-slate-400">{pastedTokenData.name}</div>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleImportToken(pastedTokenData)}
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                Import
                                            </Button>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            Token found on {getNetworkName(selectedNetwork)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Token list */}
                            {isTokenLoading ? (
                                <div className="flex flex-col items-center justify-center py-10 flex-1">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                                    <p className="text-slate-400 text-center">Loading tokens...</p>
                                </div>
                            ) : (
                                <ScrollArea className="flex-1">
                                    <div className="px-3 py-1">
                                        {filteredTokens.map((token) => (
                                            <motion.div
                                                key={token.address}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.1 }}
                                                className={`
                                                    flex items-center justify-between p-2 my-1 rounded-lg border 
                                                    ${selectedTokenAddress === token.address
                                                        ? 'bg-blue-600/20 border-blue-500/40 text-blue-50'
                                                        : 'border-slate-700 hover:border-slate-600 hover:bg-slate-900/60'
                                                    }
                                                    cursor-pointer
                                                `}
                                                onClick={() => handleSelectToken(token)}
                                            >
                                                <div className="flex items-center">
                                                    <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0 mr-3 bg-slate-900 border border-slate-700">
                                                        <TokenImage token={token} network={selectedNetwork} />
                                                    </div>

                                                    <div>
                                                        <div className="font-medium text-slate-200">{token.symbol}</div>
                                                        <div className="text-xs text-slate-400">{token.name}</div>
                                                    </div>

                                                    {token.balance && parseFloat(token.balance) > 0 && (
                                                        <Badge className="ml-2 bg-slate-900 text-slate-300 border-slate-700">
                                                            {parseFloat(token.balance).toFixed(4)}
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="flex items-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className={`h-6 w-6 rounded-full p-1 mr-1 ${token.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleFavorite(token);
                                                                    }}
                                                                >
                                                                    <Star className="h-4 w-4" fill={token.isFavorite ? "currentColor" : "none"} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="left">
                                                                <p>{token.isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    {selectedTokenAddress === token.address && (
                                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {filteredTokens.length === 0 && (
                                            <div className="text-center py-8 text-slate-400">
                                                {activeTokenTab === "all" && !tokenSearch
                                                    ? `No tokens available on ${getNetworkName(selectedNetwork)}`
                                                    : `No tokens found${tokenSearch ? ` matching "${tokenSearch}"` : ""}`}
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
