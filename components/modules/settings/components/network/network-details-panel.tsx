"use client"

import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { getIconPath, IconImage } from "@/lib/icon-utils"

interface NetworkDetailsProps {
    currentNetwork: {
        id: string | number;
        name: string;
        icon?: string;
    };
    availableNetworks: Array<{
        id: string | number;
        name: string;
        icon?: string;
    }>;
    onNetworkChange: (networkId: string) => void;
}

export function NetworkDetailsPanel({
    currentNetwork,
    availableNetworks,
    onNetworkChange
}: NetworkDetailsProps) {    return (
        <div className="space-y-4">
            {/* Network Status */}
            <div className="flex items-center space-x-3 px-2 py-3 bg-muted/50 rounded-md justify-between">
                <div className="flex items-center space-x-2">
                    <IconImage
                        src={getIconPath(currentNetwork?.name.toLowerCase(), "network")}
                        alt={currentNetwork?.name || "Network"}
                        className="w-4 h-4 object-contain"
                    />
                    <span className="text-sm font-medium">
                        {currentNetwork.name || "Unknown Network"}
                    </span>
                </div>
            </div>            
            
            {/* Network Selection */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Change Network:</div>
                <Select onValueChange={onNetworkChange} defaultValue={String(currentNetwork.id)}>
                    <SelectTrigger className="w-[160px] text-xs">
                        <SelectValue placeholder="Select Network">
                            <div className="flex items-center">
                                <div className="h-4 w-4 rounded-full mr-2 bg-slate-800 p-0.5 overflow-hidden">
                                    <IconImage
                                        src={getIconPath(currentNetwork.name?.toLowerCase(), "network")}
                                        alt={currentNetwork.name || "Network"}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                {currentNetwork.name || "Unknown"}
                            </div>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {availableNetworks.map((network) => (
                            <SelectItem key={network.id} value={String(network.id)}>
                                <div className="flex items-center">
                                    <div className="h-4 w-4 rounded-full mr-2 bg-slate-800 p-0.5 overflow-hidden">
                                        <IconImage
                                            src={getIconPath(network.icon, "network")}
                                            alt={network.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    {network.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
