"use client"

// Add chain imports at the beginning of the file
import { mainnet, polygon, bsc } from "@wagmi/core/chains"
import WS_URLS, {
    getEthereumWS as getEthereumWebSocket,
    getPolygonWS as getPolygonWebSocket,
    getBscWS as getBscWebSocket,
    getWalletConnectWS as getWalletConnectWebSocketURL  // Import the wallet connect WS getter
} from './websocket-config'

import {
    Banknote,
    Calculator,
    CandlestickChart,
    ClipboardType,
    CodeXml,
    Coins,
    Compass,
    Droplets,
    FilePenLine,
    FileSearch,
    GitPullRequestArrow,
    GraduationCap,
    HandCoins,
    Image as ImageIcon,
    LayoutDashboard,
    Layers,
    LockKeyhole,
    Megaphone,
    MessageSquare,
    PlayCircle,
    RefreshCcw,
    ScanEye,
    SearchCode,
    SendHorizonal,
    SendToBack,
    ShieldCheck,
    ShieldPlus,
    ShieldQuestion,
    Store,
    Target,
    TrendingUp,
    Cctv,
    Vote,
    Wallet,
    Bot,
    EyeOff,
    Swords,
    Ticket,
    MonitorSmartphone,
    FileCode2,
    Globe,
    SatelliteDish,
    UserCog,
    Logs,
    GlobeLock,
    Handshake,
} from "lucide-react";
import { FaDiscord, FaFacebook, FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaMedium, FaNewspaper, FaReddit, FaTelegram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6"
import { useEffect, useState, useCallback } from "react"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"]
var VALUE = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion"]

export const nFormatter = (nbr: number, decimals: number, fixed?: number, valType?: boolean) => {
    var tier = Math.log10(Math.abs(nbr)) / 3 | 0

    if (tier <= -1) {
        const exponent = Math.abs(tier) * 3
        const coefficient = (nbr * Math.pow(10, exponent + decimals)).toFixed(0)
        return (
            <div>
                0.0
                <sub>
                    <sub className="text-xs p-0.5 text-foreground group-hover:text-primary">{`${exponent}`}</sub>
                </sub>
                {`${coefficient}`}
            </div>
        )
    }

    if (tier <= 0) return Number(nbr).toFixed(decimals)

    var suffix = valType ? SI_SYMBOL[tier] : VALUE[tier]
    var scale = Math.pow(10, tier * 3)

    var scaled = nbr / scale

    if (fixed > 0) return scaled.toFixed(fixed) + " " + suffix

    return scaled.toFixed(3) + " " + suffix
}

export const shortenAddress = (address: string, pre: number, suf: number) => {
    const prefix = address.slice(0, pre)
    const suffix = address.slice(suf)
    return `${prefix}...${suffix}`
}

export const truncateAddress = (address: string, prefix: number, suffix: number): string => {
    return `${address.slice(0, prefix)}…${address.slice(suffix)}`
}

export function useMediaQuery(query: string) {
    const [value, setValue] = useState(false)

    useEffect(() => {
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches)
        }

        const result = matchMedia(query)
        result.addEventListener("change", onChange)
        setValue(result.matches)

        return () => result.removeEventListener("change", onChange)
    }, [query])

    return value
}

export function getNavIcon(id: string) {
    const iconProps = { className: "mr-2 h-[12px] w-[12px] text-slate-400" };

    switch (id) {
        case "dashboard":
            return <LayoutDashboard width={15} height={15} {...iconProps} />;
        case "user-dashboard":
            return <Handshake width={15} height={15} {...iconProps} />;
        case "crosschain-swap":
            return <RefreshCcw width={15} height={15} {...iconProps} />;
        case "staking":
            return <HandCoins width={15} height={15} {...iconProps} />;
        case "governance":
            return <Vote width={15} height={15} {...iconProps} />;
        case "investment-insights":
            return <TrendingUp width={15} height={15} {...iconProps} />;
        case "incubated-projects":
            return <Store width={15} height={15} {...iconProps} />;
        case "raffle":
            return <Ticket width={15} height={15} {...iconProps} />;
        case "support":
            return <MessageSquare width={15} height={15} {...iconProps} />;
        case "documentation":
            return <FileSearch width={15} height={15} {...iconProps} />;
        case "legal":
            return <ClipboardType width={15} height={15} {...iconProps} />;
        case "terms":
            return <FileSearch width={15} height={15} {...iconProps} />;
        case "privacy":
            return <GlobeLock width={15} height={15} {...iconProps} />;
        /* fallback */
        default:
            return null;
    }
}

