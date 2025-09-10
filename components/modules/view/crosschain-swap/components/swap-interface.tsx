"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
    ArrowDownUp,
    Info,
    AlertCircle,
    ChevronDown,
    Settings,
    ArrowRight,
    RefreshCcw,
    Loader2,
    CheckCircle2,
    Lock,
    RefreshCw,
    ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ConnectButtonSwap } from "@/components/modules/wallet/button/connect-button-swap";
import { useAccount, useSwitchChain, useBalance } from "wagmi";
import { toast } from "sonner";
import BigNumber from "bignumber.js";

import TradeRoute from "./trade-route";
import TransactionSuccess from "./transaction-success";
import ActionButtons from "./action-buttons";
import WalletHistoryPanel from "./wallet-history-panel";
import GuideDialog from "./guide-dialog";
import UnifiedTokenSelector from "./unified-token-selector";
import SwapProgressModal from "./swap-progress-modal";

import { getTokensByNetwork } from "./whitelist";
import { getNetworkName } from "@/lib/network-utils";
import { getNetworkIconPath, getTokenIconPath, IconImage } from "@/lib/icon-utils";
import { useRubicSDK } from "./rubic-sdk-context";
import { Transaction, saveTransaction, getExplorerUrl } from "../utils/transaction-history";
import { useTokenPrice } from "../hooks/use-token-price";
import { formatTokenPrice, nFormatter } from "@/lib/helpers";
import { BlockchainName } from "../hooks/blockchain-names";
import { useTokenImage } from "../hooks/use-token-image";
import { formatTokenAmount, formatUsdPrice, formatGasPrice, formatPercentage, formatRatio, extractGasPrice } from '../utils/format-utils';
import { useIsMobile } from "@/hooks/use-mobile";

// Map network codes to Rubic blockchain names
const networkToBlockchainMap = {
    'eth': 'ETHEREUM',
    'polygon': 'POLYGON',
    'matic': 'POLYGON',
    'bsc': 'BINANCE_SMART_CHAIN',
    'arbitrum': 'ARBITRUM',
    'optimism': 'OPTIMISM',
    'avalanche': 'AVALANCHE',
    'base': 'BASE',
    'linea': 'LINEA',
    'scroll': 'SCROLL',
    'zksync': 'ZKSYNC',
    'fantom': 'FANTOM',
    'polygon_zkevm': 'POLYGON_ZKEVM',
    'polygon-zkevm': 'POLYGON_ZKEVM',
    'rootstock': 'ROOTSTOCK',
    'fuse': 'FUSE',
    'blast': 'BLAST',
    'kroma': 'KROMA',
    'horizen_eon': 'HORIZEN_EON',
    'horizen-eon': 'HORIZEN_EON',
    'mode': 'MODE',
    'zk_fair': 'ZK_FAIR',
    'zkfair': 'ZK_FAIR',
    'taiko': 'TAIKO',
    'metis': 'METIS',
    'klaytn': 'KLAYTN',
    'velas': 'VELAS',
    'syscoin': 'SYSCOIN',
    'aurora': 'AURORA',
    'celo': 'CELO',
    'boba': 'BOBA',
    'kava': 'KAVA',
    'oasis': 'OASIS',
    'gnosis': 'GNOSIS',
    'moonbeam': 'MOONBEAM',
    'moonriver': 'MOONRIVER',
    'harmony': 'HARMONY',
    'telos': 'TELOS',
    'cronos': 'CRONOS',
    'astar': 'ASTAR_EVM',
    'astar_evm': 'ASTAR_EVM',
    'zetachain': 'ZETACHAIN',
    'tron': 'TRON',
    'manta': 'MANTA_PACIFIC',
    'manta_pacific': 'MANTA_PACIFIC'
};

