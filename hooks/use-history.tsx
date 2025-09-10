import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Scan {
    address: string;
    network: string;
    type: string;
    timestamp?: number;
}

interface ScanHistoryStore {
    scans: Scan[];
    walletAddress: string | null;
    setWalletAddress: (address: string | null) => void;
    addScan: (scan: Scan) => void;
    clearHistory: () => void;
    loadHistory: () => Scan[];
}

// Flag to prevent excessive re-rendering during state updates
let isUpdating = false;
// Flag to indicate if we're using the legacy history system or the new one
const USE_LEGACY_HISTORY = false; // Completely disabled

export const useScanHistoryStore = create<ScanHistoryStore>()(
    persist(
        (set, get) => ({
            scans: [],
            walletAddress: null,
            setWalletAddress: (address) => {
                // Skip updates if we're using the new system
                if (!USE_LEGACY_HISTORY) return;
                
                // Prevent unnecessary state updates if the address hasn't changed
                if (get().walletAddress === address) return;
                set({ walletAddress: address });
            },
            addScan: (scan) => {
                // Skip updates if we're using the new system
                if (!USE_LEGACY_HISTORY) return;
                
                // Prevent update loops by checking if we're already updating
                if (isUpdating) return;
                
                const currentWallet = get().walletAddress;

                // Only add scans if wallet is connected
                if (!currentWallet) return;

                try {
                    isUpdating = true;
                    const newScan = {
                        ...scan,
                        timestamp: Date.now(),
                    };

                    // Check if this scan already exists to avoid duplicates
                    const existingScan = get().scans.find(
                        (s) => s.address === scan.address && s.network === scan.network
                    );

                    // Only update state if this is a new scan
                    if (!existingScan) {
                        set((state) => ({
                            scans: [newScan, ...state.scans.filter(
                                (s) => !(s.address === scan.address && s.network === scan.network)
                            )].slice(0, 10), // Keep only the latest 10 scans
                        }));
                    }
                } finally {
                    isUpdating = false;
                }
            },
            clearHistory: () => {
                // Skip updates if we're using the new system
                if (!USE_LEGACY_HISTORY) return;
                set({ scans: [] });
            },
            loadHistory: () => {
                // Return empty array if we're using the new system
                if (!USE_LEGACY_HISTORY) return [];
                
                const currentWallet = get().walletAddress;
                // Only return history if wallet is connected
                return currentWallet ? get().scans : [];
            },
        }),
        {
            name: 'scanner-history-storage-legacy', // Renamed to avoid conflicts
        }
    )
);