export function getSocialIcon(id: string) {
    const iconProps = { className: "mx-auto h-[12px] w-[12px]" }

    switch (id) {
        case "web":
            return <FaGlobe width={15} height={15} {...iconProps} />
        case "website":
            return <FaGlobe width={15} height={15} {...iconProps} />
        case "x":
            return <FaXTwitter width={15} height={15} {...iconProps} />
        case "twitter":
            return <FaXTwitter width={15} height={15} {...iconProps} />
        case "telegram":
            return <FaTelegram width={15} height={15} {...iconProps} />
        case "discord":
            return <FaDiscord width={15} height={15} {...iconProps} />
        case "youtube":
            return <FaYoutube width={15} height={15} {...iconProps} />
        case "github":
            return <FaGithub width={15} height={15} {...iconProps} />
        case "reddit":
            return <FaReddit width={15} height={15} {...iconProps} />
        case "linkedin":
            return <FaLinkedin width={15} height={15} {...iconProps} />
        case "medium":
            return <FaMedium width={15} height={15} {...iconProps} />
        case "facebook":
            return <FaFacebook width={15} height={15} {...iconProps} />
        case "instagram":
            return <FaInstagram width={15} height={15} {...iconProps} />
        case "tiktok":
            return <FaTiktok width={15} height={15} {...iconProps} />
        default:
            return null
    }
}

export const splitPathname = (input: string): string[] => {
    switch (input) {
        case "/rvz":
            return ["RVZ"]
        case "/apoc":
            return ["APOC"]
        case "/lzn":
            return ["LZN"]
        default:
            return input.replace(/^\/|\/$/g, '').split('/')
    }

}

export function capitalizeFirstLetter(str: string): string {
    if (!str)
        return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const convertUnixTimestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    return date.toUTCString()
}

export const getCurrentUnixTimestamp = (): number => {
    return Math.floor(Date.now() / 1000)
}

// Copy to clipboard utility function
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            // Use the Clipboard API when available (HTTPS only)
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback method for non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    } catch (err) {
        console.error("Failed to copy text: ", err);
        return false;
    }
};

// Clipboard hook for React components
export const useClipboard = (timeout = 2000) => {
    const [copied, setCopied] = useState(false);

    const copy = async (text: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), timeout);
        }
        return success;
    };

    return { copied, copy };
};

// ==================================================================================
// GENERIC HISTORY STORE CREATOR
// ==================================================================================

// Generic history system for saving user interactions
export interface HistoryEntry {
    id: string; // Unique ID for the entry
    timestamp: number; // When the item was added
    [key: string]: any; // Additional properties
}

export interface HistoryState<T extends HistoryEntry> {
    history: T[];
    maxEntries: number;
    addEntry: (entry: Omit<T, 'id' | 'timestamp'>) => void;
    removeEntry: (id: string) => void;
    clearHistory: () => void;
}

// Create a store for managing user interaction history
export const createHistoryStore = <T extends HistoryEntry>(
    name: string,
    maxEntries: number = 50
) => {
    return create<HistoryState<T>>()(
        persist(
            (set, get) => ({
                history: [] as T[],
                maxEntries,
                addEntry: (entry) => {
                    set((state) => {
                        // Generate a unique ID and add timestamp
                        const newEntry = {
                            ...entry,
                            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                            timestamp: Date.now()
                        } as T;

                        // Add to the start (newest first) and limit the total number of entries
                        const updatedHistory = [newEntry, ...state.history].slice(0, state.maxEntries);

                        return { history: updatedHistory };
                    });
                },
                removeEntry: (id) => {
                    set((state) => ({
                        history: state.history.filter(entry => entry.id !== id)
                    }));
                },
                clearHistory: () => {
                    set({ history: [] });
                }
            }),
            {
                name: `vizor-${name}-history`,
            }
        )
    );
};

