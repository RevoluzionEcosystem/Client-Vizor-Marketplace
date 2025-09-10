"use client";

import { useState } from 'react';
import { getNetworkIconPath } from "@/lib/icon-utils";

// Token type definition
export interface Token {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    image?: string;
    logoURI?: string;
    title?: string;
    value?: string;
    imgLink?: string;
    chainId?: number;
}

// Network type definition
export interface Network {
    id: string;
    chain_id: number;
    name: string;
    short: string;
    value: string;
    link: string;
    icon: string;
    color?: string;
    background?: string;
    providers: {
        crossChain: string[];
        onChain: string[];
    }
}

// Network color mapping for UI
const networkColors: Record<string, { color: string, background: string }> = {
    eth: { color: "#627EEA", background: "rgba(98, 126, 234, 0.1)" },
    matic: { color: "#8247E5", background: "rgba(130, 71, 229, 0.1)" },
    bsc: { color: "#F0B90B", background: "rgba(240, 185, 11, 0.1)" },
    arbitrum: { color: "#28A0F0", background: "rgba(40, 160, 240, 0.1)" },
    optimism: { color: "#FF0420", background: "rgba(255, 4, 32, 0.1)" },
    avalanche: { color: "#E84142", background: "rgba(232, 65, 66, 0.1)" },
    fantom: { color: "#1969FF", background: "rgba(25, 105, 255, 0.1)" },
    base: { color: "#0052FF", background: "rgba(0, 82, 255, 0.1)" },
    zksync: { color: "#4E529A", background: "rgba(78, 82, 154, 0.1)" },
    linea: { color: "#121212", background: "rgba(18, 18, 18, 0.1)" },
    scroll: { color: "#F8B4B5", background: "rgba(248, 180, 181, 0.1)" },
    mantle: { color: "#0A0B0B", background: "rgba(10, 11, 11, 0.1)" },
    blast: { color: "#CCFF00", background: "rgba(204, 255, 0, 0.1)" },
    polygon_zkevm: { color: "#8247E5", background: "rgba(130, 71, 229, 0.1)" },
    moonbeam: { color: "#53CEF9", background: "rgba(83, 206, 249, 0.1)" },
    moonriver: { color: "#F2A007", background: "rgba(242, 160, 7, 0.1)" },
    gnosis: { color: "#3E6957", background: "rgba(62, 105, 87, 0.1)" },
    celo: { color: "#FBCC5C", background: "rgba(251, 204, 92, 0.1)" },
    aurora: { color: "#70D44B", background: "rgba(112, 212, 75, 0.1)" },
    mode: { color: "#1DB990", background: "rgba(29, 185, 144, 0.1)" },
    rootstock: { color: "#1A1A1A", background: "rgba(26, 26, 26, 0.1)" },
    fuse: { color: "#46e8b6", background: "rgba(70, 232, 182, 0.1)" },
};

