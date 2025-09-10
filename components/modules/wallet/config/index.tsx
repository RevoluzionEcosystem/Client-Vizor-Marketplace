import { cookieStorage, createStorage, http, webSocket, fallback } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { mainnet, optimism, arbitrum, base, bsc, polygon, avalanche, celo, gnosis, fantom, linea, scrollSepolia, sepolia, mantle, blast, mode, bscTestnet } from '@reown/appkit/networks'
import { solana, solanaDevnet } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { createClient, defineChain } from 'viem'
import WS_URLS from '@/lib/websocket-config'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
    throw new Error('Project ID is not defined')
}

// Custom RPC URL configurations with WSS and HTTP fallback
const RPC_URLS = {
    mainnet: {
        http: process.env.NEXT_PUBLIC_HTTP_ETHEREUM || 'https://ethereum-rpc.publicnode.com',
        webSocket: process.env.NEXT_PUBLIC_WS_ETHEREUM || WS_URLS.ETHEREUM,
    },
    bsc: {
        http: process.env.NEXT_PUBLIC_HTTP_BSC || 'https://bsc-rpc.publicnode.com',
        webSocket: process.env.NEXT_PUBLIC_WS_BSC || WS_URLS.BSC,
    },
    polygon: {
        http: process.env.NEXT_PUBLIC_HTTP_POLYGON || 'https://polygon-bor-rpc.publicnode.com',
        webSocket: process.env.NEXT_PUBLIC_WS_POLYGON || WS_URLS.POLYGON,
    },
    arbitrum: {
        http: process.env.NEXT_PUBLIC_HTTP_ARBITRUM || 'https://arbitrum-one-rpc.publicnode.com',
        webSocket: process.env.NEXT_PUBLIC_WS_ARBITRUM || WS_URLS.ARBITRUM,
    },
    optimism: {
        http: process.env.NEXT_PUBLIC_HTTP_OPTIMISM || 'https://optimism-rpc.publicnode.com',
        webSocket: process.env.NEXT_PUBLIC_WS_OPTIMISM || WS_URLS.OPTIMISM,
    },
    base: {
        http: process.env.NEXT_PUBLIC_HTTP_BASE || 'https://base-rpc.publicnode.com',
        webSocket: process.env.NEXT_PUBLIC_WS_BASE || WS_URLS.BASE,
    },
    avalanche: {
        http: process.env.NEXT_PUBLIC_HTTP_AVALANCHE || 'https://avalanche-c-chain-rpc.publicnode.com',
        webSocket: process.env.NEXT_PUBLIC_WS_AVALANCHE || WS_URLS.AVALANCHE,
    },
    bscTestnet: {
        http: process.env.NEXT_PUBLIC_HTTP_BSC_TESTNET || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        webSocket: process.env.NEXT_PUBLIC_WS_BSC_TESTNET || 'wss://bsc-testnet-rpc.publicnode.com',
    },
}

// Instead of modifying the imported chains directly, we'll create new transport configurations
// This approach maintains type safety

// Define our network list with the original chains from appkit
export const networks = [
    mainnet,
    bsc,
    bscTestnet,
    polygon,
    arbitrum,
    optimism,
    base,
    avalanche,
    fantom,
    solana,
] as [AppKitNetwork, ...AppKitNetwork[]]

// Define the wallets we want to feature
const featuredWallets = ['metamask', 'walletconnect', 'safe']

// Create a proper storage configuration
const storage = createStorage({
    storage: cookieStorage,
});

// Set up Wagmi Adapter with WebSocket transports via the transports config
export const wagmiAdapter = new WagmiAdapter({
    storage,
    ssr: true,
    projectId,
    networks,
    transports: {
        [bsc.id]: fallback([
            webSocket(RPC_URLS.bsc.webSocket),
            http(RPC_URLS.bsc.http)
        ]),
        [mainnet.id]: fallback([
            webSocket(RPC_URLS.mainnet.webSocket),
            http(RPC_URLS.mainnet.http)
        ]),
        [polygon.id]: fallback([
            webSocket(RPC_URLS.polygon.webSocket),
            http(RPC_URLS.polygon.http)
        ]),
        [arbitrum.id]: fallback([
            webSocket(RPC_URLS.arbitrum.webSocket),
            http(RPC_URLS.arbitrum.http)
        ]),
        [optimism.id]: fallback([
            webSocket(RPC_URLS.optimism.webSocket),
            http(RPC_URLS.optimism.http)
        ]),
        [base.id]: fallback([
            webSocket(RPC_URLS.base.webSocket),
            http(RPC_URLS.base.http)
        ]),
        [avalanche.id]: fallback([
            webSocket(RPC_URLS.avalanche.webSocket),
            http(RPC_URLS.avalanche.http)
        ]),
        [bscTestnet.id]: fallback([
            webSocket(RPC_URLS.bscTestnet.webSocket),
            http(RPC_URLS.bscTestnet.http)
        ])
    }
})

export const solanaWeb3JsAdapter = new SolanaAdapter()

export const config = wagmiAdapter.wagmiConfig