// ==================================================================================
// WEB3 WALLET CONNECTION HELPERS
// ==================================================================================

// Define the wallet store type
interface WalletState {
    address: string | null;
    chainId: number | null;
    setAddress: (address: string | null) => void;
    setChainId: (chainId: number | null) => void;
    disconnect: () => void;
}

// Create a store with persistence
export const useWalletStore = create<WalletState>()(
    persist(
        (set) => ({
            address: null,
            chainId: null,
            setAddress: (address) => set({ address }),
            setChainId: (chainId) => set({ chainId }),
            disconnect: () => set({ address: null, chainId: null }),
        }),
        {
            name: 'web3-wallet-state',
        }
    )
);

// Get chain name helper
export const getChainName = (chainId: number | null): string => {
    if (!chainId) return 'Unknown Network';

    const networks: Record<number, string> = {
        1: 'Ethereum Mainnet',
        5: 'Goerli Testnet',
        56: 'Binance Smart Chain',
        137: 'Polygon',
        43114: 'Avalanche',
        250: 'Fantom',
        // Add more as needed
    };

    return networks[chainId] || `Chain ID ${chainId}`;
};


// ==================================================================================
// WEBSOCKET CONNECTION UTILITIES
// ==================================================================================

// WebSocket connection class for secure data fetching
export class SecureWebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectDelay: number = 3000; // 3 seconds
    private callbacks: Map<string, (data: any) => void> = new Map();
    private messageQueue: Array<{ id: string, data: any }> = [];
    private connectionPromise: Promise<boolean> | null = null;
    private isConnecting: boolean = false;
    private isDisconnecting: boolean = false; // Add flag to track intentional disconnections

    constructor(url: string) {
        this.url = url;
    }

    // Connect to WebSocket server with secure protocol
    public connect(): Promise<boolean> {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return Promise.resolve(true);
        }

        if (this.isConnecting && this.connectionPromise) {
            return this.connectionPromise;
        }

        this.isConnecting = true;
        this.isDisconnecting = false;

        this.connectionPromise = new Promise((resolve) => {
            try {
                // Use wss:// protocol for secure connections
                const secureUrl = this.url.startsWith('wss://') ? this.url : `wss://${new URL(this.url).host}${new URL(this.url).pathname}`;
                this.ws = new WebSocket(secureUrl);

                this.ws.onopen = () => {
                    this.reconnectAttempts = 0;
                    this.isConnecting = false;

                    // Process any queued messages
                    this.processMessageQueue();

                    resolve(true);
                };

                this.ws.onclose = () => {
                    this.handleDisconnection();
                };

                this.ws.onerror = (event) => {
                    console.error('WebSocket error:', event);
                    this.handleDisconnection();
                    resolve(false);
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        const { id, data } = message;

                        if (this.callbacks.has(id)) {
                            this.callbacks.get(id)!(data);
                            this.callbacks.delete(id); // Clean up after handling
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };
            } catch (error) {
                console.error('Error establishing WebSocket connection:', error);
                this.isConnecting = false;
                resolve(false);
            }
        });

        return this.connectionPromise;
    }

    // Process queued messages after successful connection
    private processMessageQueue(): void {
        // Process any queued messages
        while (this.messageQueue.length > 0) {
            const { id, data } = this.messageQueue.shift()!;
            this.sendMessage(id, data);
        }
    }

    private handleDisconnection() {
        // Skip reconnection logic if we're intentionally disconnecting
        if (this.isDisconnecting) {
            this.ws = null;
            return;
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay);
        } else {
            this.ws = null;
        }
    }

    // Clean disconnect without reconnection attempts
    public disconnect(): void {
        this.isDisconnecting = true;
        if (this.ws) {
            // Close the connection cleanly
            this.ws.close();
            this.ws = null;
        }

        // Clear any pending callbacks and queue to prevent memory leaks
        this.callbacks.clear();
        this.messageQueue = [];
        this.connectionPromise = null;
        this.isConnecting = false;
    }

    // Send data through WebSocket with fallback to traditional fetch
    public async sendRequest<T>(endpoint: string, data: any = {}): Promise<T> {
        // Generate a unique ID for this request
        const id = Math.random().toString(36).substring(2, 10);

        return new Promise<T>((resolve, reject) => {
            try {
                // Set up callback for when we get a response
                this.callbacks.set(id, (responseData) => {
                    resolve(responseData as T);
                });

                // Include the endpoint in the message data
                const messageData = {
                    ...data,
                    endpoint
                };

                // Send the message through WebSocket
                this.sendMessage(id, messageData);

                // Set timeout for response
                setTimeout(() => {
                    if (this.callbacks.has(id)) {
                        this.callbacks.delete(id);
                        reject(new Error('WebSocket request timed out'));
                    }
                }, 15000); // 15 second timeout
            } catch (error) {
                this.callbacks.delete(id);
                reject(error);
            }
        });
    }

    private sendMessage(id: string, data: any): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.messageQueue.push({ id, data });
            this.connect().catch(error => {
                console.error('Failed to connect for sending message:', error);
                // Remove the callback to avoid memory leak
                this.callbacks.delete(id);
            });
            return;
        }

        try {
            this.ws.send(JSON.stringify({
                id,
                data
            }));
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
            // Add back to queue for retrying
            this.messageQueue.push({ id, data });
            this.handleDisconnection();
        }
    }
}

