"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getTokenIconPath, IconImage } from "@/lib/icon-utils";
import { useTokenImage } from "../hooks/use-token-image";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransactionSuccessProps {
  txHash: string;
  fromToken: string;
  toToken: string;
  fromNetwork: string;
  toNetwork: string;
  visible: boolean;
  onClose: () => void;
}

export default function TransactionSuccess({
  txHash,
  fromToken,
  toToken,
  fromNetwork,
  toNetwork,
  visible,
  onClose
}: TransactionSuccessProps) {
  const isMobile = useIsMobile();
  const [explorerUrl, setExplorerUrl] = useState("");

  // Specialized components for source and destination tokens/networks
  // These components are inside the TransactionSuccess function to access the props  
  function FromTokenImage() {
    const { logoUrl } = useTokenImage({
      address: "0x0000000000000000000000000000000000000000", // Default address for token
      symbol: fromToken,
      network: fromNetwork,
    });

    return (
      <IconImage
        src={logoUrl || getTokenIconPath(fromToken)}
        alt={fromToken || "source token"}
        className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
      />
    );
  }

  function ToTokenImage() {
    const { logoUrl } = useTokenImage({
      address: "0x0000000000000000000000000000000000000000", // Default address for token
      symbol: toToken,
      network: toNetwork,
    });

    return (
      <IconImage
        src={logoUrl || getTokenIconPath(toToken)}
        alt={toToken || "destination token"}
        className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
      />
    );
  }

  function FromNetworkImage() {
    // For networks, we'll use the network name as the symbol
    // and provide a default address
    const { logoUrl } = useTokenImage({
      address: "0x0000000000000000000000000000000000000000",
      symbol: fromNetwork,
      network: fromNetwork,
    });

    return (
      <IconImage
        src={logoUrl || getTokenIconPath(fromNetwork)}
        alt={fromNetwork || "source network"}
        className="w-2 h-2"
      />
    );
  }

  function ToNetworkImage() {
    // For networks, we'll use the network name as the symbol
    // and provide a default address
    const { logoUrl } = useTokenImage({
      address: "0x0000000000000000000000000000000000000000",
      symbol: toNetwork,
      network: toNetwork,
    });

    return (
      <IconImage
        src={logoUrl || getTokenIconPath(toNetwork)}
        alt={toNetwork || "destination network"}
        className="w-2 h-2"
      />
    );
  }

  useEffect(() => {
    // Get the explorer URL based on the source network
    const getExplorerUrl = () => {
      const networkExplorers = {
        eth: "https://etherscan.io/tx/",
        matic: "https://polygonscan.com/tx/",
        bsc: "https://bscscan.com/tx/",
        arbitrum: "https://arbiscan.io/tx/",
        optimism: "https://optimistic.etherscan.io/tx/",
        avalanche: "https://snowtrace.io/tx/",
        base: "https://basescan.org/tx/",
        linea: "https://lineascan.build/tx/",
        scroll: "https://scrollscan.com/tx/",
        zksync: "https://explorer.zksync.io/tx/",
        fantom: "https://ftmscan.com/tx/",
        polygon_zkevm: "https://zkevm.polygonscan.com/tx/",
        "polygon-zkevm": "https://zkevm.polygonscan.com/tx/",
        rootstock: "https://explorer.rsk.co/tx/",
        fuse: "https://explorer.fuse.io/tx/"
      };

      return networkExplorers[fromNetwork] || "https://etherscan.io/tx/";
    };

    setExplorerUrl(getExplorerUrl());
  }, [fromNetwork]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
    toast.success("Transaction hash copied to clipboard");
  };

  // Format the hash for display
  const formatHash = (hash: string) => {
    if (!hash) return "";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >      <Card className="border border-emerald-500/30 bg-emerald-900/20 shadow-lg">
        <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
          <div className="flex items-start">
            <div className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} rounded-full flex items-center justify-center bg-emerald-500/20 mr-3`}>
              <CheckCircle2 className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-emerald-500`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-medium text-emerald-300 ${isMobile ? 'text-sm' : ''} mb-1`}>Transaction Successful</h3>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-300 mb-2 flex ${isMobile ? 'flex-wrap' : ''} items-center`}>
                <span className="flex items-center">
                  <div className="relative mr-1">
                    {/* Use the FromTokenImage component that accesses props directly */}
                    <FromTokenImage />
                    <div className={`absolute -bottom-1 -right-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} rounded-full bg-teal-950 flex items-center justify-center`}>
                      <FromNetworkImage />
                    </div>
                  </div>
                  <span className={isMobile ? 'text-xs' : ''}>{fromToken}</span>
                </span>
                <span className={`${isMobile ? 'mx-0.5 text-xs' : 'mx-1'}`}>→</span>
                <span className="flex items-center">
                  <div className="relative mr-1">
                    {/* Use the ToTokenImage component that accesses props directly */}
                    <ToTokenImage />
                    <div className={`absolute -bottom-1 -right-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} rounded-full bg-teal-950 flex items-center justify-center`}>
                      <ToNetworkImage />
                    </div>
                  </div>
                  <span className={isMobile ? 'text-xs' : ''}>{toToken}</span>
                </span>
                <span className={`${isMobile ? 'ml-0.5 text-xs' : 'ml-1'}`}>swap completed</span>
              </p>
              <div className={`bg-teal-950/50 rounded ${isMobile ? 'p-1.5' : 'p-2'} flex items-center justify-between mb-2`}>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-300`}>{formatHash(txHash)}</span>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-slate-300 hover:text-slate-100`}
                    onClick={copyToClipboard}
                  >
                    <Copy className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-slate-300 hover:text-slate-100`}
                    onClick={() => window.open(`${explorerUrl}${txHash}`, "_blank")}
                  >
                    <ExternalLink className={`${isMobile ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-emerald-300 hover:text-emerald-200"
                    onClick={() => window.open(`${explorerUrl}${txHash}`, "_blank")}
                  >
                    View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs ${isMobile ? 'h-6 px-1.5 ml-auto' : 'h-7 px-2'}`}
                  onClick={onClose}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}