// Network data with chain IDs and other details
export const networkData: Record<string, { chain_id: number, name: string, short: string, link: string }> = {
    eth: { chain_id: 1, name: "Ethereum", short: "Ethereum", link: "etherscan.io" },
    matic: { chain_id: 137, name: "Polygon", short: "Polygon", link: "polygonscan.com" },
    bsc: { chain_id: 56, name: "BNB Chain", short: "BNB Chain", link: "bscscan.com" },
    arbitrum: { chain_id: 42161, name: "Arbitrum", short: "Arbitrum", link: "arbiscan.io" },
    optimism: { chain_id: 10, name: "Optimism", short: "Optimism", link: "optimistic.etherscan.io" },
    avalanche: { chain_id: 43114, name: "Avalanche", short: "Avalanche", link: "snowtrace.io" },
    fantom: { chain_id: 250, name: "Fantom", short: "Fantom", link: "ftmscan.com" },
    base: { chain_id: 8453, name: "Base", short: "Base", link: "basescan.org" },
    zksync: { chain_id: 324, name: "zkSync Era", short: "zkSync", link: "explorer.zksync.io" },
    linea: { chain_id: 59144, name: "Linea", short: "Linea", link: "lineascan.build" },
    scroll: { chain_id: 534352, name: "Scroll", short: "Scroll", link: "scrollscan.com" },
    mantle: { chain_id: 5000, name: "Mantle", short: "Mantle", link: "explorer.mantle.xyz" },
    blast: { chain_id: 81457, name: "Blast", short: "Blast", link: "blastscan.io" },
    polygon_zkevm: { chain_id: 1101, name: "Polygon zkEVM", short: "Polygon zkEVM", link: "zkevm.polygonscan.com" },
    moonbeam: { chain_id: 1284, name: "Moonbeam", short: "Moonbeam", link: "moonbeam.moonscan.io" },
    moonriver: { chain_id: 1285, name: "Moonriver", short: "Moonriver", link: "moonriver.moonscan.io" },
    gnosis: { chain_id: 100, name: "Gnosis", short: "Gnosis", link: "gnosisscan.io" },
    celo: { chain_id: 42220, name: "Celo", short: "Celo", link: "explorer.celo.org" },
    aurora: { chain_id: 1313161554, name: "Aurora", short: "Aurora", link: "aurorascan.dev" },
    mode: { chain_id: 34443, name: "Mode", short: "Mode", link: "explorer.mode.network" },
    rootstock: { chain_id: 30, name: "Rootstock", short: "Rootstock", link: "explorer.rootstock.io" },
    fuse: { chain_id: 122, name: "Fuse", short: "Fuse", link: "explorer.fuse.io" }
};

// Provider mapping for supported operations
const providerMapping: Record<string, {
    crossChain: string[],
    onChain: string[]
}> = {
    eth: {
        crossChain: ["lifi", "xy", "squidrouter", "rango", "changenow", "stargate_v2"],
        onChain: ["UNISWAP_V2", "UNI_SWAP_V3"]
    },
    matic: {
        crossChain: ["lifi", "xy", "squidrouter", "rango", "changenow", "stargate_v2"],
        onChain: ["QUICK_SWAP", "UNI_SWAP_V3", "QUICK_SWAP_V3"]
    },
    bsc: {
        crossChain: ["lifi", "xy", "squidrouter", "rango", "changenow", "stargate_v2"],
        onChain: ["PANCAKE_SWAP"]
    },
    arbitrum: {
        crossChain: ["lifi", "xy", "squidrouter", "rango", "changenow"],
        onChain: ["SUSHI_SWAP", "UNI_SWAP_V3"]
    },
    optimism: {
        crossChain: ["lifi", "xy", "squidrouter", "rango", "changenow"],
        onChain: ["UNI_SWAP_V3"]
    },
    avalanche: {
        crossChain: ["lifi", "xy", "squidrouter", "rango", "changenow"],
        onChain: ["TRADER_JOE"]
    },
    base: {
        crossChain: ["lifi", "xy", "squidrouter", "rango"],
        onChain: ["UNI_SWAP_V3"]
    },
    zksync: {
        crossChain: ["lifi", "xy", "squidrouter"],
        onChain: ["SYNC_SWAP"]
    },
    fantom: {
        crossChain: ["lifi", "xy", "squidrouter", "rango"],
        onChain: ["SPIRIT_SWAP"]
    },
    linea: {
        crossChain: ["lifi", "xy", "squidrouter"],
        onChain: ["HORIZON_DEX"]
    },    
    scroll: {
        crossChain: ["lifi", "xy"],
        onChain: ["SCROLL_SWAP"]
    },
    gnosis: {
        crossChain: ["lifi", "xy", "squidrouter", "rango"],
        onChain: ["GNOSISSWAP"]
    },
    aurora: {
        crossChain: ["lifi", "xy", "squidrouter", "rango"],
        onChain: ["TRISOLARIS"]
    },
    rootstock: {
        crossChain: ["lifi", "xy"],
        onChain: ["SOVRYN"]
    },
    fuse: {
        crossChain: ["lifi", "xy"],
        onChain: ["FUSESWAP"]
    },
    moonriver: {
        crossChain: ["lifi", "xy", "squidrouter", "rango"],
        onChain: ["SOLARSWAP"]
    },
    celo: {
        crossChain: ["lifi", "xy", "squidrouter"],
        onChain: ["UBESWAP"]
    }
};

