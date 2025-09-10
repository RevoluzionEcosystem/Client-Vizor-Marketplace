"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNetworkName } from "@/lib/network-utils";
import { getNetworkIconPath, IconImage } from "@/lib/icon-utils";
import { Network, getSupportedNetworks, networkData } from "./whitelist";

interface NetworkSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    currentNetwork: string;
    onSelectNetwork: (network: string) => void;
    title: string;
    description: string;
}

export default function NetworkSelector({
    isOpen,
    onClose,
    currentNetwork,
    onSelectNetwork,
    title,
    description,
}: NetworkSelectorProps) {
    const [search, setSearch] = useState("");
    
    // Get supported networks from whitelist
    const availableNetworks = getSupportedNetworks();
    
    // Filter networks based on search
    const filteredNetworks = availableNetworks.filter(network => {
        const searchLower = search.toLowerCase();
        const networkName = getNetworkName(network.id).toLowerCase();
        
        return networkName.includes(searchLower) || network.id.includes(searchLower);
    });

    const handleSelect = (networkId: string) => {
        // Make sure we're passing the network ID exactly as defined in the networks list
        // This ensures proper backend mapping (particularly for BSC)
        const selectedNetwork = availableNetworks.find(network => network.id === networkId);
        
        if (selectedNetwork) {
            console.log(`Selected network: ${networkId} (${selectedNetwork.name})`);
            onSelectNetwork(networkId);
        } else {
            console.warn(`Network ${networkId} not found in available networks`);
            onSelectNetwork(networkId); // Fallback to the original behavior
        }
        
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-300 p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="text-slate-100 text-xl">{title}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="px-6 py-4">
                    <div className="relative">
                        <Input
                            placeholder="Search networks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-4 pr-10 py-3 bg-slate-800 border-slate-700 focus:border-blue-600 focus-visible:ring-blue-600 text-slate-100 placeholder:text-slate-500"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                
                <ScrollArea className="px-6 max-h-[400px]">
                    <div className="space-y-2 pb-6">
                        {filteredNetworks.map((network) => (
                            <motion.div
                                key={network.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.15 }}
                                className={`
                                    flex items-center p-3 rounded-lg cursor-pointer
                                    ${currentNetwork === network.id ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-slate-800 border border-slate-700 hover:border-slate-600'}
                                `}
                                onClick={() => handleSelect(network.id)}
                            >                                
                            <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mr-3 bg-slate-700">
                                    <IconImage
                                        src={getNetworkIconPath(network.id)}
                                        alt={network.name}
                                        className="h-full w-full object-cover"
                                        fallbackSrc="/assets/networks/default.svg"
                                        key={`network-selector-${network.id}`} // Add key to force refresh when network changes
                                    />
                                </div>
                                
                                <div className="flex-1">
                                    <div className="font-medium text-slate-200">{network.name}</div>
                                    <div className="text-xs text-slate-400">Chain ID: {network.chain_id}</div>
                                </div>
                                
                                {currentNetwork === network.id && (
                                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        
                        {filteredNetworks.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                No networks found matching "{search}"
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}