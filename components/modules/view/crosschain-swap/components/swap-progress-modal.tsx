"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, Zap, Check } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useTokenImage } from "../hooks/use-token-image";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";

interface SwapProgressModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fromToken: {
        symbol: string;
        address: string;
    };
    toToken: {
        symbol: string;
        address: string;
    };
    fromNetwork: string;
    toNetwork: string;
    fromAmount: string;
    toAmount: string;
    status: "pending" | "success" | "error";
    provider?: string;
    txHash?: string;
    errorMessage?: string;
    autoClose?: boolean;
    isApprovalPhase?: boolean;
    approvalTxHash?: string;
}

export default function SwapProgressModal({
    open,
    onOpenChange,
    fromToken,
    toToken,
    fromNetwork,
    toNetwork,
    fromAmount,
    toAmount,
    status,
    provider,
    txHash,
    errorMessage,
    autoClose = true,
    isApprovalPhase = false,
    approvalTxHash
}: SwapProgressModalProps) {
    const isMobile = useIsMobile();
    // State for animation and UI control
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [progressStage, setProgressStage] = useState<'approval' | 'swap' | 'complete'>('approval');
    const [animateTransition, setAnimateTransition] = useState(false);
    const isCrossChain = fromNetwork !== toNetwork;

    // Use the token image hook to get token logos
    const { logoUrl: fromTokenLogo } = useTokenImage({
        address: fromToken.address,
        symbol: fromToken.symbol,
        network: fromNetwork
    });

    const { logoUrl: toTokenLogo } = useTokenImage({
        address: toToken.address,
        symbol: toToken.symbol,
        network: toNetwork
    });

    // Manage modal state transitions
    useEffect(() => {
        // Reset states when modal opens
        if (open) {
            setProgressStage(isApprovalPhase ? 'approval' : 'swap');
            setShowCloseButton(false);
            setShowSuccess(false);
            setAnimateTransition(false);
        }
    }, [open, isApprovalPhase]);

    // Handle status transitions
    useEffect(() => {
        // When approval phase ends, animate to swap phase
        if (isApprovalPhase === false && progressStage === 'approval') {
            setAnimateTransition(true);
            const transitionTimer = setTimeout(() => {
                setProgressStage('swap');
                setAnimateTransition(false);
            }, 800);
            return () => clearTimeout(transitionTimer);
        }

        // Handle success state
        if (status === "success") {
            setProgressStage('complete');
            setShowSuccess(true);

            // Auto-close on success with a delay
            if (autoClose) {
                const timer = setTimeout(() => {
                    onOpenChange(false);
                }, 3000);
                return () => clearTimeout(timer);
            }
        }

        // Handle error state
        if (status === "error") {
            setShowCloseButton(true);
        }
    }, [status, autoClose, onOpenChange, progressStage, isApprovalPhase]);

    // Lightning animation paths
    const lightningPaths = [
        "M15,0 L8,16 L16,16 L2,32",
        "M12,0 L6,12 L18,16 L0,32",
        "M18,0 L10,14 L20,18 L4,32"
    ];

    // Get appropriate title and description based on current state
    const modalTitle = (() => {
        if (isApprovalPhase) return "Token Approval";
        if (status === "pending") return "Swap in Progress";
        if (status === "success") return "Swap Successful";
        if (status === "error") return "Swap Failed";
        return "Processing Transaction";
    })();

    const modalDescription = (() => {
        if (isApprovalPhase) return `Approving ${fromToken.symbol} for trading`;
        if (status === "pending") return isCrossChain ? "Cross-chain swap in progress, this may take a few minutes" : "Please wait while your transaction is being processed";
        if (status === "success") return "Your transaction has been confirmed";
        if (status === "error") return "There was an error processing your transaction";
        return "Processing your transaction";
    })();

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            // Prevent closing on backdrop click during pending state
            if (status === "pending" && open === true && newOpen === false) {
                return;
            }
            onOpenChange(newOpen);
        }}>            <DialogContent className={`${isMobile ? 'max-w-[95vw] p-4' : 'sm:max-w-md p-6'} bg-slate-900 border-slate-800 text-slate-100`}>
                <DialogHeader>
                    <DialogTitle className={`text-center ${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-slate-100`}>
                        {modalTitle}
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-400">
                        {modalDescription}
                    </DialogDescription>
                </DialogHeader>

                <div className={`flex flex-col items-center justify-center ${isMobile ? 'py-2' : 'py-4'}`}>
                    {/* Token swap visualization */}
                    <div className="flex items-center justify-center mb-6 w-full">
                        <div className="flex flex-col items-center">
                            <motion.div
                                className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} rounded-full bg-slate-800 flex items-center justify-center mb-1 relative overflow-hidden`}
                                animate={isApprovalPhase ? { scale: [1, 1.05, 1], borderColor: ["rgba(59, 130, 246, 0.5)", "rgba(59, 130, 246, 0.8)", "rgba(59, 130, 246, 0.5)"] } : {}}
                                transition={isApprovalPhase ? { repeat: Infinity, duration: 1.5 } : {}}
                            >
                                {fromTokenLogo ? (
                                    <Image
                                        src={fromTokenLogo}
                                        alt={fromToken.symbol}
                                        className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full`}
                                        width={isMobile ? 32 : 40}
                                        height={isMobile ? 32 : 40}
                                    />
                                ) : (
                                    <div className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400`}>
                                        {fromToken.symbol.slice(0, 3)}
                                    </div>
                                )}
                                {/* Add lock icon overlay for approval phase */}
                                <AnimatePresence>
                                    {isApprovalPhase && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center"
                                        >
                                            <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            <span className="text-sm font-medium text-slate-300">{fromToken.symbol}</span>
                            <span className="text-xs text-slate-400">{fromAmount}</span>
                        </div>

                        {/* Middle animation section */}
                        <div className="mx-4 w-32 h-16 relative">
                            {/* Path line */}
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/40 via-blue-400/60 to-blue-500/40 transform -translate-y-1/2"></div>

                            {/* Lightning animations */}
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <AnimatePresence>
                                    {status === "pending" && (
                                        <>
                                            {lightningPaths.map((path, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="absolute"
                                                    initial={{
                                                        x: "-100%",
                                                        opacity: 0
                                                    }}
                                                    animate={{
                                                        x: "100%",
                                                        opacity: [0, 1, 0],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        repeatType: "loop",
                                                        delay: index * 0.4
                                                    }}
                                                >
                                                    <Zap className="text-blue-400 h-5 w-5" />
                                                </motion.div>
                                            ))}
                                        </>
                                    )}

                                    {status === "success" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Check className="h-5 w-5 text-emerald-500" />
                                            </div>
                                        </motion.div>
                                    )}

                                    {status === "error" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Arrow */}
                            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1">
                                <ArrowRight className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <motion.div
                                className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-1"
                                animate={!isApprovalPhase && status === "pending" ? { scale: [1, 1.05, 1] } : {}}
                                transition={!isApprovalPhase && status === "pending" ? { repeat: Infinity, duration: 1.5 } : {}}
                            >
                                {toTokenLogo ? (
                                    <Image
                                        src={toTokenLogo}
                                        alt={toToken.symbol}
                                        className="h-10 w-10 rounded-full"
                                        width={40}
                                        height={40}
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                                        {toToken.symbol.slice(0, 3)}
                                    </div>
                                )}
                            </motion.div>
                            <span className="text-sm font-medium text-slate-300">{toToken.symbol}</span>
                            <span className="text-xs text-slate-400">{toAmount}</span>
                        </div>
                    </div>

                    {/* Status indicators */}
                    {status === "pending" && (
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                            <AnimatePresence mode="wait">
                                {isApprovalPhase ? (
                                    <motion.div
                                        key="approval-message"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col items-center"
                                    >
                                        <p className="text-sm text-slate-300 text-center mb-1">
                                            {errorMessage || `Approving ${fromToken.symbol}...`}
                                        </p>
                                        <p className="text-xs text-slate-400 text-center max-w-xs">
                                            Please confirm the approval transaction in your wallet. This is required before swapping.
                                        </p>
                                        {approvalTxHash && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-slate-500 mt-2"
                                            >
                                                Approval transaction: {approvalTxHash.slice(0, 6)}...{approvalTxHash.slice(-4)}
                                            </motion.p>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="swap-message"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col items-center"
                                    >
                                        <p className="text-sm text-slate-300 text-center mb-1">
                                            {isCrossChain ? "Bridging tokens across chains..." : "Transaction in progress..."}
                                        </p>
                                        <p className="text-xs text-slate-400 text-center max-w-xs">
                                            {isCrossChain
                                                ? "Cross-chain swaps can take 2-5 minutes to complete. Please be patient."
                                                : "This can take a moment. Please don't close this window."}
                                        </p>
                                        {txHash && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-slate-500 mt-2 break-all px-4 text-center"
                                            >
                                                Tx: {txHash.slice(0, 6)}...{txHash.slice(-4)}
                                            </motion.p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Progress steps for approval + swap flow */}
                            <div className="mt-6 w-full max-w-xs">
                                {/* Only show approval step if actual approval is needed/was needed */}
                                {(isApprovalPhase || approvalTxHash) && (
                                    <div className="flex items-center">
                                        <div className={`relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-blue-500 bg-blue-500/20`}>
                                            <Check className="h-3 w-3 text-blue-500" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-xs font-medium text-blue-500">Approval initiated</p>
                                        </div>
                                    </div>
                                )}

                                {/* Only show the connector line if we're showing the approval step */}
                                {(isApprovalPhase || approvalTxHash) && (
                                    <div className="mt-0.5 ml-3 h-8 w-px bg-slate-700"></div>
                                )}

                                <div className="flex items-center">
                                    <div className={`relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800`}>
                                        <span className="h-2.5 w-2.5 rounded-full bg-slate-700"></span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-xs font-medium text-slate-500">Swap transaction</p>
                                    </div>
                                </div>

                                {isCrossChain && (
                                    <>
                                        <div className="mt-0.5 ml-3 h-8 w-px bg-slate-700"></div>

                                        <div className="flex items-center">
                                            <div className={`relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800`}>
                                                <span className="h-2.5 w-2.5 rounded-full bg-slate-700"></span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-xs font-medium text-slate-500">Bridge transaction</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {provider && !isApprovalPhase && (
                                <div className="mt-4 text-xs text-slate-500">
                                    Provider: {provider}
                                </div>
                            )}
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center">
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                                            <Check className="h-8 w-8 text-emerald-500" />
                                        </div>
                                        <p className="text-sm text-emerald-300 text-center">Transaction successful!</p>
                                        {txHash && (
                                            <p className="text-xs text-slate-400 mt-2 break-all px-8 text-center">
                                                Hash: {txHash.slice(0, 6)}...{txHash.slice(-4)}
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-400 mt-2">
                                            {autoClose ? "Closing automatically..." : ""}
                                        </p>

                                        {!autoClose && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0, transition: { delay: 1 } }}
                                                className="mt-4 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-sm rounded-md"
                                                onClick={() => onOpenChange(false)}
                                            >
                                                Close
                                            </motion.button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center">
                            <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <p className="text-sm text-red-300 text-center mb-1">Transaction failed</p>
                            {errorMessage && (
                                <p className="text-xs text-slate-400 text-center max-w-xs mt-1 px-4">
                                    {errorMessage}
                                </p>
                            )}

                            {showCloseButton && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 mt-4"
                                >
                                    <button
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm rounded-md"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-sm text-blue-300 rounded-md"
                                        onClick={() => {
                                            // Retry action if implemented
                                            onOpenChange(false);
                                        }}
                                    >
                                        Try Again
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                {/* Network indicators */}
                {isCrossChain && (
                    <div className="pt-4 border-t border-slate-800 mt-2">
                        <div className="flex justify-between items-center text-xs text-slate-500">
                            <div className="flex items-center">
                                <span>From: </span>
                                <span className="capitalize ml-1">{fromNetwork}</span>
                            </div>
                            <div className="flex items-center">
                                <span>To: </span>
                                <span className="capitalize ml-1">{toNetwork}</span>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog >
    );
}