// Hardcoded token lists
const hardcodedTokens: Record<string, Token[]> = {
    // Comprehensive whitelist tokens for major networks
    eth: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 1
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 1
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 1
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 1
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 1
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 1
        },
        {
            name: "Uniswap",
            symbol: "UNI",
            decimals: 18,
            address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            image: "/assets/tokens/UNI.svg",
            title: "UNI",
            chainId: 1
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 1
        },
        {
            name: "Aave",
            symbol: "AAVE",
            decimals: 18,
            address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
            image: "/assets/tokens/AAVE.svg",
            title: "AAVE",
            chainId: 1
        },
        {
            name: "Compound",
            symbol: "COMP",
            decimals: 18,
            address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
            image: "/assets/tokens/COMP.svg",
            title: "COMP",
            chainId: 1
        },
        {
            name: "Maker",
            symbol: "MKR",
            decimals: 18,
            address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
            image: "/assets/tokens/MKR.svg",
            title: "MKR",
            chainId: 1
        },
        {
            name: "Synthetix Network Token",
            symbol: "SNX",
            decimals: 18,
            address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
            image: "/assets/tokens/SNX.svg",
            title: "SNX",
            chainId: 1
        },
        {
            name: "Curve DAO Token",
            symbol: "CRV",
            decimals: 18,
            address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
            image: "/assets/tokens/CRV.svg",
            title: "CRV",
            chainId: 1
        }
    ],

    // BNB Chain (chain_id: 56)
    bsc: [
        {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/BNB.svg",
            title: "BNB",
            chainId: 56
        },
        {
            name: "Wrapped BNB",
            symbol: "WBNB",
            decimals: 18,
            address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
            image: "/assets/images/w3w.svg",
            title: "WBNB",
            chainId: 56
        },
        {
            name: "Vizor",
            symbol: "W3W",
            decimals: 18,
            address: "0x0079914B3C6fF1867b62c2CF8F108126970EAb6e",
            image: "/assets/tokens/CAKE.svg",
            title: "CAKE",
            chainId: 56
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 18,
            address: "0x55d398326f99059fF775485246999027B3197955",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 56
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 18,
            address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 56
        },
        {
            name: "Binance USD",
            symbol: "BUSD",
            decimals: 18,
            address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            image: "/assets/tokens/BUSD.svg",
            title: "BUSD",
            chainId: 56
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 56
        },
        {
            name: "PancakeSwap Token",
            symbol: "CAKE",
            decimals: 18,
            address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
            image: "/assets/tokens/CAKE.svg",
            title: "CAKE",
            chainId: 56
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 56
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 56
        },
        {
            name: "Venus",
            symbol: "XVS",
            decimals: 18,
            address: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
            image: "/assets/tokens/XVS.svg",
            title: "XVS",
            chainId: 56
        },
        {
            name: "Alpaca Finance",
            symbol: "ALPACA",
            decimals: 18,
            address: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
            image: "/assets/tokens/ALPACA.svg",
            title: "ALPACA",
            chainId: 56
        },
        {
            name: "Revoluzion",
            symbol: "RVZ",
            decimals: 9,
            address: "0x7D89c67d3c4E72E8c5c64BE201dC225F99d16aCa",
            image: "/assets/tokens/w3w.svg",
            title: "RVZ",
            chainId: 56
        }
    ],

    // Polygon (chain_id: 137)
    matic: [
        {
            name: "Polygon",
            symbol: "MATIC",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/MATIC.svg",
            title: "MATIC",
            chainId: 137
        },
        {
            name: "Wrapped Matic",
            symbol: "WMATIC",
            decimals: 18,
            address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            image: "/assets/tokens/WMATIC.svg",
            title: "WMATIC",
            chainId: 137
        },
        {
            name: "USD Coin (PoS)",
            symbol: "USDC",
            decimals: 6,
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 137
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 137
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 137
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 137
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 137
        },
        {
            name: "Aave",
            symbol: "AAVE",
            decimals: 18,
            address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
            image: "/assets/tokens/AAVE.svg",
            title: "AAVE",
            chainId: 137
        },
        {
            name: "SushiToken",
            symbol: "SUSHI",
            decimals: 18,
            address: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
            image: "/assets/tokens/SUSHI.svg",
            title: "SUSHI",
            chainId: 137
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 137
        },
        {
            name: "QuickSwap",
            symbol: "QUICK",
            decimals: 18,
            address: "0xB5C064F955D8e7F38fE0460C556a72987494eE17",
            image: "/assets/tokens/QUICK.svg",
            title: "QUICK",
            chainId: 137
        }
    ],

    // Arbitrum (chain_id: 42161)
    arbitrum: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 42161
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 42161
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 42161
        },
        {
            name: "USD Coin (Bridged)",
            symbol: "USDC.e",
            decimals: 6,
            address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
            image: "/assets/tokens/USDC.svg",
            title: "USDC.e",
            chainId: 42161
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 42161
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 42161
        },
        {
            name: "Arbitrum",
            symbol: "ARB",
            decimals: 18,
            address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
            image: "/assets/tokens/ARB.svg",
            title: "ARB",
            chainId: 42161
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 42161
        },
        {
            name: "GMX",
            symbol: "GMX",
            decimals: 18,
            address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
            image: "/assets/tokens/GMX.svg",
            title: "GMX",
            chainId: 42161
        },
        {
            name: "Magic",
            symbol: "MAGIC",
            decimals: 18,
            address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
            image: "/assets/tokens/MAGIC.svg",
            title: "MAGIC",
            chainId: 42161
        }
    ],

    // Optimism (chain_id: 10)
    optimism: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 10
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x4200000000000000000000000000000000000006",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 10
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 10
        },
        {
            name: "USD Coin (Bridged)",
            symbol: "USDC.e",
            decimals: 6,
            address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
            image: "/assets/tokens/USDC.svg",
            title: "USDC.e",
            chainId: 10
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 10
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 10
        },
        {
            name: "Optimism",
            symbol: "OP",
            decimals: 18,
            address: "0x4200000000000000000000000000000000000042",
            image: "/assets/tokens/OP.svg",
            title: "OP",
            chainId: 10
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 10
        },
        {
            name: "Synthetix Network Token",
            symbol: "SNX",
            decimals: 18,
            address: "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
            image: "/assets/tokens/SNX.svg",
            title: "SNX",
            chainId: 10
        },
        {
            name: "Velodrome",
            symbol: "VELO",
            decimals: 18,
            address: "0x9560e827aF36c94D2Ac33a39bCE2EdBe5c5118D2",
            image: "/assets/tokens/VELO.svg",
            title: "VELO",
            chainId: 10
        }
    ],

    // Avalanche (chain_id: 43114)
    avalanche: [
        {
            name: "Avalanche",
            symbol: "AVAX",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/AVAX.svg",
            title: "AVAX",
            chainId: 43114
        },
        {
            name: "Wrapped AVAX",
            symbol: "WAVAX",
            decimals: 18,
            address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
            image: "/assets/tokens/WAVAX.svg",
            title: "WAVAX",
            chainId: 43114
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 43114
        },
        {
            name: "USD Coin (Bridged)",
            symbol: "USDC.e",
            decimals: 6,
            address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
            image: "/assets/tokens/USDC.svg",
            title: "USDC.e",
            chainId: 43114
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 43114
        },
        {
            name: "Tether USD (Bridged)",
            symbol: "USDT.e",
            decimals: 6,
            address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
            image: "/assets/tokens/USDT.svg",
            title: "USDT.e",
            chainId: 43114
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 43114
        },
        {
            name: "Wrapped BTC",
            symbol: "WBTC",
            decimals: 8,
            address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 43114
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH.e",
            decimals: 18,
            address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
            image: "/assets/tokens/WETH.svg",
            title: "WETH.e",
            chainId: 43114
        },
        {
            name: "Chainlink Token",
            symbol: "LINK.e",
            decimals: 18,
            address: "0x5947BB275c521040051D82396192181b413227A3",
            image: "/assets/tokens/LINK.svg",
            title: "LINK.e",
            chainId: 43114
        },
        {
            name: "Joe Token",
            symbol: "JOE",
            decimals: 18,
            address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
            image: "/assets/tokens/JOE.svg",
            title: "JOE",
            chainId: 43114
        }
    ],

    // Fantom (chain_id: 250)
    fantom: [
        {
            name: "Fantom",
            symbol: "FTM",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/FTM.svg",
            title: "FTM",
            chainId: 250
        },
        {
            name: "Wrapped Fantom",
            symbol: "WFTM",
            decimals: 18,
            address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
            image: "/assets/tokens/WFTM.svg",
            title: "WFTM",
            chainId: 250
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 250
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 250
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 250
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 250
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 250
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 250
        },
        {
            name: "SpookySwap",
            symbol: "BOO",
            decimals: 18,
            address: "0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE",
            image: "/assets/tokens/BOO.svg",
            title: "BOO",
            chainId: 250
        }
    ],

    // Base (chain_id: 8453)
    base: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 8453
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x4200000000000000000000000000000000000006",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 8453
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 8453
        },
        {
            name: "USD Coin (Bridged)",
            symbol: "USDC.e",
            decimals: 6,
            address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6ca",
            image: "/assets/tokens/USDC.svg",
            title: "USDC.e",
            chainId: 8453
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 8453
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 8453
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 8453
        },
        {
            name: "Aerodrome",
            symbol: "AERO",
            decimals: 18,
            address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
            image: "/assets/tokens/AERO.svg",
            title: "AERO",
            chainId: 8453
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x3c3a81e81dc49A522A592e7622A7E711c06bf354",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 8453
        }
    ],

    // zkSync Era (chain_id: 324)
    zksync: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 324
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 324
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 324
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 324
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0xBBeB516fb02a01611cBBE0453Fe3c580D7281011",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 324
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0x40609141Db628BeEE3BfAB8034Fc2D8278D0Cc78",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 324
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 324
        },
        {
            name: "Mute.io",
            symbol: "MUTE",
            decimals: 18,
            address: "0x0e97C7a0F8B2C9885C8ac9fC6136e829CbC21d42",
            image: "/assets/tokens/MUTE.svg",
            title: "MUTE",
            chainId: 324
        }
    ],

    // Linea (chain_id: 59144)
    linea: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 59144
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 59144
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 59144
        },
        {
            name: "USD Coin (Bridged)",
            symbol: "USDC.e",
            decimals: 6,
            address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            image: "/assets/tokens/USDC.svg",
            title: "USDC.e",
            chainId: 59144
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0xA219439258ca9da29E9Cc4cE5596924745e12B93",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 59144
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x4Af15ec2A0BD43Db68d908C7dDD7E1C420dBd6E0",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 59144
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 59144
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 59144
        }
    ],
    
    // Scroll (chain_id: 534352)
    scroll: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 534352
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x5300000000000000000000000000000000000004",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 534352
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 534352
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 534352
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 534352
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 534352
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 534352
        }
    ],

    // Mantle (chain_id: 5000)
    mantle: [
        {
            name: "Mantle",
            symbol: "MNT",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/MNT.svg",
            title: "MNT",
            chainId: 5000
        },
        {
            name: "Wrapped Mantle",
            symbol: "WMNT",
            decimals: 18,
            address: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
            image: "/assets/tokens/WMNT.svg",
            title: "WMNT",
            chainId: 5000
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 5000
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 5000
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x940578F6BC1be6A58578516241F9626F7B2C7c52",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 5000
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 5000
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0xCAbAE6f6Ea1ecaB08Ad02fE02Ce9A44F09aebfA2",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 5000
        }
    ],

    // Blast (chain_id: 81457)
    blast: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 81457
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x4300000000000000000000000000000000000004",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 81457
        },
        {
            name: "USD Coin",
            symbol: "USDB",
            decimals: 18,
            address: "0x4300000000000000000000000000000000000003",
            image: "/assets/tokens/USDC.svg",
            title: "USDB",
            chainId: 81457
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x4300000000000000000000000000000000000002",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 81457
        },
        {
            name: "Meme",
            symbol: "MEME",
            decimals: 18,
            address: "0xA106dd3Bc6C42B3f28616FfAB615c7d494Eb629D",
            image: "/assets/tokens/MEME.svg",
            title: "MEME",
            chainId: 81457
        },
        {
            name: "Blast NFT",
            symbol: "BNFT",
            decimals: 18,
            address: "0x5da77813a83e1f6f2844e32a126464bd4445cd13",
            image: "/assets/tokens/BNFT.svg",
            title: "BNFT",
            chainId: 81457
        }
    ],

    // Polygon zkEVM (chain_id: 1101)
    polygon_zkevm: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 1101
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 1101
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 1101
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x1E4a5963aBFD975d8c9021ce480b42188849D41d",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 1101
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0xC5015b9d9161Dca7e18e32f6f25C4aD850731Fd4",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 1101
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0xEA034fb02eB1808C2cc3adbC15f447B93CbE08e1",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 1101
        },
        {
            name: "Polygon",
            symbol: "MATIC",
            decimals: 18,
            address: "0xa2036f0538221a77A3937F1379699f44945018d0",
            image: "/assets/tokens/MATIC.svg",
            title: "MATIC",
            chainId: 1101
        },
        {
            name: "Chainlink",
            symbol: "LINK",
            decimals: 18,
            address: "0x4B16df60D7df32D349F95A49CFda1D788B847Fc0",
            image: "/assets/tokens/LINK.svg",
            title: "LINK",
            chainId: 1101
        }
    ],    // Moonbeam (chain_id: 1284)
    moonbeam: [
        {
            name: "Glimmer",
            symbol: "GLMR",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/GLMR.svg",
            title: "GLMR",
            chainId: 1284
        },
        {
            name: "Wrapped Glimmer",
            symbol: "WGLMR",
            decimals: 18,
            address: "0xAcc15dC74880C9944775448304B263D191c6077F",
            image: "/assets/tokens/WGLMR.svg",
            title: "WGLMR",
            chainId: 1284
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 1284
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 1284
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x765277EebeCA2e31912C9946eAe1021199B39C61",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 1284
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x30D2a9F5FDf90ACe8c17952cbb4eE48a55D916A7",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 1284
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x922D641a426DcFFaeF11680e5358F34d97d112E1",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 1284
        }
    ],
    
    // Moonriver (chain_id: 1285)
    moonriver: [
        {
            name: "Moonriver",
            symbol: "MOVR",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/MOVR.svg",
            title: "MOVR",
            chainId: 1285
        },
        {
            name: "Wrapped Moonriver",
            symbol: "WMOVR",
            decimals: 18,
            address: "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
            image: "/assets/tokens/WMOVR.svg",
            title: "WMOVR",
            chainId: 1285
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 1285
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0xB44a9B6905aF7c801311e8F4E76932ee959c663C",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 1285
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 1285
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 1285
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 1285
        },
        {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
            address: "0x2bF9b864cdc97b08B6D79ad4663e71B8aB65c45c",
            image: "/assets/tokens/BNB.svg",
            title: "BNB",
            chainId: 1285
        },
        {
            name: "SolarBeam",
            symbol: "SOLAR",
            decimals: 18,
            address: "0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B",
            image: "/assets/tokens/SOLAR.svg",
            title: "SOLAR",
            chainId: 1285
        }
    ],

    // Mode (chain_id: 34443)
    mode: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 34443
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x4200000000000000000000000000000000000006",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 34443
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xd988097fb8612cc24bd8c0ec3e82e26f5d11d30e",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 34443
        },
        {
            name: "Mode Dollar",
            symbol: "USDR",
            decimals: 18,
            address: "0xf895cc43d36070a5f3cdc8338ff18bd36cca7a6c",
            image: "/assets/tokens/USDR.svg",
            title: "USDR",
            chainId: 34443
        }
    ],

    rootstock: [
        {
            name: "Rootstock",
            symbol: "RBTC",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/RBTC.svg",
            title: "RBTC",
            chainId: 30
        },
        {
            name: "Wrapped RBTC",
            symbol: "WRBTC",
            decimals: 18,
            address: "0x967f8799af07df1534d48a95a5c9febe92c53ae0",
            image: "/assets/tokens/WRBTC.svg",
            title: "WRBTC",
            chainId: 30
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 18,
            address: "0x1bda44fda023f2af8280a16fd1b01d1a493ba6c4",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 30
        },
        {
            name: "DAI Dollar",
            symbol: "DAI",
            decimals: 18,
            address: "0x6b1a73d547f4009a26b8485b63d7015d248ad406",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 30
        },
        {
            name: "Sovryn",
            symbol: "SOV",
            decimals: 18,
            address: "0xefc78fc7d48b64958315949279ba181c2114abbd",
            image: "/assets/tokens/SOV.svg",
            title: "SOV",
            chainId: 30
        }
    ],

    fuse: [
        {
            name: "Fuse",
            symbol: "FUSE",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/FUSE.svg",
            title: "FUSE",
            chainId: 122
        },
        {
            name: "Wrapped Fuse",
            symbol: "WFUSE",
            decimals: 18,
            address: "0x0be9e53fd7edac9f859882afdda116645287c629",
            image: "/assets/tokens/WFUSE.svg",
            title: "WFUSE",
            chainId: 122
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x620fd5fa44be6af63715ef4e65ddfa0387ad13f5",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 122
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0xfadbbf8ce7d5b7041be672561bba99f79c532e10",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 122
        },
        {
            name: "Dai Stablecoin",
            symbol: "DAI",
            decimals: 18,
            address: "0x94ba7a27c7a95863d1bdc7645ac2951e0cca06ba",
            image: "/assets/tokens/DAI.svg",
            title: "DAI",
            chainId: 122
        },
        {
            name: "GoodDollar",
            symbol: "G$",
            decimals: 18,
            address: "0x495d133b938596c9984d462f007b676bdc57ecec",
            image: "/assets/tokens/G$.svg",
            title: "G$",
            chainId: 122
        }
    ],

    gnosis: [
        {
            name: "xDAI",
            symbol: "xDAI",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/XDAI.svg",
            title: "xDAI",
            chainId: 100
        },
        {
            name: "Wrapped xDAI",
            symbol: "WXDAI",
            decimals: 18,
            address: "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d",
            image: "/assets/tokens/WXDAI.svg",
            title: "WXDAI",
            chainId: 100
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 100
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x4ecaba5870353805a9f068101a40e0f32ed605c6",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 100
        },
        {
            name: "Gnosis",
            symbol: "GNO",
            decimals: 18,
            address: "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
            image: "/assets/tokens/GNO.svg",
            title: "GNO",
            chainId: 100
        }
    ],    aurora: [
        {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
            address: "0x0000000000000000000000000000000000000000",
            image: "/assets/tokens/ETH.svg",
            title: "ETH",
            chainId: 1313161554
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 1313161554
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 1313161554
        },
        {
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            address: "0x4988a896b1227218e4A686fdE5EabdcAbd91571f",
            image: "/assets/tokens/USDT.svg",
            title: "USDT",
            chainId: 1313161554
        },
        {
            name: "Aurora",
            symbol: "AURORA",
            decimals: 18,
            address: "0x8BEc47865aDe3B172A928df8f990Bc7f2A3b9f79",
            image: "/assets/tokens/AURORA.svg",
            title: "AURORA",
            chainId: 1313161554
        },
        {
            name: "Near",
            symbol: "NEAR",
            decimals: 24,
            address: "0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d",
            image: "/assets/tokens/NEAR.svg",
            title: "NEAR",
            chainId: 1313161554
        }
    ],
    
    // Celo (chain_id: 42220)
    celo: [
        {
            name: "Celo",
            symbol: "CELO",
            decimals: 18,
            address: "0x471EcE3750Da237f93B8E339c536989b8978a438",
            image: "/assets/tokens/CELO.svg",
            title: "CELO",
            chainId: 42220
        },
        {
            name: "Celo Dollar",
            symbol: "cUSD",
            decimals: 18,
            address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
            image: "/assets/tokens/CUSD.svg",
            title: "cUSD",
            chainId: 42220
        },
        {
            name: "Celo Euro",
            symbol: "cEUR",
            decimals: 18,
            address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
            image: "/assets/tokens/CEUR.svg",
            title: "cEUR",
            chainId: 42220
        },
        {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            address: "0x37f750B7cC259A2f741AF45294f6a16572CF5cAd",
            image: "/assets/tokens/USDC.svg",
            title: "USDC",
            chainId: 42220
        },
        {
            name: "Wrapped Ethereum",
            symbol: "WETH",
            decimals: 18,
            address: "0x66803FB87aBd4aaC3cbB3fAd7C3aa01f6F3FB207",
            image: "/assets/tokens/WETH.svg",
            title: "WETH",
            chainId: 42220
        },
        {
            name: "Wrapped Bitcoin",
            symbol: "WBTC",
            decimals: 8,
            address: "0xBAAB46E28388d2779e6E31Fd00cF0e5Ad95E327B",
            image: "/assets/tokens/WBTC.svg",
            title: "WBTC",
            chainId: 42220
        }
    ],
};