// React hook for using the WebSocket client
export function useSecureWebSocket(url: string) {
    const [client] = useState(() => new SecureWebSocketClient(url));

    useEffect(() => {
        // Connect when component mounts
        client.connect();

        // Disconnect when component unmounts
        return () => {
            client.disconnect();
        };
    }, [client, url]);

    return {
        sendRequest: <T,>(endpoint: string, data?: any) => client.sendRequest<T>(endpoint, data)
    };
}

// Create singleton WebSocket client instances for commonly used endpoints
let walletConnectWs: SecureWebSocketClient | null = null;

export const getWalletConnectWS = () => {
    if (!walletConnectWs) {
        // Use the centralized configuration instead of hardcoding the URL
        walletConnectWs = new SecureWebSocketClient(getWalletConnectWebSocketURL());
    }
    return walletConnectWs;
};

// ==================================================================================
// For TypeScript support in component props
// ==================================================================================

declare global {
    interface Window {
        reown?: any; // Add this for compatibility with Reown's globals
        solana?: any; // Add this for Solana wallet
    }
}

/**
 * Formats coin amount with proper decimal places
 * @param amount The amount to format
 * @param decimals Number of decimals the token has
 * @param displayDecimals Number of decimals to display
 * @returns Formatted coin amount as string
 */
export const formatCoin = (
    amount: string | number,
    symbol: string,
    decimals: number = 6
): string => {
    if (!amount) return `0 ${symbol}`;

    try {
        const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (isNaN(amountNum)) return `0 ${symbol}`;

        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals,
        });

        // Remove trailing zeros and add symbol
        return `${formatter.format(amountNum)} ${symbol}`;
    } catch (error) {
        console.error('Error formatting coin:', error);
        return `0 ${symbol}`;
    }
}

/**
 * Format address to short form
 * @param address Blockchain address
 * @returns Shortened address with ellipsis
 */
export const formatAddress = (address: string): string => {
    if (!address || address.length < 10) return address || '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format amount with comma separators
 * @param amount Number to format
 * @returns Formatted number with commas
 */
export const formatAmount = (amount: string | number): string => {
    if (!amount) return '0';

    try {
        const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (isNaN(amountNum)) return '0';

        return new Intl.NumberFormat('en-US').format(amountNum);
    } catch (error) {
        return '0';
    }
}

/**
 * Check if a string is a valid Ethereum style address
 * @param address The address to validate
 * @returns boolean indicating if the address is valid
 */
export const isValidAddress = (address: string): boolean => {
    if (!address) return false;
    // Validate that the address begins with 0x and is followed by 40 hex characters
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Formats a token price value with appropriate decimal places based on the token's value:
 * - Above 1: 2 decimal places (e.g., $123.45)
 * - Between 0.00001 and 1: 6 decimal places (e.g., $0.123456)
 * - Below 0.00001: 9 decimal places (e.g., $0.000001234)
 * 
 * @param price The price value to format
 * @param includeSymbol Whether to include the $ symbol (default: true)
 * @returns Formatted price string
 */
export const formatTokenPrice = (price: number | string | null | undefined, includeSymbol: boolean = true): string => {
    if (price === null || price === undefined || price === '') return includeSymbol ? '$0.00' : '0.00';

    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numPrice)) return includeSymbol ? '$0.00' : '0.00';

    // Select decimal places based on value range
    let decimalPlaces = 2;

    if (numPrice < 0.00001) {
        decimalPlaces = 9;
    } else if (numPrice < 1) {
        decimalPlaces = 6;
    }

    // Format with appropriate decimal places
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
    });

    const formattedValue = formatter.format(numPrice);
    return includeSymbol ? `$${formattedValue}` : formattedValue;
};

