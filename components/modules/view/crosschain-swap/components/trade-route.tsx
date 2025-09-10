"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Zap, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getTokenIconPath, getNetworkIconPath, IconImage } from "@/lib/icon-utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface TradeRouteProps {
    sourceNetwork: string;
    sourceToken: string;
    destinationNetwork: string;
    destinationToken: string;
    providers?: string[];
    sourceAmount?: string;
    destinationAmount?: string;
    sourceTokenAddress?: string; // Added to properly identify tokens
    destinationTokenAddress?: string; // Added to properly identify tokens
    // Keeping these for backward compatibility but will prioritize using addresses/symbols
    sourceTokenImage?: string; 
    destinationTokenImage?: string;
    gasFee?: string;          // Added property for dynamic gas fee
    estimatedTime?: string;   // Added property for dynamic transaction time
    availableRoutes?: Array<{  // Added property for all possible routes
        provider: string;
        gasPrice?: string;
        estimatedTime?: string;
        outputAmount?: string;
        selected?: boolean;
    }>;
    onRouteSelect?: (provider: string) => void;  // Added callback for route selection
}

export default function TradeRoute({
    sourceToken,
    destinationToken,
    providers = [],
    sourceAmount,
    destinationAmount,
    sourceTokenImage,
    destinationTokenImage,
    sourceTokenAddress,
    destinationTokenAddress,
    gasFee = "N/A", // Default to N/A if not provided
    estimatedTime = "N/A", // Default to N/A if not provided
    availableRoutes = [],
    onRouteSelect,
    sourceNetwork,
    destinationNetwork
}: TradeRouteProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [showPulse, setShowPulse] = useState(false);
    const [showRouteDialog, setShowRouteDialog] = useState(false);
    const isMobile = useIsMobile();

    // Display the first provider from the list or use providers[0]
    const displayProvider = providers && providers.length > 0 ? getProviderName(providers[0]) : "Symbiosis";
        
    // Format dynamic values with fallbacks
    const displayGasFee = gasFee && gasFee !== "N/A" ? gasFee : "N/A";
    const displayEstimatedTime = estimatedTime && estimatedTime !== "N/A" ? estimatedTime : "N/A";

    useEffect(() => {
        // Start animations
        setIsAnimating(true);

        // Pulse effect timing
        const pulseInterval = setInterval(() => {
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 1000);
        }, 3000);

        return () => {
            clearInterval(pulseInterval);
        };
    }, []);

    // Provider name mapping
    function getProviderName(provider: string): string {
        // Map provider names to user-friendly display names
        const providerMap: Record<string, string> = {
            "SYMBIOSIS": "Symbiosis",
            "SQUID": "Squid",
            "RANGO": "Rango",
            "LI_ROUTER": "Li.Fi",
            "XY": "XY Finance",
            "DEBRIDGE": "DeBridge",
            "MULTICHAIN": "Multichain",
            "CHANGENOW": "ChangeNOW",
            "STARGATE": "Stargate",
            "THORCHAIN": "ThorChain"
        };
        
        return providerMap[provider] || provider;
    }

    return (
        <Card className="border border-slate-800 bg-gradient-to-b from-[#050714] to-[#0a0e1c] shadow-2xl rounded-xl overflow-hidden">
            <CardContent className="p-5 relative">
                {/* Background glow effect */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl"></div>

                <div className="mb-5 relative z-10">
                    <div className="text-base font-medium text-white flex items-center">
                        Trade route
                        <span className="ml-2 px-2 py-0.5 text-xs bg-slate-500/10 text-slate-400 rounded-full border border-slate-500/20">
                            Cross-Chain
                        </span>
                    </div>
                    <div className="text-xs text-slate-500">Best rate selected automatically</div>
                </div>

                {/* Vertical amber line with lightning effect */}
                <div className={`relative flex flex-col items-center pt-1 pb-4 ${isMobile ? "min-h-[300px]" : "min-h-[400px]"}`}>
                    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 300 440" preserveAspectRatio="none" style={{ zIndex: 0 }}>
                        <defs>
                            {/* Slate gradient */}
                            <linearGradient id="slateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#64748b" />
                                <stop offset="50%" stopColor="#334155" />
                                <stop offset="100%" stopColor="#94a3b8" />
                            </linearGradient>
                        </defs>

                        {/* Main slate path connecting the tokens */}
                        <motion.path
                            d="M150,80 L150,360"
                            fill="none"
                            stroke="url(#slateGradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5 }}
                        />

                        {/* Lightning/Zap effect along the path */}
                        {showPulse && (
                            <>
                                {/* Enhanced dynamic lightning zigzag effect with randomization */}
                                <motion.path
                                    d={`M150,80 L${145 + Math.random() * 15},115 L${155 - Math.random() * 20},150 L${145 + Math.random() * 20},185 L${155 - Math.random() * 20},220 L${145 + Math.random() * 25},255 L${155 - Math.random() * 20},290 L${145 + Math.random() * 20},325 L150,360`}
                                    fill="none"
                                    stroke="#94a3b8"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: [0, 0.9, 1, 0.9, 0]
                                    }}
                                    transition={{
                                        duration: 1 + Math.random() * 0.5
                                    }}
                                />

                                {/* Bright flash along the line with varied timing */}
                                <motion.path
                                    d="M150,80 L150,360"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 0.6 + Math.random() * 0.4,
                                        delay: Math.random() * 0.3
                                    }}
                                />

                                {/* Secondary lightning bolt effect with varied path */}
                                <motion.path
                                    d={`M150,80 L${154 + Math.random() * 8},140 L${146 - Math.random() * 10},180 L${158 + Math.random() * 10},240 L${142 - Math.random() * 12},300 L150,360`}
                                    fill="none"
                                    stroke="#f8fafc"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="miter"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: [0, 0.8, 0]
                                    }}
                                    transition={{
                                        duration: 0.5 + Math.random() * 0.4,
                                        delay: 0.1 + Math.random() * 0.3
                                    }}
                                />
                            </>
                        )}
                    </svg>

                    {/* Source Token */}
                    <motion.div
                        className="flex flex-col items-center z-10 mb-16"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ zIndex: 1 }}
                    >
                        <div className="relative">
                            {/* Token icon with premium styling */}
                            <div className="h-18 w-18 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 p-1 border border-slate-700/50 relative z-10 flex items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center p-0.5 backdrop-blur-sm">
                                    <IconImage
                                        src={getTokenIconPath(sourceToken, sourceTokenAddress)}
                                        alt={sourceToken}
                                        className="h-12 w-12 rounded-full"
                                        fallbackSrc={getNetworkIconPath(sourceNetwork)}
                                    />
                                </div>
                            </div>

                            {/* Animated concentric rings effect */}
                            {showPulse && (
                                <AnimatePresence>
                                    <motion.div
                                        className="absolute inset-0 rounded-full border border-slate-500/40"
                                        initial={{ scale: 1, opacity: 1 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                    ></motion.div>
                                </AnimatePresence>
                            )}
                        </div>

                        <div className="text-sm font-medium text-white mt-3">
                            <span className="font-mono">{sourceAmount || `0.00001 ${sourceToken}`}</span>
                        </div>

                        <div className="text-xs text-slate-400 mt-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">100%</div>
                    </motion.div>

                    {/* Center Exchange Card */}
                    <motion.div
                        className="z-10 bg-slate-950/10 border border-slate-700/30 rounded-2xl px-6 py-4 flex flex-col items-center mb-16 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-sm"
                        style={{ width: "min(100%, 240px)", zIndex: 1 }}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <div className="flex items-center justify-center mb-2.5">
                            <div className="relative w-full">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-[#1a1d29] flex items-center justify-center mr-3 border border-slate-700/50 shadow-md">
                                        <IconImage
                                            src={getTokenIconPath(sourceToken, sourceTokenAddress)}
                                            alt={sourceToken}
                                            className="h-5 w-5 rounded-full"
                                            fallbackSrc={getNetworkIconPath(sourceNetwork)}
                                        />
                                    </div>
                                    <span className="text-white text-base font-medium uppercase">{sourceToken}</span>

                                    <Zap className="text-[#94a3b8] h-5 w-5 mx-2 transform rotate-90" />

                                    <span className="text-white text-base font-medium uppercase">{destinationToken}</span>
                                    <div className="h-8 w-8 rounded-full bg-[#1a1d29] flex items-center justify-center ml-3 border border-slate-700/50 shadow-md">
                                        <IconImage
                                            src={getTokenIconPath(destinationToken, destinationTokenAddress)}
                                            alt={destinationToken}
                                            className="h-5 w-5 rounded-full"
                                            fallbackSrc={getNetworkIconPath(destinationNetwork)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-3 mb-2 p-1.5 bg-slate-500/10 rounded-full shadow-inner">
                            <div className="px-4 py-1 rounded-full bg-gradient-to-r from-slate-600/20 to-slate-500/20 border border-slate-500/20">
                                <span className="text-slate-400 text-xs font-bold tracking-wide uppercase flex items-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="mr-1.5 h-2 w-2 rounded-full bg-slate-400"
                                    ></motion.div>
                                    {displayProvider}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full mt-3">
                            <div className="flex items-center">
                                <div className="text-xs text-slate-400">Est. Time:</div>
                                <div className="ml-1.5 text-xs bg-slate-500/10 text-slate-300 rounded px-1.5 py-0.5 font-medium">{displayEstimatedTime}</div>
                            </div>
                            <div className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-500/10 rounded-full">100%</div>
                        </div>
                    </motion.div>

                    {/* Destination Token */}
                    <motion.div
                        className="flex flex-col items-center z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="relative">
                            {/* Token outer glow effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-500/20 to-slate-600/20 blur-md"></div>

                            {/* Token icon with premium styling */}
                            <div className="h-18 w-18 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 p-1 border border-slate-700/50 shadow-xl relative z-10 flex items-center justify-center">
                                <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center p-0.5 backdrop-blur-sm">
                                    <IconImage
                                        src={getTokenIconPath(destinationToken, destinationTokenAddress)}
                                        alt={destinationToken}
                                        className="h-12 w-12 rounded-full drop-shadow-md"
                                        fallbackSrc={getNetworkIconPath(destinationNetwork)}
                                    />
                                </div>
                            </div>

                            {/* Animated concentric rings effect */}
                            {showPulse && (
                                <AnimatePresence>
                                    <motion.div
                                        className="absolute inset-0 rounded-full border border-slate-500/40"
                                        initial={{ scale: 1, opacity: 1 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                    ></motion.div>
                                </AnimatePresence>
                            )}
                        </div>

                        <motion.div
                            className="text-sm font-medium text-white mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="font-mono">{destinationAmount || `0.000279 ${destinationToken}`}</span>
                        </motion.div>

                        <div className="text-xs text-slate-400 mt-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">100%</div>
                    </motion.div>
                </div>

                {/* Stats and details footer */}
                <motion.div
                    className="flex flex-wrap justify-center items-center gap-3 mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/30 flex items-center shadow-lg">
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                        <span className="text-xs text-slate-300">Gas: <span className="text-white font-medium">{displayGasFee}</span></span>
                    </div>

                    <Button 
                        className="flex items-center text-xs text-amber-300 hover:text-amber-200 transition-colors duration-200 cursor-pointer bg-amber-900/20 px-3 py-1.5 h-auto rounded-full border border-amber-500/20"
                        onClick={() => setShowRouteDialog(true)}
                        variant="ghost"
                    >
                        <ExternalLink className="h-3 w-3 mr-1.5" />
                        <span>Select route</span>
                    </Button>
                </motion.div>

                {/* Network status indicator */}
                <div className="absolute top-5 right-4 flex items-center gap-1.5">
                    <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        <div className="flex h-2 w-2 mr-1 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] text-slate-500">Live</span>
                    </motion.div>
                </div>
            </CardContent>

            {/* Route Selection Dialog */}
            <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
                <DialogContent className="bg-slate-900 border-slate-700 max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100">Select Route</DialogTitle>
                        <DialogDescription>
                            Choose the best route for your {sourceToken} to {destinationToken} swap
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[400px] pr-4">
                        <div className="space-y-2 mt-2">
                            {/* If available routes were provided, display them */}
                            {availableRoutes && availableRoutes.length > 0 ? (
                                availableRoutes.map((route, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg border ${route.selected 
                                            ? 'border-amber-500 bg-amber-900/10'
                                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                        } transition-colors duration-200 cursor-pointer`}
                                        onClick={() => {
                                            if (onRouteSelect) {
                                                onRouteSelect(route.provider);
                                            }
                                            setShowRouteDialog(false);
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600/50 mr-3">
                                                    <span className="text-sm font-semibold">{getProviderName(route.provider).charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <div className="text-slate-100 font-medium text-sm">{getProviderName(route.provider)}</div>
                                                    <div className="flex items-center mt-1 text-xs space-x-3">
                                                        <span className="text-slate-400 flex items-center">
                                                            <span className="h-1.5 w-1.5 bg-amber-400 rounded-full mr-1"></span>
                                                            Gas: <span className="text-slate-200 ml-0.5">{route.gasPrice}</span>
                                                        </span>
                                                        <span className="text-slate-400 flex items-center">
                                                            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full mr-1"></span>
                                                            Time: <span className="text-slate-200 ml-0.5">{route.estimatedTime}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {route.selected ? (
                                                <Badge className="bg-amber-500 text-black text-xs px-2 py-0.5 h-auto">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Selected
                                                </Badge>
                                            ) : (
                                                <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded flex items-center">
                                                    <span className="text-slate-200 font-medium">{route.outputAmount}</span>
                                                    <span className="ml-1">{destinationToken}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 rounded-lg border border-slate-700 bg-slate-800/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600/50 mr-3">
                                                <span className="text-sm font-semibold">{displayProvider.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <div className="text-slate-100 font-medium text-sm">{displayProvider}</div>
                                                <div className="flex items-center mt-1 text-xs space-x-3">
                                                    <span className="text-slate-400 flex items-center">
                                                        <span className="h-1.5 w-1.5 bg-amber-400 rounded-full mr-1"></span>
                                                        Gas: <span className="text-slate-200 ml-0.5">{displayGasFee}</span>
                                                    </span>
                                                    <span className="text-slate-400 flex items-center">
                                                        <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full mr-1"></span>
                                                        Time: <span className="text-slate-200 ml-0.5">{displayEstimatedTime}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded flex items-center">
                                            <span className="text-slate-200">Best Available</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </Card>
    );
}