// Export the function to get tokens by network
export function getTokensByNetwork(network: string): Token[] {
    if (!network) return [];
    
    // Convert network to lowercase to ensure consistent lookup
    const networkKey = network.toLowerCase();
    
    // Map common aliases to their standardized keys
    const networkAliasMap: Record<string, string> = {
        'bnb': 'bsc',
        'bnb-chain': 'bsc',
        'binance-smart-chain': 'bsc',
        'binance': 'bsc',
        'polygon-pos': 'matic',
        'polygon': 'matic',
        'ethereum': 'eth',
        'avalanche': 'avax',
        'arbitrum-one': 'arbitrum',
        'optimistic-ethereum': 'optimism',
        'fantom-opera': 'fantom'
    };
    
    // Check if we have an alias mapping for this network
    const standardizedKey = networkAliasMap[networkKey] || networkKey;
    
    // Return the tokens for the specified network, or an empty array if not found
    return hardcodedTokens[standardizedKey] || [];
}

// React hook for managing token data
export function useTokens() {
    const [tokensByNetwork] = useState<Record<string, Token[]>>(hardcodedTokens);
    const [loading] = useState<Record<string, boolean>>({});
    const [error] = useState<Record<string, string>>({});

    // Function to fetch tokens for a specific network (returns immediately with hardcoded data)
    const fetchNetworkTokens = async (networkId: string) => {
        // This function now does nothing as we're only using hardcoded values
        console.log(`Using hardcoded tokens for ${networkId}`);
    };

    return {
        tokens: tokensByNetwork,
        loading,
        error,
        fetchNetworkTokens
    };
}