/**
 * Format number with proper formatting
 * @param number The number to format
 * @param decimals Number of decimal places to include
 * @returns Formatted number as string
 */
export const formatNumber = (number: number | string | null | undefined, decimals: number = 2): string => {
    if (number === null || number === undefined || number === '') return '0';

    const num = typeof number === 'string' ? parseFloat(number) : number;

    if (isNaN(num)) return '0';

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    }).format(num);
}

/**
 * Format number in compact format (e.g. 1.2K, 1.5M)
 * @param number The number to format in compact notation
 * @returns Formatted compact number as string
 */
export const formatCompactNumber = (number: number | string | null | undefined): string => {
    if (number === null || number === undefined || number === '') return '0';

    const num = typeof number === 'string' ? parseFloat(number) : number;

    if (isNaN(num)) return '0';

    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num);
}

/**
 * Calculate time elapsed since a given date
 * @param date The date to calculate time since
 * @returns Human-readable string representing elapsed time
 */
export const timeSince = (date: string | number | Date): string => {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    let interval = seconds / 31536000; // seconds in a year

    if (interval > 1) {
        return Math.floor(interval) + " year" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }

    interval = seconds / 2592000; // seconds in a month
    if (interval > 1) {
        return Math.floor(interval) + " month" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }

    interval = seconds / 86400; // seconds in a day
    if (interval > 1) {
        return Math.floor(interval) + " day" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }

    interval = seconds / 3600; // seconds in an hour
    if (interval > 1) {
        return Math.floor(interval) + " hour" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }

    interval = seconds / 60; // seconds in a minute
    if (interval > 1) {
        return Math.floor(interval) + " minute" + (Math.floor(interval) === 1 ? "" : "s") + " ago";
    }

    return Math.floor(seconds) + " second" + (Math.floor(seconds) === 1 ? "" : "s") + " ago";
}

/**
 * Converts a HEX color to RGBA format
 * @param hex - Hexadecimal color code (with or without # prefix)
 * @param alpha - Alpha transparency value between 0 and 1
 * @returns RGBA color string or null if invalid hex
 */
export function hexToRgba(hex: string, alpha: number = 1): string | null {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Check if it's a valid hex
    if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(hex)) {
        console.warn('Invalid hex color provided to hexToRgba:', hex);
        return null;
    }

    let r, g, b;

    // Convert 3-digit hex to 6-digits
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    }

    // Ensure alpha is between 0 and 1
    alpha = Math.max(0, Math.min(1, alpha));

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


// ==================================================================================
// EXPLORER API KEYS
// ==================================================================================
const ethAPI = process.env.NEXT_PUBLIC_EXPLORER_API_ETH
const maticAPI = process.env.NEXT_PUBLIC_EXPLORER_API_MATIC
const bscAPI = process.env.NEXT_PUBLIC_EXPLORER_API_BSC

export function checkAPI(network: string) {
    if (network === "eth") {
        return { apiKeyExplorer: ethAPI, explorer: "api.etherscan.io", link: "etherscan.io", chain: mainnet }
    }
    if (network === "matic") {
        return { apiKeyExplorer: maticAPI, explorer: "api.polygonscan.com", link: "polygonscan.com", chain: polygon }
    }
    if (network === "bsc") {
        return { apiKeyExplorer: bscAPI, explorer: "api.bscscan.com", link: "bscscan.com", chain: bsc }
    }
}