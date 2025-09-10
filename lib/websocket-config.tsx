// WebSocket configuration for blockchain RPC endpoints
// This file centralizes all WebSocket URLs for the application

// Import environment variables
const WS_URLS = {
    ETHEREUM: process.env.NEXT_PUBLIC_WS_ETHEREUM || 'wss://ethereum-rpc.publicnode.com',
    POLYGON: process.env.NEXT_PUBLIC_WS_POLYGON || 'wss://polygon-bor-rpc.publicnode.com',
    BSC: process.env.NEXT_PUBLIC_WS_BSC || 'wss://bsc-rpc.publicnode.com',
    AVALANCHE: process.env.NEXT_PUBLIC_WS_AVALANCHE || 'wss://avalanche-c-chain-rpc.publicnode.com',
    FANTOM: process.env.NEXT_PUBLIC_WS_FANTOM || 'wss://fantom-rpc.publicnode.com',
    ARBITRUM: process.env.NEXT_PUBLIC_WS_ARBITRUM || 'wss://arbitrum-one-rpc.publicnode.com',
    OPTIMISM: process.env.NEXT_PUBLIC_WS_OPTIMISM || 'wss://optimism-rpc.publicnode.com',
    BASE: process.env.NEXT_PUBLIC_WS_BASE || 'wss://base-rpc.publicnode.com',
    LINEA: process.env.NEXT_PUBLIC_WS_LINEA || 'wss://linea-rpc.publicnode.com',
    SCROLL: process.env.NEXT_PUBLIC_WS_SCROLL || 'wss://scroll-rpc.publicnode.com',

    // Other services
    WALLET_CONNECT: process.env.NEXT_PUBLIC_WS_WALLET_CONNECT || 'wss://relay.walletconnect.org',
};

// WebSocket endpoint getter
export const getWebSocketEndpoint = (network: keyof typeof WS_URLS): string => {
    const endpoint = WS_URLS[network];
    if (!endpoint) {
        console.warn(`WebSocket endpoint for ${network} not configured. Using Ethereum as fallback.`);
        return WS_URLS.ETHEREUM;
    }
    return endpoint;
};

// Get Ethereum WebSocket endpoint
export const getEthereumWS = (): string => getWebSocketEndpoint('ETHEREUM');

// Get Polygon WebSocket endpoint
export const getPolygonWS = (): string => getWebSocketEndpoint('POLYGON');

// Get BSC WebSocket endpoint
export const getBscWS = (): string => getWebSocketEndpoint('BSC');

// Get Avalanche WebSocket endpoint
export const getAvalancheWS = (): string => getWebSocketEndpoint('AVALANCHE');

// Get Fantom WebSocket endpoint
export const getFantomWS = (): string => getWebSocketEndpoint('FANTOM');

// Get Arbitrum WebSocket endpoint
export const getArbitrumWS = (): string => getWebSocketEndpoint('ARBITRUM');

// Get Optimism WebSocket endpoint
export const getOptimismWS = (): string => getWebSocketEndpoint('OPTIMISM');

// Get Base WebSocket endpoint
export const getBaseWS = (): string => getWebSocketEndpoint('BASE');

// Get Linea WebSocket endpoint
export const getLineaWS = (): string => getWebSocketEndpoint('LINEA');

// Get Scroll WebSocket endpoint
export const getScrollWS = (): string => getWebSocketEndpoint('SCROLL');

// Get WalletConnect WebSocket endpoint
export const getWalletConnectWS = (): string => getWebSocketEndpoint('WALLET_CONNECT');

// Get a custom WebSocket endpoint by name
export const getCustomWS = (name: keyof typeof WS_URLS): string => getWebSocketEndpoint(name);

// Export all WebSocket URLs for direct access if needed
export default WS_URLS;