// Create networks list with all required properties
export function createNetworksList() {
    return Object.entries(networkData).map(([id, data]) => {
        return {
            id,
            chain_id: data.chain_id,
            name: data.name,
            short: data.short,
            value: id,
            link: data.link,
            icon: getNetworkIconPath(id),
            ...networkColors[id],
            providers: providerMapping[id] || {
                crossChain: [],
                onChain: []
            }
        } as Network;
    });
}

// Static networks list
export const networks = createNetworksList();

// Function to get supported networks for different operation types
export const getSupportedNetworks = (type?: string): Network[] => {
    if (type === 'crosschain') {
        // Return networks that support cross-chain swaps
        return networks.filter(network =>
            network.providers && network.providers.crossChain.length > 0
        );
    } else if (type === 'onchain') {
        // Return networks that support on-chain swaps
        return networks.filter(network =>
            network.providers && network.providers.onChain.length > 0
        );
    }
    // Return all networks
    return networks;
};

// Function to get available networks for a specific operation
export const getAvailableNetworks = (operation: string, provider?: string): Network[] => {
    switch (operation) {
        case 'swap':
            // On-chain swaps
            return networks.filter(network =>
                network.providers?.onChain.length > 0 &&
                (!provider || network.providers.onChain.includes(provider))
            );
        case 'crosschain':
            // Cross-chain swaps
            return networks.filter(network =>
                network.providers?.crossChain.length > 0 &&
                (!provider || network.providers.crossChain.includes(provider))
            );
        case 'all':
        default:
            // All networks
            return networks;
    };
};

// Get providers for a specific network
export const getProvidersForNetwork = (networkId: string, operation: 'crosschain' | 'onchain') => {
    const network = networks.find(n => n.id === networkId);
    if (!network || !network.providers) return [];

    return operation === 'crosschain'
        ? network.providers.crossChain
        : network.providers.onChain;
};

// Export everything for easy access
export default {
    networks,
    useTokens,
    getTokensByNetwork,
    getSupportedNetworks,
    getAvailableNetworks,
    getProvidersForNetwork
};