export default function SwapInterface() {
    // Get Rubic SDK context
    const rubicSDK = useRubicSDK();

    // Check if on mobile device
    const isMobile = useIsMobile();

    // Get account from wagmi
    const { address, isConnected, chainId } = useAccount();
    // Use switchChain from wagmi
    const { switchChain } = useSwitchChain();

    // Network and token state
    const [fromNetwork, setFromNetwork] = useState("select network");
    const [toNetwork, setToNetwork] = useState("select network");
    const [fromToken, setFromToken] = useState({
        address: "",
        symbol: "Select token",
        image: null,
        value: "",
        balance: null,
    });
    const [toToken, setToToken] = useState({
        address: "",
        symbol: "Select token",
        image: null,
        value: "",
        balance: null,
    });    // State for unified token/network selection UI
    const [isFromSelectorOpen, setIsFromSelectorOpen] = useState(false);
    const [isToSelectorOpen, setIsToSelectorOpen] = useState(false);    // Handle from token+network selection
    const handleFromNetworkTokenSelect = (network: string, token: any) => {
        // Update network first
        if (fromNetwork !== network) {
            setFromNetwork(network);
            // Reset swap calculation when network changes
            setBestTrade(null);
            setTrades([]);
            setToAmount("");
            setRouteProviders([]);
            setQuoteError(null);
            setSelectedProvider(null);
            setNeedsApproval(false);
            setInsufficientFundsError("");
        }

        // Update token
        setFromToken({
            address: token.address,
            symbol: token.symbol,
            image: token.image || token.logoURI || null,
            value: fromToken.value, // Keep the current value
            balance: null, // Will be updated by balance fetching effect
        });
    };

    // Handle to token+network selection
    const handleToNetworkTokenSelect = (network: string, token: any) => {
        // Update network first
        if (toNetwork !== network) {
            setToNetwork(network);
            // Reset swap calculation when network changes
            setBestTrade(null);
            setTrades([]);
            setToAmount("");
            setRouteProviders([]);
            setQuoteError(null);
            setSelectedProvider(null);
            setNeedsApproval(false);
            setInsufficientFundsError("");
        }

        // Update token
        setToToken({
            address: token.address,
            symbol: token.symbol,
            image: token.image || token.logoURI || null,
            value: toToken.value, // Keep the current value
            balance: null, // Will be updated by balance fetching effect
        });
    };

    // New state for transaction success and history
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [lastTxHash, setLastTxHash] = useState("");
    const [showTxSuccess, setShowTxSuccess] = useState(false);

    // New state for swap progress modal
    const [showSwapProgressModal, setShowSwapProgressModal] = useState(false);
    const [swapProgressStatus, setSwapProgressStatus] = useState<"pending" | "success" | "error">("pending");
    const [swapErrorMessage, setSwapErrorMessage] = useState("");
    const [swapTxHash, setSwapTxHash] = useState("");
    const [swapProvider, setSwapProvider] = useState("");

    // New state for tracking approval process
    const [isApprovalPhase, setIsApprovalPhase] = useState(false);
    const [approvalTxHash, setApprovalTxHash] = useState("");

    // New state for tracking selected provider/route
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

    // State for token approval display
    const [needsApproval, setNeedsApproval] = useState(false);
    const [tokenApprovalAddress, setTokenApprovalAddress] = useState("");
    const [insufficientFundsError, setInsufficientFundsError] = useState("");

    // Helper function to get native token for a network
    const getNativeTokenForNetwork = useCallback((network) => {
        const networkTokens = getTokensByNetwork(network);

        // Map of common network codes to their native token symbols
        const nativeTokenMap = {
            'eth': 'ETH',
            'polygon': 'MATIC',
            'bsc': 'BNB',
            'arbitrum': 'ETH',
            'optimism': 'ETH',
            'avalanche': 'AVAX',
            'base': 'ETH',
            'linea': 'ETH',
            'scroll': 'ETH',
            'zksync': 'ETH',
            'fantom': 'FTM',
            'polygon_zkevm': 'ETH',
            'polygon-zkevm': 'ETH',
            'rootstock': 'RBTC',
            'fuse': 'FUSE',
            'blast': 'ETH',
            'kroma': 'ETH',
            'horizen_eon': 'EON',
            'horizen-eon': 'EON',
            'mode': 'ETH',
            'zk_fair': 'USDC',
            'zkfair': 'USDC',
            'taiko': 'ETH',
            'metis': 'METIS',
            'klaytn': 'KLAY',
            'velas': 'VLX',
            'syscoin': 'SYS',
            'aurora': 'ETH',
            'celo': 'CELO',
            'boba': 'BOBA',
            'kava': 'KAVA',
            'oasis': 'ROSE',
            'gnosis': 'xDAI',
            'moonbeam': 'GLMR',
            'moonriver': 'MOVR',
            'harmony': 'ONE',
            'telos': 'TLOS',
            'cronos': 'CRO',
            'astar': 'ASTR',
            'astar_evm': 'ASTR',
            'zetachain': 'ZETA',
            'tron': 'TRX',
            'manta': 'ETH',
            'manta_pacific': 'ETH'
        };

        // Try to find the native token
        // First by checking 0x0 address which typically represents native token
        let nativeToken = networkTokens.find(t => t.address === "0x0000000000000000000000000000000000000000");

        // If not found by address, try to find by the symbol
        if (!nativeToken && nativeTokenMap[network]) {
            nativeToken = networkTokens.find(t =>
                t.symbol.toUpperCase() === nativeTokenMap[network] ||
                t.symbol.toUpperCase() === 'W' + nativeTokenMap[network]  // Also check for wrapped version
            );
        }

        // If still not found, use the first token as fallback
        if (!nativeToken && networkTokens.length > 0) {
            nativeToken = networkTokens[0];
        }

        return nativeToken;
    }, []);

    // Swap details state
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [slippage, setSlippage] = useState(2);
    const [customSlippage, setCustomSlippage] = useState("");
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [autoSlippage, setAutoSlippage] = useState(false);

    // Format the slippage for display - moved earlier to fix the "used before declaration" error
    const formattedSlippage = useMemo(() => {
        if (customSlippage) {
            return customSlippage;
        }
        return slippage.toString();
    }, [slippage, customSlippage]);

    // Trade data state
    const [bestTrade, setBestTrade] = useState(null);
    const [trades, setTrades] = useState([]);
    const [routeProviders, setRouteProviders] = useState([]);
    const [quoteError, setQuoteError] = useState(null);

    // UI state
    const [loadingQuote, setLoadingQuote] = useState(false);
    const [swapInProgress, setSwapInProgress] = useState(false);

    // Connect wallet to SDK when address changes
    useEffect(() => {
        if (isConnected && address && rubicSDK.isInitialized) {
            rubicSDK.connectWalletToSDK(rubicSDK.CHAIN_TYPE.EVM, address);
        }
    }, [isConnected, address, rubicSDK]);

    // Helper function to convert network to blockchain name
    const getBlockchainName = useCallback((network) => {
        return rubicSDK.BLOCKCHAIN_NAME[networkToBlockchainMap[network]] || rubicSDK.BLOCKCHAIN_NAME.ETHEREUM;
    }, [rubicSDK.BLOCKCHAIN_NAME]);

    // Helper function to save a transaction to history
    const saveTransactionToHistory = useCallback((hash: string, provider?: string, status: 'pending' | 'success' | 'failed' = 'success') => {
        if (!address || !hash) return;

        // Create transaction object
        const transaction: Transaction = {
            hash,
            fromNetwork,
            toNetwork,
            fromToken: {
                symbol: fromToken.symbol,
                address: fromToken.address
            },
            toToken: {
                symbol: toToken.symbol,
                address: toToken.address
            },
            timestamp: Date.now(),
            type: fromNetwork === toNetwork ? 'on-chain' : 'cross-chain',
            provider: provider || swapProvider || bestTrade?.type || bestTrade?.tradeType || 'unknown',
            status,
            amount: fromAmount,
            explorerUrl: getExplorerUrl(fromNetwork, hash)
        };

        // Save to local storage
        saveTransaction(address, transaction);

        // If history panel is not open, show it to let the user know a transaction was saved
        if (!isHistoryOpen) {
            setIsHistoryOpen(true);
        }
    }, [address, fromNetwork, toNetwork, fromToken, toToken, fromAmount, swapProvider, bestTrade, isHistoryOpen]);

    // Handle network and token switching
    const handleSwitchNetworksAndTokens = useCallback(() => {
        // Don't allow switching during swap operation
        if (swapInProgress) return;

        // Store current values
        const tempFromNetwork = fromNetwork;
        const tempToNetwork = toNetwork;
        const tempFromToken = fromToken;
        const tempToToken = toToken;

        // Swap the networks
        setFromNetwork(tempToNetwork);
        setToNetwork(tempFromNetwork);

        // Swap the tokens
        setFromToken(tempToToken);
        setToToken(tempFromToken);

        // Reset the amounts
        setFromAmount("");
        setToAmount("");
        setBestTrade(null);
        setTrades([]);
        setQuoteError(null);
        setInsufficientFundsError("");

    }, [fromNetwork, toNetwork, fromToken, toToken, swapInProgress]);

    // Calculate trades when inputs change
    useEffect(() => {
        // Clear existing data
        setBestTrade(null);
        setTrades([]);
        setToAmount("");
        setRouteProviders([]);
        setQuoteError(null);
        setSelectedProvider(null); // Reset selected provider when inputs change
        setNeedsApproval(false);
        setInsufficientFundsError("");

        // Skip if insufficient data or SDK not ready
        if (!fromAmount || parseFloat(fromAmount) <= 0 || !rubicSDK.isInitialized) {
            return;
        }

        // Debounce the calculation request
        const debounceTimeout = setTimeout(async () => {
            try {
                setLoadingQuote(true);

                const fromBlockchainName = getBlockchainName(fromNetwork);
                const toBlockchainName = getBlockchainName(toNetwork);

                let calculatedTrades = [];

                if (fromNetwork === toNetwork) {
                    // On-chain swap
                    calculatedTrades = await rubicSDK.calculateOnChainTrade(
                        fromBlockchainName,
                        fromToken.address,
                        toToken.address,
                        fromAmount
                    );
                } else {
                    // Cross-chain swap
                    calculatedTrades = await rubicSDK.calculateCrossChainTrade(
                        fromBlockchainName,
                        toBlockchainName,
                        fromToken.address,
                        toToken.address,
                        fromAmount
                    );
                }

                console.log("Calculated trades:", calculatedTrades);

                // Only continue if we got results
                if (calculatedTrades && calculatedTrades.length > 0) {
                    setTrades(calculatedTrades);

                    // Sort trades by output amount (highest first)
                    const sortedTrades = [...calculatedTrades].sort((a, b) => {                        
                        // Extract output token amounts for comparison
                        const getAmount = (trade) => {
                            try {
                                if (trade.to?.tokenAmount) {
                                    const tokenAmount = trade.to.tokenAmount;
                                    // Ensure we have a valid string representation
                                    const amountStr = typeof tokenAmount === 'object' ?
                                        tokenAmount.toString() :
                                        String(tokenAmount).replace(/[^\d.]/g, ''); // Remove non-numeric chars except dot
                                    return new BigNumber(amountStr || '0');
                                }
                                if (trade.trade?.to?.tokenAmount) {
                                    const tokenAmount = trade.trade.to.tokenAmount;
                                    // Ensure we have a valid string representation
                                    const amountStr = typeof tokenAmount === 'object' ?
                                        tokenAmount.toString() :
                                        String(tokenAmount).replace(/[^\d.]/g, ''); // Remove non-numeric chars except dot
                                    return new BigNumber(amountStr || '0');
                                }
                            } catch (err) {
                                console.error("Error converting token amount to BigNumber:", err);
                            }
                            return new BigNumber(0);
                        };

                        const amountA = getAmount(a);
                        const amountB = getAmount(b);

                        // Compare in descending order
                        return amountB.minus(amountA).toNumber();
                    });

                    // Set the best trade
                    const best = sortedTrades[0];
                    setBestTrade(best);

                    // Extract the output amount to display
                    let outputAmount = "0";
                    if (fromNetwork === toNetwork && best.to) {
                        // On-chain swap - use our formatter
                        outputAmount = formatTokenAmount(best.to.tokenAmount, 6);
                    } else if (best.trade && best.trade.to) {
                        // Cross-chain swap - use our formatter
                        outputAmount = formatTokenAmount(best.trade.to.tokenAmount, 6);
                    }

                    setToAmount(outputAmount);

                    // Extract providers
                    const providers = calculatedTrades.map(trade =>
                        fromNetwork === toNetwork
                            ? trade.type
                            : trade.type || trade.tradeType || (trade.trade && trade.trade.type)
                    );

                    // Filter out undefined/null providers
                    const validProviders = providers.filter(provider => !!provider);
                    setRouteProviders([...new Set(validProviders)]);

                    // Debug information
                    console.log("Available route providers:", validProviders);

                    // Check if approval is needed - similar logic as in handleSwap
                    let detectedNeedsApproval = false;
                    let approvalAddress = null;

                    if (fromNetwork === toNetwork) {
                        // On-chain swap approval detection
                        if (typeof best.needsApprove === 'function') {
                            try {
                                detectedNeedsApproval = await best.needsApprove();
                            } catch (e) {
                                console.error("Error checking needsApprove:", e);
                                detectedNeedsApproval = true;
                            }
                        } else if (best.needsApprove === true) {
                            detectedNeedsApproval = true;
                        } else if (best.from?.tokenAddress && best.from?.tokenAddress !== "0x0000000000000000000000000000000000000000") {
                            detectedNeedsApproval = !best.approveCompleted;
                        }

                        if (best.spenderAddress) {
                            approvalAddress = best.spenderAddress;
                        } else if (best.contractAddress) {
                            approvalAddress = best.contractAddress;
                        }
                    } else {
                        // Cross-chain swap approval detection
                        if (best.trade) {
                            if (typeof best.trade.needsApprove === 'function') {
                                detectedNeedsApproval = await best.trade.needsApprove();
                            } else if (best.trade.needsApprove === true) {
                                detectedNeedsApproval = true;
                            }

                            if (best.trade.spenderAddress) {
                                approvalAddress = best.trade.spenderAddress;
                            }
                        } else if (best.needsApprove === true) {
                            detectedNeedsApproval = true;
                        } else if (best.crossChain && best.crossChain.needsApprove === true) {
                            detectedNeedsApproval = true;

                            if (best.crossChain.spenderAddress) {
                                approvalAddress = best.crossChain.spenderAddress;
                            }
                        }

                        if (!approvalAddress && best.onChainTrade && best.onChainTrade.spenderAddress) {
                            approvalAddress = best.onChainTrade.spenderAddress;
                        }
                    }

                    // Only set needs approval if it's not a native token
                    if (detectedNeedsApproval && fromToken.address !== "0x0000000000000000000000000000000000000000") {
                        setNeedsApproval(true);
                        if (approvalAddress) {
                            setTokenApprovalAddress(approvalAddress);
                        }
                    }
                } else {
                    setQuoteError("No routes found for this swap.");
                }
            } catch (error) {
                console.error("Error calculating trade:", error);
                setQuoteError(error.message || "Failed to calculate trade. Please try again.");

                // Check for insufficient funds in error message
                if (error.message && (
                    error.message.includes("insufficient funds") ||
                    error.message.includes("InsufficientFunds") ||
                    error.message.includes("insufficient balance")
                )) {
                    setInsufficientFundsError(`Insufficient funds for ${fromToken.symbol} on ${getNetworkName(fromNetwork)}.`);
                }
            } finally {
                setLoadingQuote(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(debounceTimeout);
    }, [
        fromAmount,
        fromToken,
        toToken,
        fromNetwork,
        toNetwork,
        rubicSDK.isInitialized,
        getBlockchainName,
        rubicSDK.calculateOnChainTrade,
        rubicSDK.calculateCrossChainTrade
    ]);

    // Function to manually refresh quotes
    const refreshQuotes = useCallback(() => {
        if (!fromAmount || parseFloat(fromAmount) <= 0 || !rubicSDK.isInitialized) {
            return;
        }

        setLoadingQuote(true);
        setBestTrade(null);
        setTrades([]);
        setToAmount("");
        setRouteProviders([]);
        setQuoteError(null);
        setSelectedProvider(null);
        setNeedsApproval(false);
        setInsufficientFundsError("");

        // Force a new quote calculation by setting a random state that's part of the useEffect dependency array
        setFromAmount(prev => {
            // Small trick to force the effect to run again without changing the actual value
            const num = parseFloat(prev);
            return (num + 0.000000000001).toString();
        });
    }, [fromAmount, rubicSDK.isInitialized]);

    // Handle route selection
    const handleRouteSelect = useCallback((provider: string) => {
        // Set the selected provider
        setSelectedProvider(provider);

        // Find the trade that matches this provider
        const selectedTrade = trades.find((trade) =>
            (trade.type === provider || trade.tradeType === provider)
        );

        if (selectedTrade) {
            // Update best trade to the selected one
            setBestTrade(selectedTrade);

            // Update destination amount based on the selected trade
            let outputAmount = "";
            if (fromNetwork === toNetwork && selectedTrade.to) {
                // On-chain swap
                outputAmount = formatTokenAmount(selectedTrade.to.tokenAmount, 6);
            } else if (selectedTrade.trade && selectedTrade.trade.to) {
                // Cross-chain swap
                outputAmount = formatTokenAmount(selectedTrade.trade.to.tokenAmount, 6);
            } else if (selectedTrade.to && selectedTrade.to.tokenAmount) {
                // Fallback for different structure
                outputAmount = formatTokenAmount(selectedTrade.to.tokenAmount, 6);
            }

            setToAmount(outputAmount);

            toast.success(`Selected ${provider} route`);
        }
    }, [fromNetwork, toNetwork, trades]);

    // Handle amount input change
    const handleFromAmountChange = (e) => {
        // Only allow numeric input with a decimal point
        const value = e.target.value.replace(/[^0-9.]/g, "");

        // Prevent multiple decimal points
        const decimalCount = (value.match(/\./g) || []).length;
        if (decimalCount > 1) return;

        setFromAmount(value);
    };

    // Handle support button click to open Telegram
    const handleSupportClick = () => {
        window.open('https://t.me/Vizor_portal', '_blank');
    };

    // Handle swap execution with chain switching
    const handleSwap = async () => {
        if (!bestTrade || !isConnected) {
            return;
        }

        try {
            setSwapInProgress(true);
            setInsufficientFundsError(""); // Clear any previous insufficient funds error

            // Initial state for swap progress modal
            setSwapProgressStatus("pending");
            setSwapErrorMessage("");
            setSwapTxHash("");
            setIsApprovalPhase(false);
            setApprovalTxHash("");

            // Set provider information if available
            if (bestTrade.type || bestTrade.tradeType) {
                setSwapProvider(bestTrade.type || bestTrade.tradeType);
            } else if (bestTrade.trade?.type) {
                setSwapProvider(bestTrade.trade.type);
            }

            // Show the swap progress modal
            setShowSwapProgressModal(true);

            // Get the source blockchain name and chain ID
            const sourceBlockchainName = getBlockchainName(fromNetwork);
            const requiredChainId = rubicSDK.getChainId(sourceBlockchainName);

            // Check if wallet is on the correct chain
            if (chainId !== requiredChainId) {
                toast.info(`Switching to ${getNetworkName(fromNetwork)} network...`);

                try {
                    // Switch chain using wagmi
                    await switchChain({ chainId: requiredChainId });

                    // Wait for chain switch to complete
                    toast.success(`Switched to ${getNetworkName(fromNetwork)} network`);

                    // Small delay to ensure wallet state is updated
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (switchError) {
                    console.error("Error switching chain:", switchError);
                    toast.error(`Failed to switch network: ${switchError.message}`);
                    setSwapInProgress(false);
                    setSwapProgressStatus("error");
                    setSwapErrorMessage(`Failed to switch network: ${switchError.message}`);
                    return;
                }
            }

            // Check for sufficient balance BEFORE proceeding with swap
            try {
                if (rubicSDK.sdkInstance?.web3PublicService) {
                    const web3Public = rubicSDK.sdkInstance.web3PublicService.getWeb3Public(sourceBlockchainName);

                    if (web3Public) {
                        const fromTokenObj = {
                            address: fromToken.address,
                            blockchain: sourceBlockchainName,
                            decimals: 18, // This should ideally be fetched dynamically
                            symbol: fromToken.symbol,
                            name: fromToken.symbol,
                        };                        // Use the imported BigNumber class instead of window.BigNumber
                        let requiredAmount;
                        try {
                            // Ensure fromAmount is a valid numeric string
                            const sanitizedAmount = String(fromAmount).replace(/[^\d.]/g, '');
                            requiredAmount = new BigNumber(sanitizedAmount || '0');
                            console.log("Checking balance for:", address, fromTokenObj, requiredAmount.toString());
                        } catch (err) {
                            console.error("Error converting fromAmount to BigNumber:", err);
                            throw new Error(`Invalid amount format: ${fromAmount}`);
                        }

                        // Use the checkBalance method from EvmWeb3Public
                        await web3Public.checkBalance(fromTokenObj, requiredAmount, address);
                        console.log("Balance check passed");
                    }
                }
            } catch (balanceError) {
                console.error("Insufficient funds detected:", balanceError);
                const errorMsg = `Insufficient funds for ${fromToken.symbol} on ${getNetworkName(fromNetwork)}.`;

                // Update all UI elements to show the error
                setInsufficientFundsError(errorMsg);
                setSwapProgressStatus("error");
                setSwapErrorMessage(errorMsg);
                toast.error(errorMsg);
                setSwapInProgress(false);
                return;
            }

            // Common approval and swap options
            let approvalHash = "";
            const swapOptions = {
                onConfirm: (hash) => {
                    toast.success(`Transaction confirmed: ${hash.slice(0, 10)}...`);

                    // Store the transaction hash for display
                    setLastTxHash(hash);
                    setShowTxSuccess(true);

                    // Update swap progress modal
                    setSwapTxHash(hash);
                    setSwapProgressStatus("success");

                    // Save transaction to history
                    saveTransactionToHistory(hash, swapProvider, 'success');
                },
                onApprove: (hash) => {
                    if (hash) {
                        approvalHash = hash;
                        setApprovalTxHash(hash);
                        toast.info(`Approving ${fromToken.symbol}: ${hash.slice(0, 10)}...`);

                        // Update UI to indicate approval is in progress
                        setIsApprovalPhase(true);
                        setSwapProgressStatus("pending");
                        setSwapErrorMessage(`Approving ${fromToken.symbol}... This may take a moment.`);
                    }
                },
                slippageTolerance: parseFloat(formattedSlippage) / 100,
            };

            // Debug the trade object structure
            console.log("Trade object to execute:", bestTrade);
            let result;

            // Check if approval is needed
            let needsApproval = false;
            let tradeToExecute = bestTrade;
            let approvalAddress = null;

            // Debug approval information
            console.log("Checking if approval is needed for:", fromToken.symbol);

            if (fromNetwork === toNetwork) {
                // On-chain swap approval detection - check various properties
                if (typeof bestTrade.needsApprove === 'function') {
                    // Function form - call it to determine if approval is needed
                    try {
                        needsApproval = await bestTrade.needsApprove();
                        console.log("needsApprove() function result:", needsApproval);
                    } catch (e) {
                        console.error("Error checking needsApprove:", e);
                        // Assume approval might be needed if check fails
                        needsApproval = true;
                    }
                } else if (bestTrade.needsApprove === true) {
                    // Boolean form
                    needsApproval = true;
                    console.log("needsApprove boolean is true");
                } else if (bestTrade.from?.tokenAddress && bestTrade.from?.tokenAddress !== "0x0000000000000000000000000000000000000000") {
                    // If it's a token (not a native currency) assume approval might be needed
                    // This is a fallback for providers that don't clearly indicate approval needs
                    console.log("Token is not native currency, might need approval");
                    needsApproval = !bestTrade.approveCompleted;
                }

                // Check for approval address
                if (bestTrade.spenderAddress) {
                    approvalAddress = bestTrade.spenderAddress;
                    console.log("Found spenderAddress:", approvalAddress);
                } else if (bestTrade.contractAddress) {
                    approvalAddress = bestTrade.contractAddress;
                    console.log("Using contractAddress for approval:", approvalAddress);
                }
            } else {
                // Cross-chain swap - check various properties where approval info might be
                if (bestTrade.trade) {
                    if (typeof bestTrade.trade.needsApprove === 'function') {
                        needsApproval = await bestTrade.trade.needsApprove();
                        tradeToExecute = bestTrade.trade;
                    } else if (bestTrade.trade.needsApprove === true) {
                        needsApproval = true;
                        tradeToExecute = bestTrade.trade;
                    }

                    if (bestTrade.trade.spenderAddress) {
                        approvalAddress = bestTrade.trade.spenderAddress;
                    }
                } else if (bestTrade.needsApprove === true) {
                    needsApproval = true;
                } else if (bestTrade.crossChain && bestTrade.crossChain.needsApprove === true) {
                    needsApproval = true;
                    tradeToExecute = bestTrade.crossChain;

                    if (bestTrade.crossChain.spenderAddress) {
                        approvalAddress = bestTrade.crossChain.spenderAddress;
                    }
                }

                // For cross-chain if we don't have an approval address but have a token contract
                if (!approvalAddress && bestTrade.onChainTrade && bestTrade.onChainTrade.spenderAddress) {
                    approvalAddress = bestTrade.onChainTrade.spenderAddress;
                }
            }

            console.log("Final approval check result:", {
                needsApproval,
                approvalAddress,
                fromTokenAddress: fromToken.address,
                fromTokenSymbol: fromToken.symbol
            });

            // Handle approval if needed
            if (needsApproval && fromToken.address !== "0x0000000000000000000000000000000000000000") {
                try {
                    // Set approval phase in UI
                    setIsApprovalPhase(true);
                    toast.info(`Approval required for ${fromToken.symbol}. Please confirm in your wallet.`);
                    setSwapProgressStatus("pending");
                    setSwapErrorMessage(`Approving ${fromToken.symbol}... Please confirm the transaction in your wallet.`);

                    // Enhanced approval method detection and execution
                    let approvalResult;

                    if (typeof tradeToExecute.approve === 'function') {
                        console.log("Using direct approve method on tradeToExecute");
                        approvalResult = await tradeToExecute.approve(swapOptions);
                        console.log("Direct approve result:", approvalResult);
                    }
                    else if (typeof bestTrade.approve === 'function') {
                        console.log("Using bestTrade.approve method");
                        approvalResult = await bestTrade.approve(swapOptions);
                        console.log("bestTrade approve result:", approvalResult);
                    }
                    else if (approvalAddress && rubicSDK && rubicSDK.sdkInstance) {
                        // Attempt to use SDK's approval methods if direct methods aren't available
                        console.log("Using SDK approval with address:", approvalAddress);

                        // Get token contract instance
                        const tokenContract = await rubicSDK.sdkInstance.contractUtils.getErc20TokenContract(
                            fromToken.address,
                            getBlockchainName(fromNetwork)
                        );

                        if (tokenContract) {
                            // Perform approval using the token contract
                            const approveTx = await tokenContract.methods
                                .approve(approvalAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
                                .send({ from: address });

                            if (approveTx && approveTx.transactionHash) {
                                approvalHash = approveTx.transactionHash;
                                setApprovalTxHash(approvalHash);

                                // Call onApprove callback if provided
                                if (swapOptions.onApprove) {
                                    swapOptions.onApprove(approvalHash);
                                }

                                console.log("Manual approval result:", approveTx);
                            }
                        }
                    }
                    else {
                        console.log("No direct approve method found");

                        // Try to get the trade object where approval might be available
                        const possibleTradeWithApprove =
                            (bestTrade.trade && typeof bestTrade.trade.approve === 'function') ? bestTrade.trade :
                                (bestTrade.onChainTrade && typeof bestTrade.onChainTrade.approve === 'function') ? bestTrade.onChainTrade :
                                    (bestTrade.crossChain && typeof bestTrade.crossChain.approve === 'function') ? bestTrade.crossChain : null;

                        if (possibleTradeWithApprove) {
                            console.log("Found alternative approve method");
                            approvalResult = await possibleTradeWithApprove.approve(swapOptions);
                            console.log("Alternative approve result:", approvalResult);
                        } else {
                            toast.warning("Approval handling not available directly. Will attempt to proceed with swap.");
                            setSwapErrorMessage("Please approve token access in your wallet when prompted.");
                        }
                    }

                    // Wait for approval to complete with timeout
                    if (approvalHash) {
                        toast.info("Waiting for approval confirmation...");
                        setSwapErrorMessage("Waiting for approval to be confirmed on the blockchain...");

                        // Wait for confirmation (can use a receipt check here)
                        await new Promise(resolve => setTimeout(resolve, 15000)); // Simple timeout

                        toast.success("Token approval confirmed!");
                        setSwapErrorMessage("Token approval confirmed. Proceeding with swap...");

                        // Set approval phase to false since we're moving to the swap phase
                        setIsApprovalPhase(false);
                    }
                } catch (approvalError) {
                    console.error("Error approving tokens:", approvalError);
                    toast.error(`Token approval failed: ${approvalError.message || "Unknown error"}`);
                    setSwapProgressStatus("error");
                    setSwapErrorMessage(`Token approval failed: ${approvalError.message || "Unknown error"}`);
                    throw new Error(`Token approval failed: ${approvalError.message}`);
                }
            } else if (fromToken.address === "0x0000000000000000000000000000000000000000") {
                console.log("Native currency selected, no approval needed");
            }

            // Proceed with swap execution
            // Reset approval phase as we move to the actual swap
            setIsApprovalPhase(false);

            if (fromNetwork === toNetwork) {
                // ON-CHAIN SWAP
                console.log("Executing on-chain swap"); 
                try {
                    // Check if bestTrade is valid
                    if (!bestTrade) {
                        throw new Error("No valid trade found");
                    }

                    // Try direct swap method - most common case
                    if (typeof bestTrade.swap === 'function') {
                        console.log("Using direct swap method");
                        result = await bestTrade.swap(swapOptions);
                    }
                    // Check if it's wrapped in a "trade" property
                    else if (bestTrade.trade && typeof bestTrade.trade.swap === 'function') {
                        console.log("Using trade.swap method");
                        result = await bestTrade.trade.swap(swapOptions);
                    }
                    // Check if it has an on property with a swap function
                    else if (bestTrade.on && typeof bestTrade.on.swap === 'function') {
                        console.log("Using on.swap method");
                        result = await bestTrade.on.swap(swapOptions);
                    }
                    // Try with executeSwap helper
                    else {
                        console.log("Using executeSwap helper");
                        result = await rubicSDK.executeSwap(bestTrade, swapOptions);
                    }
                } catch (swapError) {
                    console.error("On-chain swap execution error:", swapError);
                    // Try alternative approach with SDK helper
                    try {
                        console.log("Trying alternative swap execution");
                        // Create executor for the on-chain trade
                        const onChainTrade = bestTrade;

                        // Additional setup if needed
                        if (onChainTrade.needsApprove) {
                            toast.info(`Approving ${fromToken.symbol}...`);
                            await onChainTrade.approve(swapOptions);
                        }

                        // Execute the swap
                        result = await onChainTrade.swap(swapOptions);
                    } catch (alternativeError) {
                        const errorMessage = alternativeError.message || swapError.message || "Unknown error";
                        setSwapProgressStatus("error");
                        setSwapErrorMessage(errorMessage);
                        throw new Error(`Swap failed: ${errorMessage}`);
                    }
                }
            } else {
                // CROSS-CHAIN SWAP
                console.log("Executing cross-chain swap");

                // The structure depends on the cross-chain provider
                tradeToExecute = bestTrade;

                // Check different properties where the actual trade with swap method might be
                if (bestTrade.trade && typeof bestTrade.trade.swap === 'function') {
                    console.log("Using cross-chain trade.swap method");
                    tradeToExecute = bestTrade.trade;
                } else if (bestTrade.crossChain && typeof bestTrade.crossChain.swap === 'function') {
                    console.log("Using bestTrade.crossChain.swap method");
                    tradeToExecute = bestTrade.crossChain;
                } else if (typeof bestTrade.swap === 'function') {
                    console.log("Using direct cross-chain swap method");
                    tradeToExecute = bestTrade;
                }

                try {
                    // Use the executeTrade method if available
                    if (bestTrade.executeTrade && typeof bestTrade.executeTrade === 'function') {
                        console.log("Using executeTrade method");
                        result = await bestTrade.executeTrade(swapOptions);
                    } else {
                        // Execute the swap with proper trade object
                        result = await tradeToExecute.swap(swapOptions);
                    }

                    // Extract transaction hash if available
                    if (result && result.hash) {
                        setLastTxHash(result.hash);
                        setShowTxSuccess(true);
                        setSwapTxHash(result.hash);
                        setSwapProgressStatus("success");

                        // Save transaction to history
                        saveTransactionToHistory(result.hash, swapProvider, 'success');
                    }
                } catch (crossChainError) {
                    console.error("Cross-chain swap error:", crossChainError);

                    // First, check if the error itself or its message indicates insufficient funds
                    let isInsufficientFunds = false;
                    let errorMessage = "Unknown error";

                    if (crossChainError) {
                        // Check error name
                        if (crossChainError.name === "InsufficientFundsError") {
                            isInsufficientFunds = true;
                            errorMessage = `Insufficient funds for ${fromToken.symbol} on ${getNetworkName(fromNetwork)}.`;
                        }
                        // Check error message
                        else if (crossChainError.message) {
                            errorMessage = crossChainError.message;

                            if (
                                errorMessage.includes("insufficient funds") ||
                                errorMessage.includes("InsufficientFunds") ||
                                errorMessage.includes("Insufficient Funds") ||
                                errorMessage.includes("insufficient balance")
                            ) {
                                isInsufficientFunds = true;
                                errorMessage = `Insufficient funds for ${fromToken.symbol} on ${getNetworkName(fromNetwork)}.`; setInsufficientFundsError(errorMessage);
                                toast.error(errorMessage);
                                setSwapProgressStatus("error");
                                setSwapErrorMessage(errorMessage);
                            }
                        }
                        // Check error stack
                        else if (crossChainError.stack &&
                            (crossChainError.stack.includes("InsufficientFunds") ||
                                crossChainError.stack.includes("insufficient funds"))) {
                            isInsufficientFunds = true;
                            errorMessage = `Insufficient funds for ${fromToken.symbol} on ${getNetworkName(fromNetwork)}.`; setInsufficientFundsError(errorMessage);
                            toast.error(errorMessage);
                            setSwapProgressStatus("error");
                            setSwapErrorMessage(errorMessage);
                        }
                        // Check if stringify reveals an insufficient funds error
                        else {
                            try {
                                const errorStr = JSON.stringify(crossChainError);
                                if (
                                    errorStr.includes("insufficient funds") ||
                                    errorStr.includes("InsufficientFunds") ||
                                    errorStr.includes("Insufficient Funds") ||
                                    errorStr.includes("insufficient balance")
                                ) {
                                    isInsufficientFunds = true;
                                    errorMessage = `Insufficient funds for ${fromToken.symbol} on ${getNetworkName(fromNetwork)}.`; setInsufficientFundsError(errorMessage);
                                    toast.error(errorMessage);
                                    setSwapProgressStatus("error");
                                    setSwapErrorMessage(errorMessage);
                                }
                            } catch (e) {
                                console.log("Error stringifying error", e);
                            }
                        }
                    }

                    // If we've detected an insufficient funds error, handle it
                    if (isInsufficientFunds) {
                        setInsufficientFundsError(errorMessage);
                        toast.error(errorMessage);
                        setSwapProgressStatus("error");
                        setSwapErrorMessage(errorMessage);
                        throw new Error(errorMessage); // This will be caught by the outer catch block
                    }

                    // If no insufficient funds error, try fallback SDK method
                    try {
                        result = await rubicSDK.executeSwap(tradeToExecute, swapOptions);

                        // Extract transaction hash if available
                        if (result && result.hash) {
                            setLastTxHash(result.hash);
                            setShowTxSuccess(true);
                            setSwapTxHash(result.hash);
                            setSwapProgressStatus("success");

                            // Save transaction to history
                            saveTransactionToHistory(result.hash, swapProvider, 'success');
                        }
                    } catch (fallbackError) {
                        // Check for insufficient funds in the fallback error too
                        const fallbackErrorMsg = fallbackError.message || "Unknown error";

                        if (
                            fallbackErrorMsg.includes("insufficient funds") ||
                            fallbackErrorMsg.includes("InsufficientFunds") ||
                            fallbackErrorMsg.includes("Insufficient Funds") ||
                            fallbackErrorMsg.includes("insufficient balance") ||
                            fallbackError.name === "InsufficientFundsError" ||
                            (fallbackError.stack && fallbackError.stack.includes("InsufficientFunds"))
                        ) {
                            const errorMsg = `Insufficient funds for ${fromToken.symbol} on ${getNetworkName(fromNetwork)}.`; setInsufficientFundsError(errorMsg);
                            toast.error(errorMsg);
                            setSwapProgressStatus("error");
                            setSwapErrorMessage(errorMsg);
                        } else {
                            setSwapProgressStatus("error");
                            setSwapErrorMessage(fallbackErrorMsg);
                            throw new Error(`Cross-chain swap failed: ${fallbackErrorMsg}`);
                        }
                    }
                }
            }

            toast.success(`Swap executed successfully!`);
            console.log("Swap result:", result);

            // Extract transaction hash if available and not already set
            if (result && result.hash && !lastTxHash) {
                setLastTxHash(result.hash);
                setShowTxSuccess(true);
                setSwapTxHash(result.hash);
                setSwapProgressStatus("success");

                // Save transaction to history
                saveTransactionToHistory(result.hash, swapProvider, 'success');
            }

            // Clear fields after successful swap
            setFromAmount("");
            setToAmount("");
            setBestTrade(null);
            setTrades([]);

        } catch (error) {
            console.error("Error executing swap:", error);

            // Function to check if any error in the chain is an insufficient funds error
            const isInsufficientFundsError = (err) => {
                if (!err) return false;

                // Check the error object itself
                if (
                    err.name === "InsufficientFundsError" ||
                    (typeof err.message === 'string' && (
                        err.message.includes("insufficient funds") ||
                        err.message.includes("InsufficientFunds") ||
                        err.message.includes("insufficient balance")
                    )) ||
                    (typeof err.toString === 'function' && err.toString().includes("InsufficientFunds")) ||
                    (err.stack && err.stack.includes("InsufficientFunds"))
                ) {
                    return true;
                }

                // Check if there's a cause or original error
                if (err.cause) return isInsufficientFundsError(err.cause);
                if (err.originalError) return isInsufficientFundsError(err.originalError);
                if (err.error) return isInsufficientFundsError(err.error);

                return false;
            };

            // Check for insufficient funds in the error or any of its nested errors
            if (isInsufficientFundsError(error)) {
                const errorMsg = `Insufficient funds for ${fromToken.symbol} on ${getNetworkName(fromNetwork)}.`;

                // Update all UI elements to show the error
                setInsufficientFundsError(errorMsg);
                setSwapProgressStatus("error");
                setSwapErrorMessage(errorMsg);
                toast.error(errorMsg);
            }
            // Handle CORS or network errors
            else if (
                error.message && (
                    error.message.includes("Failed to fetch") ||
                    error.message.includes("Network Error") ||
                    error.message.includes("CORS") ||
                    error.message.toLowerCase().includes("api")
                )
            ) {
                const errorMsg = `Network error: Could not connect to swap provider. Please try again later.`;
                toast.error(errorMsg);
                setSwapProgressStatus("error");
                setSwapErrorMessage(errorMsg);
                setQuoteError(errorMsg);
            } else {
                // Get the most specific error message possible
                let errorMsg = error.message || "Unknown error occurred during swap";

                // For nested errors in cross-chain swaps, try to extract the specific error
                if (error.message && error.message.includes("Cross-chain swap failed")) {
                    // Try to extract the specific error from the parent error message
                    const nestedErrorMatch = error.message.match(/Cross-chain swap failed: (.*)/);
                    if (nestedErrorMatch && nestedErrorMatch[1] && nestedErrorMatch[1] !== "Unknown error") {
                        errorMsg = nestedErrorMatch[1];
                    } else if (error.cause || error.originalError || error.error) {
                        // Try to use the nested error's message
                        const nestedError = error.cause || error.originalError || error.error;
                        if (nestedError && nestedError.message) {
                            errorMsg = nestedError.message;
                        }
                    }
                }

                toast.error(`Swap failed: ${errorMsg}`);
                setSwapProgressStatus("error");
                setSwapErrorMessage(errorMsg);
            }

            // Save failed transaction if we have a hash
            if (swapTxHash) {
                saveTransactionToHistory(swapTxHash, swapProvider, 'failed');
            }
        } finally {
            setSwapInProgress(false);
        }
    };

    const formatGasFeeDisplay = useCallback((trade, isCrossChain = false) => {
        if (!trade) return "~$N/A";

        // First check if we have enhanced gas data from our new implementation
        if (trade.enhancedGasData && trade.enhancedGasData.gasPriceInUsd) {
            // Use the enhanced gas data which is more accurate
            const gasPriceUsd = trade.enhancedGasData.gasPriceInUsd.toString();
            return formatGasPrice(gasPriceUsd);
        }

        // Fall back to the original method if enhanced data isn't available
        const { gasPriceInUsd } = extractGasPrice(trade, isCrossChain);
        return formatGasPrice(gasPriceInUsd);
    }, []);

    // Compute minimum amount received based on slippage
    const minimumAmountReceived = useMemo(() => {
        if (!toAmount || !bestTrade) return "0";

        const slippagePercent = parseFloat(formattedSlippage) / 100;
        const minimumAmount = parseFloat(toAmount) * (1 - slippagePercent);
        return formatTokenAmount(minimumAmount, 6);
    }, [toAmount, formattedSlippage, bestTrade]);

    // Use the token price hook to get prices for both tokens
    const fromBlockchainForPrice = useMemo(() => {
        // Make sure we're passing the network code directly, the price hook will handle proper mapping
        return fromNetwork as BlockchainName;
    }, [fromNetwork]);

    const toBlockchainForPrice = useMemo(() => {
        // Make sure we're passing the network code directly, the price hook will handle proper mapping
        return toNetwork as BlockchainName;
    }, [toNetwork]);

    // Token price for the "from" token
    const {
        price: fromTokenPrice,
        isLoading: fromPriceLoading
    } = useTokenPrice({
        address: fromToken.address,
        blockchain: fromBlockchainForPrice,
        enabled: !!fromToken.address && !!fromBlockchainForPrice
    });

    // Token price for the "to" token
    const {
        price: toTokenPrice,
        isLoading: toPriceLoading
    } = useTokenPrice({
        address: toToken.address,
        blockchain: toBlockchainForPrice,
        enabled: !!toToken.address && !!toBlockchainForPrice
    });

    // IMPORTANT: Always call hooks unconditionally - no ternary operators or conditionals!
    // Balance hooks for "from" token and "to" token using wagmi's useBalance
    const { data: fromTokenBalance, isLoading: isFromBalanceLoading } = useBalance({
        address: address,
        token: fromToken.address === "0x0000000000000000000000000000000000000000" ? undefined : fromToken.address as `0x${string}`,
        chainId: rubicSDK?.getChainId?.(getBlockchainName?.(fromNetwork)) || undefined,
        query: {
            enabled: isConnected && !!fromToken.address && !!rubicSDK?.getChainId && !!getBlockchainName && !!fromNetwork
        }
    });

    // For "to" token, only fetch if not the same as from token
    const { data: toTokenBalance, isLoading: isToBalanceLoading } = useBalance({
        address: address,
        token: toToken.address === "0x0000000000000000000000000000000000000000" ? undefined : toToken.address as `0x${string}`,
        chainId: rubicSDK?.getChainId?.(getBlockchainName?.(toNetwork)) || undefined,
        query: {
            enabled: isConnected && !!toToken.address && !!rubicSDK?.getChainId && !!getBlockchainName && !!toNetwork && (
                fromNetwork !== toNetwork || fromToken.address !== toToken.address
            )
        }
    });

    // Format balances for display - safely handle all edge cases
    const formattedFromBalance = useMemo(() => {
        if (!isConnected) return "N/A";
        if (isFromBalanceLoading) return "Loading...";
        if (!fromTokenBalance || !fromTokenBalance.formatted) return "0";

        try {
            // Format balance to 4 decimal places for small numbers, use nFormatter for large numbers
            const balanceValue = parseFloat(fromTokenBalance.formatted);
            if (isNaN(balanceValue)) return "0";

            if (balanceValue < 0.0001) {
                return "< 0.0001";
            } else if (balanceValue > 1000) {
                // Safely use nFormatter, or fall back to toFixed if nFormatter fails
                try {
                    return typeof nFormatter === 'function' ?
                        nFormatter(balanceValue, 2) :
                        balanceValue.toFixed(2);
                } catch (e) {
                    console.error("Error formatting with nFormatter:", e);
                    return balanceValue.toFixed(2);
                }
            } else {
                return balanceValue.toFixed(balanceValue < 1 ? 4 : 2);
            }
        } catch (error) {
            console.error("Error formatting balance:", error);
            return "0";
        }
    }, [isConnected, isFromBalanceLoading, fromTokenBalance]);

    // Format to token balance - with safer implementation
    const formattedToBalance = useMemo(() => {
        if (!isConnected) return "N/A";
        if (isToBalanceLoading) return "Loading...";
        if (!toTokenBalance || !toTokenBalance.formatted) return "0";

        try {
            // Format balance to 4 decimal places for small numbers, use nFormatter for large numbers
            const balanceValue = parseFloat(toTokenBalance.formatted);
            if (isNaN(balanceValue)) return "0";

            if (balanceValue < 0.0001) {
                return "< 0.0001";
            } else if (balanceValue > 1000) {
                // Safely use nFormatter, or fall back to toFixed if nFormatter fails
                try {
                    return typeof nFormatter === 'function' ?
                        nFormatter(balanceValue, 2) :
                        balanceValue.toFixed(2);
                } catch (e) {
                    console.error("Error formatting with nFormatter:", e);
                    return balanceValue.toFixed(2);
                }
            } else {
                return balanceValue.toFixed(balanceValue < 1 ? 4 : 2);
            }
        } catch (error) {
            console.error("Error formatting balance:", error);
            return "0";
        }
    }, [isConnected, isToBalanceLoading, toTokenBalance]);

    // Update from token with balance when it changes
    useEffect(() => {
        if (fromTokenBalance && isConnected) {
            setFromToken(prev => ({
                ...prev,
                balance: formattedFromBalance
            }));
        }
    }, [formattedFromBalance, fromTokenBalance, isConnected]);

    // Update to token with balance when it changes
    useEffect(() => {
        if (toTokenBalance && isConnected) {
            setToToken(prev => ({
                ...prev,
                balance: formattedToBalance
            }));
        }
    }, [formattedToBalance, toTokenBalance, isConnected]);

    // Calculate USD values
    const fromTokenUsdValue = useMemo(() => {
        if (fromTokenPrice && fromAmount && !isNaN(parseFloat(fromAmount))) {
            return formatUsdPrice(fromTokenPrice.multipliedBy(fromAmount));
        }
        return null;
    }, [fromTokenPrice, fromAmount]);

    const toTokenUsdValue = useMemo(() => {
        if (toTokenPrice && toAmount && !isNaN(parseFloat(toAmount))) {
            return formatUsdPrice(toTokenPrice.multipliedBy(toAmount));
        }
        return null;
    }, [toTokenPrice, toAmount]);

    // Calculate rate based on token prices when available
    const exchangeRate = useMemo(() => {
        // First try to calculate from the actual amounts
        if (fromAmount && toAmount && !isNaN(parseFloat(fromAmount)) && !isNaN(parseFloat(toAmount))) {
            return formatRatio(parseFloat(toAmount) / parseFloat(fromAmount), 6);
        }

        // If we have token prices, use those as a more accurate rate
        if (fromTokenPrice && toTokenPrice) {
            // Exchange rate = toTokenPrice / fromTokenPrice
            const rate = toTokenPrice.dividedBy(fromTokenPrice);
            console.log(`Using price-based exchange rate: 1 ${fromToken.symbol} = ${rate} ${toToken.symbol}`);
            return formatRatio(rate, 6);
        }

        // Default fallback
        return "0.00";
    }, [fromAmount, toAmount, fromTokenPrice, toTokenPrice, fromToken.symbol, toToken.symbol]);

    // Token image hooks for improved token icon display
    const { logoUrl: fromTokenLogoUrl } = useTokenImage({
        address: fromToken.address,
        symbol: fromToken.symbol,
        network: fromNetwork
    });

    const { logoUrl: toTokenLogoUrl } = useTokenImage({
        address: toToken.address,
        symbol: toToken.symbol,
        network: toNetwork
    });

    return (
        <TooltipProvider>
            <div className={`flex flex-col ${isMobile ? "gap-4" : "lg:flex-row gap-6"} w-full max-w-6xl mx-auto`}>
                <div className={`w-full ${isMobile ? "" : "lg:w-2/3"}`}>
                    <div className="flex flex-col gap-6">
                        {/* Transaction Success Card */}
                        {showTxSuccess && (
                            <TransactionSuccess
                                txHash={lastTxHash}
                                fromToken={fromToken.symbol}
                                toToken={toToken.symbol}
                                fromNetwork={fromNetwork}
                                toNetwork={toNetwork}
                                visible={showTxSuccess}
                                onClose={() => setShowTxSuccess(false)}
                            />
                        )}

                        {/* Main Swap Card with proper wallet connection overlay */}
                        <Card className="w-full border border-slate-800 shadow-xl relative">
                            <CardContent className={isMobile ? "p-4" : "p-6"}>
                                {/* Wallet Connection Overlay */}
                                {!isConnected && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50 rounded-xl flex items-center justify-center">
                                        <Card className="w-auto max-w-sm mx-auto dark:border-0 dark:shadow-none">
                                            <CardContent className="p-6 text-center flex flex-col items-center">
                                                <Lock className="h-10 w-10 text-blue-400 mb-4" />
                                                <CardTitle className="text-xl mb-3 text-white">Connect Wallet</CardTitle>
                                                <CardDescription className="mb-6 text-slate-300">
                                                    Please connect your wallet to use the swap feature
                                                </CardDescription>
                                                <div className="w-full">
                                                    <ConnectButtonSwap
                                                        onSwap={() => { }}
                                                        isDisabled={false}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Title and Settings */}
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className={`font-medium text-slate-200 ${isMobile ? "text-lg" : "text-xl"}`}>Revoluzion Swap</h2>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`rounded-full hover:bg-slate-900 ${isMobile ? "h-7 w-7" : "h-8 w-8"}`}
                                            onClick={refreshQuotes}
                                            disabled={swapInProgress || loadingQuote || !fromAmount || parseFloat(fromAmount) <= 0}
                                            title="Refresh quotes"
                                        >
                                            <RefreshCw className={`${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} ${loadingQuote ? "animate-spin text-blue-400" : autoRefresh ? "text-blue-400" : "text-slate-400"}`} />
                                        </Button>
                                    </div>
                                </div>

                                {/* From token section */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-slate-400">From</div>
                                        <div className={`text-sm text-slate-400 ${isMobile ? "text-xs" : ""}`}>
                                            {fromToken.symbol} Balance: <span className="text-slate-300">{fromToken?.balance || "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="relative bg-slate-900 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            {/* Network display (read-only) */}
                                            <div className={`flex items-center ${isMobile ? "h-8" : "h-9"} gap-2 px-3 py-1 rounded-full bg-slate-700/30 border border-slate-700`}>
                                                <div className="flex items-center">
                                                    {fromNetwork && fromNetwork !== "select network" ? (
                                                        <div className="h-5 w-5 rounded-full overflow-hidden mr-1">
                                                            <IconImage
                                                                src={getNetworkIconPath(fromNetwork)}
                                                                alt={getNetworkName(fromNetwork)}
                                                                className="h-full w-full object-cover"
                                                                fallbackSrc="/assets/networks/default.svg"
                                                                key={`from-network-${fromNetwork}`}
                                                            />
                                                        </div>
                                                    ) : null}
                                                    <span className={`capitalize text-slate-200 ${isMobile ? "text-sm" : ""}`}>{fromNetwork && fromNetwork !== "select network" ? getNetworkName(fromNetwork) : "Network"}</span>
                                                </div>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`${isMobile ? "h-7 px-0 text-xs" : "h-8 px-0 text-slate-400"}`}
                                                onClick={() => setFromAmount(fromAmount ? "0" : "")}
                                            >
                                                {fromAmount ? "Clear" : ""}
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="relative flex-1">
                                                <Input
                                                    type="text"
                                                    value={fromAmount}
                                                    onChange={handleFromAmountChange}
                                                    className={`border-0 bg-transparent ${isMobile ? "text-xl" : "text-2xl"} font-medium focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 ${isMobile ? "h-10" : "h-12"}`}
                                                    placeholder="0.0"
                                                    disabled={swapInProgress}
                                                />

                                                {isConnected && fromTokenBalance && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-cyan-600 hover:bg-slate-700 text-white rounded px-2 py-0.5 ${isMobile ? "h-5 text-[10px]" : "h-6"}`}
                                                        onClick={() => {
                                                            // Set max amount from balance
                                                            setFromAmount(fromTokenBalance?.formatted || "0");
                                                        }}
                                                        disabled={swapInProgress || !fromTokenBalance || fromTokenBalance.value === BigInt(0)}
                                                    >
                                                        MAX
                                                    </Button>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className={`gap-2 rounded-full bg-slate-700/50 hover:bg-slate-700 ml-2 ${isMobile ? "h-10" : "h-12"}`}
                                                onClick={() => setIsFromSelectorOpen(true)}
                                                disabled={swapInProgress}
                                            >
                                                <div className="flex items-center">
                                                    {fromToken.symbol !== "Select token" && (
                                                        <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                                                            <IconImage
                                                                src={fromTokenLogoUrl || getTokenIconPath(fromToken.symbol, fromToken.address)}
                                                                alt={fromToken.symbol}
                                                                className="h-full w-full object-cover"
                                                                fallbackSrc={fromToken.image}
                                                                key={`from-token-${fromNetwork}-${fromToken.address}`}
                                                            />
                                                        </div>
                                                    )}
                                                    <span className={`${isMobile ? "text-base" : "text-lg"} font-medium`}>{fromToken.symbol}</span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>

                                        {/* Redesigned USD Value display for "from" token with total on left, price on right */}
                                        <div className={`${isMobile ? "text-xs" : "text-sm"} text-slate-400 mt-2 flex justify-between`}>
                                            {fromAmount && !isNaN(parseFloat(fromAmount)) ? (
                                                fromPriceLoading ? (
                                                    <div className="flex items-center">
                                                        <span>Total:</span>
                                                        <Loader2 className="h-3 w-3 animate-spin mx-1" />
                                                    </div>
                                                ) : fromTokenPrice ? (
                                                    <div>
                                                        <span>Total: </span>
                                                        <span className={`text-blue-400 font-medium ${isMobile ? "text-sm" : "text-base"}`}>{formatTokenPrice(fromTokenPrice.multipliedBy(fromAmount).toNumber())}</span>
                                                    </div>
                                                ) : (
                                                    <span>$ Unknown</span>
                                                )
                                            ) : ""}
                                        </div>
                                    </div>
                                </div>

                                {/* Switch button */}
                                <div className="flex justify-center my-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={`rounded-full bg-cyan-600/20 border-blue-500/20 hover:bg-cyan-600/30 ${isMobile ? "h-8 w-8" : ""}`}
                                        onClick={handleSwitchNetworksAndTokens}
                                        disabled={swapInProgress}
                                    >
                                        <ArrowDownUp className={`${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} text-blue-400`} />
                                    </Button>
                                </div>

                                {/* To token section */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-slate-400">To</div>
                                        <div className={`text-sm text-slate-400 ${isMobile ? "text-xs" : ""}`}>
                                            {toToken.symbol} Balance: <span className="text-slate-300">{toToken?.balance || "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="relative bg-slate-900 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            {/* Network display (read-only) */}
                                            <div className={`flex items-center ${isMobile ? "h-8" : "h-9"} gap-2 px-3 py-1 rounded-full bg-slate-700/30 border border-slate-700`}>
                                                <div className="flex items-center">
                                                    {toNetwork && toNetwork !== "select network" ? (
                                                        <div className="h-5 w-5 rounded-full overflow-hidden mr-1">
                                                            <IconImage src={getNetworkIconPath(toNetwork)}
                                                                alt={getNetworkName(toNetwork)}
                                                                className="h-full w-full object-cover"
                                                                fallbackSrc="/assets/networks/default.svg"
                                                                key={`to-network-${toNetwork}`}
                                                            />
                                                        </div>
                                                    ) : null}
                                                    <span className={`capitalize text-slate-200 ${isMobile ? "text-sm" : ""}`}>{toNetwork && toNetwork !== "select network" ? getNetworkName(toNetwork) : "Network"}</span>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="flex items-center justify-between">
                                            {loadingQuote ? (
                                                <div className={`flex items-center ${isMobile ? "text-sm" : "text-base"} font-bold text-green-400`}>
                                                    <Loader2 className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} animate-spin mr-1 text-green`} />
                                                    Fetching best price...
                                                </div>
                                            ) : (
                                                <Input
                                                    type="text"
                                                    value={toAmount}
                                                    readOnly
                                                    className={`border-0 bg-transparent ${isMobile ? "text-xl" : "text-2xl"} font-medium focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 ${isMobile ? "h-10" : "h-12"}`}
                                                    placeholder="0.0"
                                                />
                                            )}
                                            <Button
                                                variant="ghost"
                                                className={`gap-2 rounded-full bg-slate-700/50 hover:bg-slate-700 ${isMobile ? "h-10" : "h-12"}`}
                                                onClick={() => setIsToSelectorOpen(true)}
                                                disabled={swapInProgress}
                                            >
                                                <div className="flex items-center">
                                                    {toToken.symbol !== "Select token" && (
                                                        <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                                                            <IconImage
                                                                src={toTokenLogoUrl || getTokenIconPath(toToken.symbol, toToken.address)}
                                                                alt={toToken.symbol}
                                                                className="h-full w-full object-cover"
                                                                fallbackSrc={toToken.image}
                                                                key={`to-token-${toNetwork}-${toToken.address}`}
                                                            />
                                                        </div>
                                                    )}
                                                    <span className={`${isMobile ? "text-base" : "text-lg"} font-medium`}>{toToken.symbol}</span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>

                                        {/* Redesigned USD Value display */}
                                        <div className={`${isMobile ? "text-xs" : "text-sm"} text-slate-400 mt-2 flex justify-between`}>
                                            {toAmount && !isNaN(parseFloat(toAmount)) && toTokenPrice ? (
                                                toPriceLoading ? (
                                                    <div className="flex items-center">
                                                        <span>Value:</span>
                                                        <Loader2 className="h-3 w-3 animate-spin mx-1" />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span>Value: </span>
                                                        <span className={`text-blue-400 font-medium ${isMobile ? "text-sm" : "text-base"}`}>{formatTokenPrice(toTokenPrice.multipliedBy(toAmount).toNumber())}</span>
                                                    </div>
                                                )
                                            ) : ""}
                                        </div>
                                    </div>
                                </div>

                                {/* Display quote error if any */}
                                {quoteError && (
                                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-red-400 mt-0.5`} />
                                            <div>
                                                <p className="text-red-400 font-medium">Quote Error</p>
                                                <p className={`${isMobile ? "text-xs" : "text-sm"} text-red-300`}>{quoteError}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Transaction info */}
                                {fromAmount && toAmount && bestTrade && (
                                    <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div className={`${isMobile ? "text-xs" : "text-sm"} text-slate-300`}>Rate</div>
                                            <div className={`${isMobile ? "text-xs" : "text-sm"} font-medium text-slate-200`}>
                                                1 {fromToken.symbol} ≈ {exchangeRate} {toToken.symbol}
                                            </div>
                                        </div>

                                        {/* Add price impact if available */}
                                        {bestTrade.priceImpact !== undefined && (
                                            <div className="flex justify-between items-center mt-2">
                                                <div className={`${isMobile ? "text-xs" : "text-sm"} text-slate-300`}>Price Impact</div>
                                                <div className={`${isMobile ? "text-xs" : "text-sm"} font-medium ${bestTrade.priceImpact < 0.01 ? "text-emerald-400" :
                                                    bestTrade.priceImpact < 1 ? "text-green-400" :
                                                        bestTrade.priceImpact < 4 ? "text-yellow-400" :
                                                            "text-red-400"
                                                    }`}>
                                                    {bestTrade.priceImpact < 0.01 ? "< 0.01%" : formatPercentage(bestTrade.priceImpact)}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-2">
                                            <div className={`${isMobile ? "text-xs" : "text-sm"} text-slate-300`}>
                                                Minimum Received
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className={`${isMobile ? "h-2.5 w-2.5" : "h-3 w-3"} inline ml-1 text-slate-400`} />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-xs max-w-xs">
                                                            Your transaction will revert if the price changes unfavorably by more than this percentage.
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <div className={`${isMobile ? "text-xs" : "text-sm"} font-medium text-slate-200`}>
                                                {minimumAmountReceived} {toToken.symbol}
                                            </div>
                                        </div>

                                        {fromNetwork !== toNetwork && (
                                            <div className="flex justify-between items-center mt-2">
                                                <div className={`${isMobile ? "text-xs" : "text-sm"} text-slate-300`}>
                                                    Estimated Time
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className={`${isMobile ? "h-2.5 w-2.5" : "h-3 w-3"} inline ml-1 text-slate-400`} />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="text-xs max-w-xs">
                                                                Estimated time for this cross-chain transaction to complete.
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                                <div className={`${isMobile ? "text-xs" : "text-sm"} font-medium text-slate-200`}>
                                                    2-5 minutes
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Slippage Controls */}
                                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className={`${isMobile ? "text-xs" : "text-sm"} text-slate-300 flex items-center`}>
                                            Slippage Tolerance
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className={`${isMobile ? "h-2.5 w-2.5" : "h-3 w-3"} inline ml-1 text-slate-400`} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs max-w-xs">
                                                        Your transaction will revert if the price changes unfavorably by more than this percentage.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <span className={`text-slate-200 ${isMobile ? "text-xs" : ""}`}>{formattedSlippage}%</span>
                                        </div>
                                    </div>

                                    {/* Slippage slider */}
                                    <div className="mb-3">
                                        <div className="flex items-center">
                                            <Slider
                                                defaultValue={[slippage]}
                                                value={[slippage]}
                                                min={0.1}
                                                max={49}
                                                step={0.1}
                                                disabled={autoSlippage || swapInProgress}
                                                onValueChange={([value]) => {
                                                    setSlippage(value);
                                                    setCustomSlippage(value.toString());
                                                }}
                                                className="flex-1"
                                            />
                                        </div>
                                        <div className={`flex justify-between ${isMobile ? "text-[10px]" : "text-xs"} text-slate-400 mt-1`}>
                                            <span>0.1%</span>
                                            <span>49%</span>
                                        </div>
                                    </div>

                                    {/* Auto-slippage toggle */}
                                    <div className="flex items-center justify-between mb-3">
                                        <Label htmlFor="auto-slippage" className={`${isMobile ? "text-xs" : "text-sm"} text-slate-300`}>Auto slippage</Label>
                                        <Switch
                                            key={`auto-slippage-${autoSlippage}`}
                                            id="auto-slippage"
                                            checked={autoSlippage}
                                            onCheckedChange={(checked) => {
                                                setAutoSlippage(checked);
                                                if (checked) {
                                                    // Set to default value when auto slippage is enabled
                                                    setSlippage(49);
                                                    setCustomSlippage("49");

                                                    // Force re-render after slight delay
                                                    setTimeout(() => {
                                                        setAutoSlippage(true);
                                                    }, 0);
                                                } else {
                                                    // Also reset to default value when auto slippage is disabled
                                                    setSlippage(1.5);
                                                    setCustomSlippage("1.5");
                                                }
                                            }}
                                            disabled={swapInProgress}
                                        />
                                    </div>

                                    {/* Warning for high slippage */}
                                    {parseFloat(formattedSlippage) > 5 && (
                                        <div className="flex items-start gap-2 text-blue-400 bg-blue-900/20 p-2 rounded mt-2">
                                            <AlertCircle className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mt-0.5`} />
                                            <div className={`${isMobile ? "text-[10px]" : "text-xs"}`}>
                                                Your transaction may be frontrun due to high slippage tolerance.
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Consolidated Error Display */}
                                {(quoteError || insufficientFundsError || swapErrorMessage) && (
                                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-red-400 mt-0.5`} />
                                            <div>
                                                <p className={`text-red-400 font-medium ${isMobile ? "text-xs" : ""}`}>
                                                    {insufficientFundsError ? "Insufficient Funds" :
                                                        quoteError ? "Quote Error" :
                                                            swapErrorMessage.includes("Updated rates") ? "Price Updated" :
                                                                swapErrorMessage.includes("slippage") ? "Slippage Error" :
                                                                    swapErrorMessage.includes("gas") ? "Gas Error" :
                                                                        swapErrorMessage.includes("liquidity") ? "Liquidity Error" :
                                                                            swapErrorMessage.includes("rejected") ? "User Rejected" :
                                                                                swapErrorMessage.includes("timeout") ? "Transaction Timeout" :
                                                                                    swapErrorMessage.includes("network") ? "Network Error" :
                                                                                        swapErrorMessage.includes("route") ? "Route Error" :
                                                                                            "Swap Error"}
                                                </p>
                                                <p className={`${isMobile ? "text-xs" : "text-sm"} text-red-300`}>
                                                    {insufficientFundsError || quoteError || swapErrorMessage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Token Approval Risk Card */}
                                {needsApproval && bestTrade && fromAmount && toAmount && (
                                    <div className="mt-4 p-3 bg-teal-900/20 border border-blue-500/20 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <Info className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} text-blue-400 mt-0.5`} />
                                            <div>
                                                <p className={`text-blue-400 font-medium ${isMobile ? "text-xs" : ""}`}>Token Approval Required</p>
                                                <p className={`${isMobile ? "text-xs" : "text-sm"} text-blue-300`}>
                                                    You'll need to approve {fromToken.symbol} for swapping first. This is a one-time approval for this token.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Swap button */}
                                <Button
                                    className={`w-full ${isMobile ? "h-12 text-sm mt-3" : "h-14 text-base mt-4"} bg-teal-500/90 hover:bg-slate-700 text-white font-medium`}
                                    disabled={!bestTrade || !fromAmount || !toAmount || swapInProgress || loadingQuote}
                                    onClick={handleSwap}
                                >
                                    {swapInProgress ? (
                                        <div className="flex items-center">
                                            <Loader2 className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} animate-spin mr-2`} />
                                            Swapping...
                                        </div>
                                    ) : loadingQuote ? (
                                        <>
                                            <Loader2 className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} animate-spin mr-2`} />
                                            Calculating best route...
                                        </>
                                    ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
                                        "Enter an amount"
                                    ) : !bestTrade ? (
                                        "Select network & token"
                                    ) : insufficientFundsError ? (
                                        "Insufficient Funds"
                                    ) : (
                                        `Swap ${fromToken.symbol} for ${toToken.symbol}`
                                    )}
                                </Button>

                                {/* Security badges */}
                                <div className={`flex items-center justify-between ${isMobile ? "gap-2 mt-3" : "gap-4 mt-4"}`}>
                                    <div className={`flex items-center ${isMobile ? "text-[10px]" : "text-xs"} text-slate-400`}>
                                        <Lock className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1 text-blue-400`} />
                                        Secured by Revoluzion
                                    </div>
                                    <div className={`flex items-center ${isMobile ? "text-[10px]" : "text-xs"} text-slate-400`}>
                                        <ShieldCheck className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1 text-blue-400`} />
                                        Protected by GoPlusLabs
                                    </div>
                                    <div className={`flex items-center ${isMobile ? "text-[10px]" : "text-xs"} text-slate-400`}>
                                        <ShieldCheck className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} mr-1 text-blue-400`} />
                                        Powered by Rubic
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>

                {/* Right panel - History/Support buttons and Trade route visualization */}
                <div className={`w-full ${isMobile ? "" : "lg:w-1/3"} space-y-4`}>
                    {/* History and Support buttons - make them more compact on mobile */}
                    <ActionButtons
                        onHistoryClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        onGuideClick={() => setIsGuideOpen(!isGuideOpen)}
                        onSupportClick={handleSupportClick}
                        isHistoryOpen={isHistoryOpen}
                        isGuideOpen={isGuideOpen}
                    />

                    {/* Wallet History Panel */}
                    <WalletHistoryPanel
                        isOpen={isHistoryOpen}
                        onOpenChange={setIsHistoryOpen}
                    />

                    {/* Guide Dialog */}
                    <GuideDialog
                        open={isGuideOpen}
                        onOpenChange={setIsGuideOpen}
                    />

                    {bestTrade && fromAmount && toAmount ? (
                        <>
                            <TradeRoute
                                sourceNetwork={fromNetwork}
                                sourceToken={fromToken.symbol}
                                destinationNetwork={toNetwork}
                                destinationToken={toToken.symbol}
                                providers={selectedProvider ? [selectedProvider] : routeProviders}
                                sourceAmount={`${fromAmount} ${fromToken.symbol}`}
                                destinationAmount={`${toAmount} ${toToken.symbol}`}
                                sourceTokenImage={fromToken.image}
                                destinationTokenImage={toToken.image}
                                gasFee={formatGasFeeDisplay(bestTrade, fromNetwork !== toNetwork)}
                                estimatedTime={fromNetwork !== toNetwork ? "2-5 min" : "~1 min"}
                                availableRoutes={trades.map((trade, index) => ({
                                    provider: trade.type || trade.tradeType || "unknown",
                                    gasPrice: formatGasFeeDisplay(trade, fromNetwork !== toNetwork),
                                    estimatedTime: fromNetwork !== toNetwork ? "2-5 min" : "~1 min",
                                    outputAmount: trade.to?.tokenAmount?.toFormat(6) ||
                                        (trade.trade && trade.trade.to?.tokenAmount?.toFormat(6)) ||
                                        toAmount,
                                    selected: trade === bestTrade
                                }))}
                                onRouteSelect={handleRouteSelect}
                            />
                        </>
                    ) : (
                        <Card className="border border-slate-800 bg-teal-900/60 shadow-lg">
                            <CardContent className={`${isMobile ? "p-4" : "p-6"} text-center`}>
                                <div className="flex flex-col items-center justify-center h-48">
                                    <div className="h-12 w-12 rounded-full bg-teal-900/20 flex items-center justify-center mb-4">
                                        <ArrowRight className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-slate-300 font-medium mb-2">Route Preview</h3>
                                    <p className={`${isMobile ? "text-xs" : "text-sm"} text-slate-400`}>
                                        Enter an amount above to see your transaction route details
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>                
                {/* Unified Token Selector dialogs */}
                <UnifiedTokenSelector
                    isOpen={isFromSelectorOpen}
                    onClose={() => setIsFromSelectorOpen(false)}
                    currentNetwork={fromNetwork}
                    selectedTokenAddress={fromToken.address}
                    onSelectNetworkAndToken={handleFromNetworkTokenSelect}
                    title="Select Source Chain and Token"
                    description="Choose the blockchain network and token you want to swap from"
                />

                <UnifiedTokenSelector
                    isOpen={isToSelectorOpen}
                    onClose={() => setIsToSelectorOpen(false)}
                    currentNetwork={toNetwork}
                    selectedTokenAddress={toToken.address}
                    onSelectNetworkAndToken={handleToNetworkTokenSelect}
                    title="Select Destination Chain and Token"
                    description="Choose the blockchain network and token you want to receive"
                />

                {/* Swap Progress Modal */}
                <SwapProgressModal
                    open={showSwapProgressModal}
                    onOpenChange={setShowSwapProgressModal}
                    fromToken={{
                        symbol: fromToken.symbol,
                        address: fromToken.address,
                    }}
                    toToken={{
                        symbol: toToken.symbol,
                        address: toToken.address,
                    }}
                    fromNetwork={fromNetwork}
                    toNetwork={toNetwork}
                    fromAmount={fromAmount}
                    toAmount={toAmount}
                    status={swapProgressStatus}
                    provider={swapProvider}
                    txHash={swapTxHash}
                    errorMessage={swapErrorMessage}
                    autoClose={true}
                    isApprovalPhase={isApprovalPhase}
                    approvalTxHash={approvalTxHash}
                />
            </div>
        </TooltipProvider>
    );
}
