"use client"

import { Wallet } from "lucide-react"
import { AdvancedSettings } from "../.."
import { WalletDetailsPanel } from "./wallet-details-panel"
import { useWalletDetails } from "../../hooks/use-wallet-details"
import { ConnectButtonSimple } from "../../../wallet/button/connect-button-simple"

export function WalletSettings() {
    const walletDetails = useWalletDetails();

    return (
        <AdvancedSettings
            icon={<Wallet className="mr-2 text-blue-500 h-5 w-5" />}
            title="Wallet"
        >
            {!walletDetails.isConnected ? (
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">Connect your wallet to view details</p>
                    <ConnectButtonSimple />
                </div>
            ) : (                
                <WalletDetailsPanel 
                    address={walletDetails.address || ""}
                    isConnected={walletDetails.isConnected} 
                    balance={walletDetails.balance}
                    network={{
                        name: walletDetails.network.name,
                        chainId: Number(walletDetails.network.chainId)
                    }}
                    rpc={walletDetails.rpc}
                    explorerUrl={walletDetails.explorerUrl}
                />
            )}
        </AdvancedSettings>
    )
}