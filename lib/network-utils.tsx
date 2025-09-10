"use client"

// Network mapping utility for standardizing network identifiers across the application
// This file provides a centralized way to handle different forms of network names and slugs

/**
 * Comprehensive mapping between network codes and their various representations
 * Each network has:
 * - id: The standard short code used in URLs (e.g., 'eth', 'bsc')
 * - slug: URL-friendly name with hyphens (e.g., 'ethereum', 'binance-smart-chain')
 * - name: Human-readable name (e.g., 'Ethereum', 'Binance Smart Chain')
 * - aliases: Array of alternative names that should map to this network
 * - apiKey: The identifier used in APIs (e.g., coingecko_asset_platform_id)
 * - explorer: The base URL for the blockchain explorer 
 * - blockExplorerUrls: Additional explorer URLs as array (for EIP-3085 wallet integration)
 * - publicNodeRpc: PublicNode RPC URL for the network (if available)
 * - rpcUrls: HTTP and WebSocket RPC endpoints for the network
 */
export const NETWORK_MAP = {
    // Ethereum
    eth: {
        id: 'eth',
        slug: 'ethereum',
        name: 'Ethereum',
        aliases: ['ethereum', 'eth', 'ethereum-network'],
        apiKey: 'ethereum',
        chainId: 1,
        explorer: 'https://etherscan.io',
        blockExplorerUrls: ['https://etherscan.io'],
        publicNodeRpc: 'https://ethereum-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://ethereum-rpc.publicnode.com',
                'https://cloudflare-eth.com',
                'https://rpc.ankr.com/eth',
                'https://eth.drpc.org',
                'https://eth.api.onfinality.io/public'
            ],
            wss: [
                'wss://ethereum-rpc.publicnode.com',
                'wss://main-light.eth.linkpool.io',
                'wss://eth.getblock.io/api_key/mainnet/',
                'wss://eth-rpc.gateway.pokt.network'
            ]
        }
    },

    // Binance Smart Chain
    bsc: {
        id: 'bsc',
        slug: 'bsc',
        name: 'Binance Smart Chain',
        aliases: ['binance-smart-chain', 'bsc', 'bnb-chain', 'binance', 'bnb smart chain'],
        apiKey: 'binance-smart-chain',
        chainId: 56,
        explorer: 'https://bscscan.com',
        blockExplorerUrls: ['https://bscscan.com'],
        publicNodeRpc: 'https://bsc-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://bsc-rpc.publicnode.com',
                'https://bsc-dataseed.binance.org',
                'https://rpc.ankr.com/bsc',
                'https://bsc.drpc.org',
                'https://bsc-mainnet.nodereal.io/v1/'
            ],
            wss: [
                'wss://bsc-rpc.publicnode.com',
                'wss://bsc-ws-node.nariox.org:443',
                'wss://bsc.getblock.io/api_key/mainnet/'
            ]
        }
    },

        // Binance Smart Chain
    bsctestnet: {
        id: 'bsc-testnet',
        slug: 'bsc-testnet',
        name: 'BSC Testnet',
        aliases: ['binance-smart-chain-testnet', 'bsc-testnet', 'bnb-chain-testnet', 'binance-testnet'],
        apiKey: 'bsc-testnet',
        chainId: 97,
        explorer: 'https://testnet.bscscan.com',
        blockExplorerUrls: ['https://testnet.bscscan.com'],
        publicNodeRpc: 'https://bsc-testnet-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://bsc-testnet-rpc.publicnode.com',
            ],
            wss: [
                'wss://bsc-testnet-rpc.publicnode.com',
            ]
        }
    },

    // Polygon
    polygon: {
        id: 'polygon',
        slug: 'polygon',
        name: 'Polygon',
        aliases: ['polygon', 'matic', 'polygon-pos', 'polygon-network'],
        apiKey: 'polygon-pos',
        chainId: 137,
        explorer: 'https://polygonscan.com',
        blockExplorerUrls: ['https://polygonscan.com'],
        publicNodeRpc: 'https://polygon-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://polygon-rpc.publicnode.com',
                'https://polygon-rpc.com',
                'https://rpc.ankr.com/polygon',
                'https://polygon.drpc.org',
                'https://polygon.api.onfinality.io/public'
            ],
            wss: [
                'wss://polygon-rpc.publicnode.com',
                'wss://rpc-mainnet.matic.network',
                'wss://rpc-mainnet.maticvigil.com/ws',
                'wss://matic.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Avalanche
    avax: {
        id: 'avax',
        slug: 'avalanche',
        name: 'Avalanche',
        aliases: ['avalanche', 'avax', 'avalanche-network'],
        apiKey: 'avalanche',
        chainId: 43114,
        explorer: 'https://snowtrace.io',
        blockExplorerUrls: ['https://snowtrace.io'],
        publicNodeRpc: 'https://avalanche-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://avalanche-rpc.publicnode.com',
                'https://api.avax.network/ext/bc/C/rpc',
                'https://rpc.ankr.com/avalanche',
                'https://avalanche.api.onfinality.io/public'
            ],
            wss: [
                'wss://avalanche-rpc.publicnode.com',
                'wss://api.avax.network/ext/bc/C/ws',
                'wss://avalanche.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Arbitrum
    arb: {
        id: 'arb',
        slug: 'arbitrum',
        name: 'Arbitrum',
        aliases: ['arbitrum', 'arb', 'arbitrum-one'],
        apiKey: 'arbitrum-one',
        chainId: 42161,
        explorer: 'https://arbiscan.io',
        blockExplorerUrls: ['https://arbiscan.io'],
        publicNodeRpc: 'https://arbitrum-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://arbitrum-rpc.publicnode.com',
                'https://arb1.arbitrum.io/rpc',
                'https://rpc.ankr.com/arbitrum',
                'https://arbitrum.api.onfinality.io/public',
                'https://arbitrum.drpc.org'
            ],
            wss: [
                'wss://arbitrum-rpc.publicnode.com',
                'wss://arb1.arbitrum.io/rpc',
                'wss://arbitrum.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Optimism
    op: {
        id: 'op',
        slug: 'optimism',
        name: 'Optimism',
        aliases: ['optimism', 'op', 'optimistic-ethereum'],
        apiKey: 'optimistic-ethereum',
        chainId: 10,
        explorer: 'https://optimistic.etherscan.io',
        blockExplorerUrls: ['https://optimistic.etherscan.io'],
        publicNodeRpc: 'https://optimism-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://optimism-rpc.publicnode.com',
                'https://mainnet.optimism.io',
                'https://rpc.ankr.com/optimism',
                'https://optimism.api.onfinality.io/public'
            ],
            wss: [
                'wss://optimism-rpc.publicnode.com',
                'wss://mainnet.optimism.io',
                'wss://optimism.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Fantom
    ftm: {
        id: 'ftm',
        slug: 'fantom',
        name: 'Fantom',
        aliases: ['fantom', 'ftm', 'fantom-opera'],
        apiKey: 'fantom',
        chainId: 250,
        explorer: 'https://ftmscan.com',
        blockExplorerUrls: ['https://ftmscan.com'],
        publicNodeRpc: 'https://fantom-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://fantom-rpc.publicnode.com',
                'https://rpc.ftm.tools',
                'https://rpc.ankr.com/fantom',
                'https://fantom.api.onfinality.io/public',
                'https://fantom.drpc.org'
            ],
            wss: [
                'wss://fantom-rpc.publicnode.com',
                'wss://wsapi.fantom.network',
                'wss://fantom.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Base
    base: {
        id: 'base',
        slug: 'base',
        name: 'Base',
        aliases: ['base', 'base-network', 'base-chain'],
        apiKey: 'base',
        chainId: 8453,
        explorer: 'https://basescan.org',
        blockExplorerUrls: ['https://basescan.org'],
        publicNodeRpc: 'https://base-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://base-rpc.publicnode.com',
                'https://mainnet.base.org',
                'https://rpc.ankr.com/base',
                'https://base.drpc.org'
            ],
            wss: [
                'wss://base-rpc.publicnode.com',
                'wss://base.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Solana
    sol: {
        id: 'sol',
        slug: 'solana',
        name: 'Solana',
        aliases: ['solana', 'sol'],
        apiKey: 'solana',
        chainId: null,  // Not EVM compatible
        explorer: 'https://explorer.solana.com',
        blockExplorerUrls: ['https://explorer.solana.com', 'https://solscan.io'],
        publicNodeRpc: 'https://solana-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://solana-rpc.publicnode.com',
                'https://api.mainnet-beta.solana.com',
                'https://rpc.ankr.com/solana',
                'https://solana.api.onfinality.io/public'
            ],
            wss: [
                'wss://solana-rpc.publicnode.com',
                'wss://api.mainnet-beta.solana.com',
                'wss://solana.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Tron - PublicNode doesn't support Tron
    trx: {
        id: 'trx',
        slug: 'tron',
        name: 'Tron',
        aliases: ['tron', 'trx'],
        apiKey: 'tron',
        chainId: null,  // Not EVM compatible
        explorer: 'https://tronscan.org',
        blockExplorerUrls: ['https://tronscan.org'],
        rpcUrls: {
            http: [
                'https://api.trongrid.io'
            ],
            wss: []
        }
    },

    // SEI - PublicNode doesn't support SEI
    sei: {
        id: 'sei',
        slug: 'sei',
        name: 'SEI Network',
        aliases: ['sei', 'sei-network'],
        apiKey: 'sei-network',
        chainId: null,  // Not EVM compatible
        explorer: 'https://www.seiscan.app',
        blockExplorerUrls: ['https://www.seiscan.app'],
        rpcUrls: {
            http: [
                'https://sei-api.polkachu.com'
            ],
            wss: [
                'wss://sei-api.polkachu.com/websocket'
            ]
        }
    },

    // Cronos
    cro: {
        id: 'cro',
        slug: 'cronos',
        name: 'Cronos',
        aliases: ['cronos', 'cro'],
        apiKey: 'cronos',
        chainId: 25,
        explorer: 'https://cronoscan.com',
        blockExplorerUrls: ['https://cronoscan.com'],
        publicNodeRpc: 'https://cronos-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://cronos-rpc.publicnode.com',
                'https://evm.cronos.org',
                'https://rpc.cronos.org'
            ],
            wss: [
                'wss://cronos-rpc.publicnode.com',
                'wss://cronos.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Gnosis Chain (formerly xDai)
    gno: {
        id: 'gno',
        slug: 'gnosis',
        name: 'Gnosis Chain',
        aliases: ['gnosis', 'gno', 'xdai'],
        apiKey: 'xdai',
        chainId: 100,
        explorer: 'https://gnosisscan.io',
        blockExplorerUrls: ['https://gnosisscan.io'],
        publicNodeRpc: 'https://gnosis-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://gnosis-rpc.publicnode.com',
                'https://rpc.gnosischain.com',
                'https://rpc.ankr.com/gnosis',
                'https://gnosis.api.onfinality.io/public'
            ],
            wss: [
                'wss://gnosis-rpc.publicnode.com',
                'wss://rpc.gnosischain.com/wss',
                'wss://gnosis.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // zkSync Era
    zksync: {
        id: 'zksync',
        slug: 'zksync-era',
        name: 'zkSync Era',
        aliases: ['zksync', 'zksync-era'],
        apiKey: 'zksync',
        chainId: 324,
        explorer: 'https://explorer.zksync.io',
        blockExplorerUrls: ['https://explorer.zksync.io'],
        publicNodeRpc: 'https://zksync-era-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://zksync-era-rpc.publicnode.com',
                'https://mainnet.era.zksync.io',
                'https://zksync.drpc.org'
            ],
            wss: [
                'wss://zksync-era-rpc.publicnode.com',
                'wss://zksync.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Linea
    linea: {
        id: 'linea',
        slug: 'linea',
        name: 'Linea',
        aliases: ['linea'],
        apiKey: 'linea',
        chainId: 59144,
        explorer: 'https://lineascan.build',
        blockExplorerUrls: ['https://lineascan.build'],
        publicNodeRpc: 'https://linea-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://linea-rpc.publicnode.com',
                'https://rpc.linea.build',
                'https://linea.drpc.org'
            ],
            wss: [
                'wss://linea-rpc.publicnode.com',
                'wss://linea.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Mantle
    mantle: {
        id: 'mantle',
        slug: 'mantle',
        name: 'Mantle',
        aliases: ['mantle'],
        apiKey: 'mantle',
        chainId: 5000,
        explorer: 'https://explorer.mantle.xyz',
        blockExplorerUrls: ['https://explorer.mantle.xyz'],
        publicNodeRpc: 'https://mantle-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://mantle-rpc.publicnode.com',
                'https://rpc.mantle.xyz',
                'https://mantle.drpc.org'
            ],
            wss: [
                'wss://mantle-rpc.publicnode.com',
                'wss://mantle.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Celo
    celo: {
        id: 'celo',
        slug: 'celo',
        name: 'Celo',
        aliases: ['celo'],
        apiKey: 'celo',
        chainId: 42220,
        explorer: 'https://celoscan.io',
        blockExplorerUrls: ['https://celoscan.io'],
        publicNodeRpc: 'https://celo-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://celo-rpc.publicnode.com',
                'https://forno.celo.org',
                'https://rpc.ankr.com/celo',
                'https://celo.api.onfinality.io/public'
            ],
            wss: [
                'wss://celo-rpc.publicnode.com',
                'wss://forno.celo.org/ws',
                'wss://celo.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Kava - PublicNode doesn't support Kava
    kava: {
        id: 'kava',
        slug: 'kava',
        name: 'Kava',
        aliases: ['kava'],
        apiKey: 'kava',
        chainId: 2222,
        explorer: 'https://kavascan.com',
        blockExplorerUrls: ['https://kavascan.com'],
        rpcUrls: {
            http: [
                'https://evm.kava.io',
                'https://rpc.kava.io'
            ],
            wss: [
                'wss://wevm.kava.io'
            ]
        }
    },

    // Polygon zkEVM
    polygonzk: {
        id: 'polygonzk',
        slug: 'polygon-zkevm',
        name: 'Polygon zkEVM',
        aliases: ['polygon-zkevm', 'polygonzk'],
        apiKey: 'polygon-zkevm',
        chainId: 1101,
        explorer: 'https://zkevm.polygonscan.com',
        blockExplorerUrls: ['https://zkevm.polygonscan.com'],
        publicNodeRpc: 'https://polygon-zkevm-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://polygon-zkevm-rpc.publicnode.com',
                'https://zkevm-rpc.com',
                'https://rpc.ankr.com/polygon_zkevm'
            ],
            wss: [
                'wss://polygon-zkevm-rpc.publicnode.com',
                'wss://polygon-zkevm.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Filecoin - PublicNode doesn't support Filecoin
    fil: {
        id: 'fil',
        slug: 'filecoin',
        name: 'Filecoin',
        aliases: ['filecoin', 'fil'],
        apiKey: 'filecoin',
        chainId: 314,
        explorer: 'https://filfox.info',
        blockExplorerUrls: ['https://filfox.info'],
        rpcUrls: {
            http: [
                'https://api.node.glif.io/rpc/v1',
                'https://rpc.ankr.com/filecoin'
            ],
            wss: []
        }
    },

    // Klaytn - PublicNode doesn't support Klaytn
    klay: {
        id: 'klay',
        slug: 'klaytn',
        name: 'Klaytn',
        aliases: ['klaytn', 'klay'],
        apiKey: 'klaytn',
        chainId: 8217,
        explorer: 'https://klaytnscope.com',
        blockExplorerUrls: ['https://klaytnscope.com'],
        rpcUrls: {
            http: [
                'https://public-node-api.klaytnapi.com/v1/cypress',
                'https://klaytn.drpc.org'
            ],
            wss: []
        }
    },

    // Aurora
    aurora: {
        id: 'aurora',
        slug: 'aurora',
        name: 'Aurora',
        aliases: ['aurora'],
        apiKey: 'aurora',
        chainId: 1313161554,
        explorer: 'https://aurorascan.dev',
        blockExplorerUrls: ['https://aurorascan.dev'],
        publicNodeRpc: 'https://aurora-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://aurora-rpc.publicnode.com',
                'https://mainnet.aurora.dev',
                'https://aurora.drpc.org'
            ],
            wss: [
                'wss://aurora-rpc.publicnode.com',
                'wss://aurora.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Metis - PublicNode doesn't support Metis
    metis: {
        id: 'metis',
        slug: 'metis',
        name: 'Metis',
        aliases: ['metis'],
        apiKey: 'metis',
        chainId: 1088,
        explorer: 'https://andromeda-explorer.metis.io',
        blockExplorerUrls: ['https://andromeda-explorer.metis.io'],
        rpcUrls: {
            http: [
                'https://andromeda.metis.io/?owner=1088',
                'https://metis.drpc.org'
            ],
            wss: []
        }
    },

    // Moonbeam
    moonbeam: {
        id: 'moonbeam',
        slug: 'moonbeam',
        name: 'Moonbeam',
        aliases: ['moonbeam'],
        apiKey: 'moonbeam',
        chainId: 1284,
        explorer: 'https://moonbeam.moonscan.io',
        blockExplorerUrls: ['https://moonbeam.moonscan.io'],
        publicNodeRpc: 'https://moonbeam-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://moonbeam-rpc.publicnode.com',
                'https://rpc.api.moonbeam.network',
                'https://moonbeam.api.onfinality.io/public',
                'https://moonbeam.drpc.org'
            ],
            wss: [
                'wss://moonbeam-rpc.publicnode.com',
                'wss://wss.api.moonbeam.network',
                'wss://moonbeam.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Moonriver
    moonriver: {
        id: 'moonriver',
        slug: 'moonriver',
        name: 'Moonriver',
        aliases: ['moonriver'],
        apiKey: 'moonriver',
        chainId: 1285,
        explorer: 'https://moonriver.moonscan.io',
        blockExplorerUrls: ['https://moonriver.moonscan.io'],
        publicNodeRpc: 'https://moonriver-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://moonriver-rpc.publicnode.com',
                'https://rpc.api.moonriver.moonbeam.network',
                'https://moonriver.api.onfinality.io/public',
                'https://moonriver.drpc.org'
            ],
            wss: [
                'wss://moonriver-rpc.publicnode.com',
                'wss://wss.api.moonriver.moonbeam.network',
                'wss://moonriver.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Cardano - PublicNode doesn't support non-EVM chains like Cardano
    ada: {
        id: 'ada',
        slug: 'cardano',
        name: 'Cardano',
        aliases: ['cardano', 'ada'],
        apiKey: 'cardano',
        chainId: null,  // Not EVM compatible
        explorer: 'https://cardanoscan.io',
        blockExplorerUrls: ['https://cardanoscan.io', 'https://explorer.cardano.org'],
        rpcUrls: {
            http: [
                'https://cardano-mainnet.blockfrost.io/api/v0'
            ],
            wss: []
        }
    },

    // Polkadot - PublicNode doesn't support non-EVM chains like Polkadot
    dot: {
        id: 'dot',
        slug: 'polkadot',
        name: 'Polkadot',
        aliases: ['polkadot', 'dot'],
        apiKey: 'polkadot',
        chainId: null,  // Not EVM compatible
        explorer: 'https://polkadot.subscan.io',
        blockExplorerUrls: ['https://polkadot.subscan.io']
    },

    // Kusama - PublicNode doesn't support non-EVM chains like Kusama
    ksm: {
        id: 'ksm',
        slug: 'kusama',
        name: 'Kusama',
        aliases: ['kusama', 'ksm'],
        apiKey: 'kusama',
        chainId: null,  // Not EVM compatible
        explorer: 'https://kusama.subscan.io',
        blockExplorerUrls: ['https://kusama.subscan.io']
    },

    // Near Protocol - PublicNode doesn't support non-EVM chains like NEAR
    near: {
        id: 'near',
        slug: 'near',
        name: 'NEAR Protocol',
        aliases: ['near', 'near-protocol'],
        apiKey: 'near-protocol',
        chainId: null,  // Not EVM compatible
        explorer: 'https://explorer.near.org',
        blockExplorerUrls: ['https://explorer.near.org']
    },

    // Algorand - PublicNode doesn't support non-EVM chains like Algorand
    algo: {
        id: 'algo',
        slug: 'algorand',
        name: 'Algorand',
        aliases: ['algorand', 'algo'],
        apiKey: 'algorand',
        chainId: null,  // Not EVM compatible
        explorer: 'https://algoexplorer.io',
        blockExplorerUrls: ['https://algoexplorer.io']
    },

    // Flow - PublicNode doesn't support non-EVM chains like Flow
    flow: {
        id: 'flow',
        slug: 'flow',
        name: 'Flow',
        aliases: ['flow'],
        apiKey: 'flow',
        chainId: null,  // Not EVM compatible
        explorer: 'https://flowscan.org',
        blockExplorerUrls: ['https://flowscan.org']
    },

    // Hedera - PublicNode doesn't support non-EVM chains like Hedera
    hbar: {
        id: 'hbar',
        slug: 'hedera',
        name: 'Hedera',
        aliases: ['hedera', 'hbar'],
        apiKey: 'hedera',
        chainId: null,  // Not EVM compatible
        explorer: 'https://hashscan.io/mainnet',
        blockExplorerUrls: ['https://hashscan.io/mainnet']
    },

    // Internet Computer - PublicNode doesn't support non-EVM chains like ICP
    icp: {
        id: 'icp',
        slug: 'internet-computer',
        name: 'Internet Computer',
        aliases: ['internet-computer', 'icp'],
        apiKey: 'internet-computer',
        chainId: null,  // Not EVM compatible
        explorer: 'https://dashboard.internetcomputer.org',
        blockExplorerUrls: ['https://dashboard.internetcomputer.org']
    },

    // Aptos - PublicNode doesn't support non-EVM chains like Aptos
    apt: {
        id: 'apt',
        slug: 'aptos',
        name: 'Aptos',
        aliases: ['aptos', 'apt'],
        apiKey: 'aptos',
        chainId: null,  // Not EVM compatible
        explorer: 'https://explorer.aptoslabs.com',
        blockExplorerUrls: ['https://explorer.aptoslabs.com']
    },

    // Sui - PublicNode doesn't support non-EVM chains like Sui
    sui: {
        id: 'sui',
        slug: 'sui',
        name: 'Sui',
        aliases: ['sui'],
        apiKey: 'sui',
        chainId: null,  // Not EVM compatible
        explorer: 'https://suiscan.xyz',
        blockExplorerUrls: ['https://suiscan.xyz', 'https://explorer.sui.io']
    },

    // Elrond (MultiversX) - PublicNode doesn't support non-EVM chains like MultiversX
    egld: {
        id: 'egld',
        slug: 'multiversx',
        name: 'MultiversX',
        aliases: ['multiversx', 'egld', 'elrond'],
        apiKey: 'multiversx',
        chainId: null,  // Not EVM compatible
        explorer: 'https://explorer.multiversx.com',
        blockExplorerUrls: ['https://explorer.multiversx.com']
    },

    // OKX Chain - PublicNode doesn't support OKX Chain
    okx: {
        id: 'okx',
        slug: 'okx-chain',
        name: 'OKX Chain',
        aliases: ['okx-chain', 'okx', 'okexchain'],
        apiKey: 'okex-chain',
        chainId: 66,
        explorer: 'https://www.oklink.com/en/okc',
        blockExplorerUrls: ['https://www.oklink.com/en/okc']
    },

    // Concordium - PublicNode doesn't support non-EVM chains like Concordium
    ccd: {
        id: 'ccd',
        slug: 'concordium',
        name: 'Concordium',
        aliases: ['concordium', 'ccd'],
        apiKey: 'concordium',
        chainId: null,  // Not EVM compatible
        explorer: 'https://ccdscan.io',
        blockExplorerUrls: ['https://ccdscan.io']
    },

    // Waves - PublicNode doesn't support non-EVM chains like Waves
    waves: {
        id: 'waves',
        slug: 'waves',
        name: 'Waves',
        aliases: ['waves'],
        apiKey: 'waves',
        chainId: null,  // Not EVM compatible
        explorer: 'https://wavesexplorer.com',
        blockExplorerUrls: ['https://wavesexplorer.com']
    },

    // Cosmos Hub - PublicNode doesn't support non-EVM chains like Cosmos Hub
    atom: {
        id: 'atom',
        slug: 'cosmos',
        name: 'Cosmos Hub',
        aliases: ['cosmos', 'atom', 'cosmos-hub'],
        apiKey: 'cosmos',
        chainId: null,  // Not EVM compatible
        explorer: 'https://www.mintscan.io/cosmos',
        blockExplorerUrls: ['https://www.mintscan.io/cosmos']
    },

    // Osmosis - PublicNode doesn't support non-EVM chains like Osmosis
    osmo: {
        id: 'osmo',
        slug: 'osmosis',
        name: 'Osmosis',
        aliases: ['osmosis', 'osmo'],
        apiKey: 'osmosis',
        chainId: null,  // Not EVM compatible
        explorer: 'https://www.mintscan.io/osmosis',
        blockExplorerUrls: ['https://www.mintscan.io/osmosis']
    },

    // Celestia - PublicNode doesn't support non-EVM chains like Celestia
    tia: {
        id: 'tia',
        slug: 'celestia',
        name: 'Celestia',
        aliases: ['celestia', 'tia'],
        apiKey: 'celestia',
        chainId: null,  // Not EVM compatible
        explorer: 'https://celenium.io',
        blockExplorerUrls: ['https://celenium.io']
    },

    // Injective - PublicNode doesn't support non-EVM chains like Injective
    inj: {
        id: 'inj',
        slug: 'injective',
        name: 'Injective',
        aliases: ['injective', 'inj'],
        apiKey: 'injective',
        chainId: null,  // Not EVM compatible
        explorer: 'https://explorer.injective.network',
        blockExplorerUrls: ['https://explorer.injective.network']
    },

    // TON - PublicNode doesn't support non-EVM chains like TON
    ton: {
        id: 'ton',
        slug: 'ton',
        name: 'TON',
        aliases: ['ton', 'the-open-network'],
        apiKey: 'the-open-network',
        chainId: null,  // Not EVM compatible
        explorer: 'https://tonscan.org',
        blockExplorerUrls: ['https://tonscan.org']
    },

    // Harmony - PublicNode doesn't support Harmony
    one: {
        id: 'one',
        slug: 'harmony',
        name: 'Harmony',
        aliases: ['harmony', 'one'],
        apiKey: 'harmony-shard-0',
        chainId: 1666600000,
        explorer: 'https://explorer.harmony.one',
        blockExplorerUrls: ['https://explorer.harmony.one']
    },

    // IoTeX
    iotx: {
        id: 'iotx',
        slug: 'iotex',
        name: 'IoTeX',
        aliases: ['iotex', 'iotx'],
        apiKey: 'iotex',
        chainId: 4689,
        explorer: 'https://iotexscan.io',
        blockExplorerUrls: ['https://iotexscan.io'],
        publicNodeRpc: 'https://iotex-rpc.publicnode.com'
    },

    // Conflux - PublicNode doesn't support Conflux
    cfx: {
        id: 'cfx',
        slug: 'conflux',
        name: 'Conflux',
        aliases: ['conflux', 'cfx'],
        apiKey: 'conflux',
        chainId: 1030,
        explorer: 'https://confluxscan.io',
        blockExplorerUrls: ['https://confluxscan.io']
    },

    // Starknet - PublicNode doesn't support non-EVM chains like Starknet
    strk: {
        id: 'strk',
        slug: 'starknet',
        name: 'Starknet',
        aliases: ['starknet', 'strk'],
        apiKey: 'starknet',
        chainId: null,  // Not EVM compatible
        explorer: 'https://starkscan.co',
        blockExplorerUrls: ['https://starkscan.co', 'https://voyager.online']
    },

    // Tezos - PublicNode doesn't support non-EVM chains like Tezos
    xtz: {
        id: 'xtz',
        slug: 'tezos',
        name: 'Tezos',
        aliases: ['tezos', 'xtz'],
        apiKey: 'tezos',
        chainId: null,  // Not EVM compatible
        explorer: 'https://tzstats.com',
        blockExplorerUrls: ['https://tzstats.com']
    },

    // Astar
    astr: {
        id: 'astr',
        slug: 'astar',
        name: 'Astar',
        aliases: ['astar', 'astr'],
        apiKey: 'astar',
        chainId: 592,
        explorer: 'https://blockscout.com/astar',
        blockExplorerUrls: ['https://blockscout.com/astar'],
        publicNodeRpc: 'https://astar-rpc.publicnode.com'
    },

    // Shiden - PublicNode doesn't support Shiden
    sdn: {
        id: 'sdn',
        slug: 'shiden',
        name: 'Shiden',
        aliases: ['shiden', 'sdn'],
        apiKey: 'shiden',
        chainId: 336,
        explorer: 'https://blockscout.com/shiden',
        blockExplorerUrls: ['https://blockscout.com/shiden']
    },

    // Evmos - PublicNode doesn't support Evmos
    evmos: {
        id: 'evmos',
        slug: 'evmos',
        name: 'Evmos',
        aliases: ['evmos'],
        apiKey: 'evmos',
        chainId: 9001,
        explorer: 'https://escan.live',
        blockExplorerUrls: ['https://escan.live']
    },

    // Oasys - PublicNode doesn't support Oasys
    oas: {
        id: 'oas',
        slug: 'oasys',
        name: 'Oasys',
        aliases: ['oasys', 'oas'],
        apiKey: 'oasys',
        chainId: 248,
        explorer: 'https://scan.oasys.games',
        blockExplorerUrls: ['https://scan.oasys.games']
    },

    // Manta Network
    manta: {
        id: 'manta',
        slug: 'manta',
        name: 'Manta Network',
        aliases: ['manta-network', 'manta'],
        apiKey: 'manta',
        chainId: 169,
        explorer: 'https://pacific-explorer.manta.network',
        blockExplorerUrls: ['https://pacific-explorer.manta.network'],
        publicNodeRpc: 'https://manta-rpc.publicnode.com'
    },

    // Mode
    mode: {
        id: 'mode',
        slug: 'mode',
        name: 'Mode',
        aliases: ['mode'],
        apiKey: 'mode',
        chainId: 34443,
        explorer: 'https://explorer.mode.network',
        blockExplorerUrls: ['https://explorer.mode.network'],
        publicNodeRpc: 'https://mode-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://mode-rpc.publicnode.com',
                'https://mainnet.mode.network',
                'https://rpc.ankr.com/mode'
            ],
            wss: [
                'wss://mode-rpc.publicnode.com',
                'wss://mainnet.mode.network'
            ]
        }
    },

    // Blast
    blast: {
        id: 'blast',
        slug: 'blast',
        name: 'Blast',
        aliases: ['blast'],
        apiKey: 'blast',
        chainId: 81457,
        explorer: 'https://blastscan.io',
        blockExplorerUrls: ['https://blastscan.io'],
        publicNodeRpc: 'https://blast-rpc.publicnode.com',
        rpcUrls: {
            http: [
                'https://blast-rpc.publicnode.com',
                'https://rpc.blast.io',
                'https://rpc.ankr.com/blast'
            ],
            wss: [
                'wss://blast-rpc.publicnode.com',
                'wss://blast.getblock.io/api_key/mainnet/'
            ]
        }
    },

    // Kujira - PublicNode doesn't support non-EVM chains like Kujira
    kuji: {
        id: 'kuji',
        slug: 'kujira',
        name: 'Kujira',
        aliases: ['kujira', 'kuji'],
        apiKey: 'kujira',
        chainId: null,  // Not EVM compatible
        explorer: 'https://finder.kujira.app',
        blockExplorerUrls: ['https://finder.kujira.app'],
        rpcUrls: {
            http: [
                'https://kujira-mainnet-rpc.autostake.com:443',
                'https://rpc-kujira.whispernode.com'
            ],
            wss: [
                'wss://kujira-mainnet-rpc.autostake.com:443',
                'wss://rpc-kujira.whispernode.com'
            ]
        }
    },

    // Secret Network - PublicNode doesn't support non-EVM chains like Secret Network
    scrt: {
        id: 'scrt',
        slug: 'secret',
        name: 'Secret Network',
        aliases: ['secret', 'scrt', 'secret-network'],
        apiKey: 'secret',
        chainId: null,  // Not EVM compatible 
        explorer: 'https://www.mintscan.io/secret',
        blockExplorerUrls: ['https://www.mintscan.io/secret'],
        rpcUrls: {
            http: [
                'https://secret-4.api.trivium.network:9091',
                'https://rpc.scrt.network'
            ],
            wss: [
                'wss://secret-4.api.trivium.network:9091',
                'wss://rpc.scrt.network'
            ]
        }
    },

    // Zilliqa - PublicNode doesn't support non-EVM chains like Zilliqa
    zil: {
        id: 'zil',
        slug: 'zilliqa',
        name: 'Zilliqa',
        aliases: ['zilliqa', 'zil'],
        apiKey: 'zilliqa',
        chainId: null,  // Not EVM compatible
        explorer: 'https://viewblock.io/zilliqa',
        blockExplorerUrls: ['https://viewblock.io/zilliqa'],
        rpcUrls: {
            http: [
                'https://api.zilliqa.com',
                'https://zilliqa-mainnet.public.blastapi.io'
            ],
            wss: [
                'wss://api-ws.zilliqa.com',
                'wss://zilliqa-mainnet.public.blastapi.io'
            ]
        }
    }
};

// Lookup maps for fast conversions
const ID_MAP = new Map();
const SLUG_MAP = new Map();
const NAME_MAP = new Map();
const ALIAS_MAP = new Map();

// Initialize the lookup maps
Object.values(NETWORK_MAP).forEach(network => {
    ID_MAP.set(network.id, network);
    SLUG_MAP.set(network.slug, network);
    NAME_MAP.set(network.name.toLowerCase(), network);

    // Map all aliases to the network
    network.aliases.forEach(alias => {
        ALIAS_MAP.set(alias.toLowerCase(), network);
    });
});

/**
 * Converts any network identifier to the standard short network ID
 * This is the primary function for normalizing network names
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The standard network ID (short code) or the original if not found
 */
export function getNetworkId(network: string | null): string {
    if (!network) return '';

    const normalizedInput = network.toLowerCase().trim();

    // Direct match from ID map
    if (ID_MAP.has(normalizedInput)) {
        return normalizedInput; // Already an ID
    }

    // Check slug map
    if (SLUG_MAP.has(normalizedInput)) {
        return SLUG_MAP.get(normalizedInput).id;
    }

    // Check name map
    if (NAME_MAP.has(normalizedInput)) {
        return NAME_MAP.get(normalizedInput).id;
    }

    // Check alias map
    if (ALIAS_MAP.has(normalizedInput)) {
        return ALIAS_MAP.get(normalizedInput).id;
    }

    // Special case for spaces and hyphens
    const withoutSpacesAndHyphens = normalizedInput
        .replace(/[\s-]+/g, '') // Remove spaces and hyphens
        .toLowerCase();

    // Do a fuzzy search in aliases
    for (const [alias, network] of Array.from(ALIAS_MAP.entries())) {
        if (alias.replace(/[\s-]+/g, '').toLowerCase() === withoutSpacesAndHyphens) {
            return network.id;
        }
    }

    // Return original if no match found
    console.warn(`Network not found in mapping: ${network}`);
    return normalizedInput;
}

/**
 * Converts any network identifier to the standard URL slug
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The URL-friendly slug for the network or the original if not found
 */
export function getNetworkSlug(network: string | null): string {
    if (!network) return '';

    const networkId = getNetworkId(network);
    return ID_MAP.get(networkId)?.slug || networkId;
}

/**
 * Converts any network identifier to the human-readable name
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The full name of the network or the original if not found
 */
export function getNetworkName(network: string | null): string {
    if (!network) return '';

    const networkId = getNetworkId(network);
    return ID_MAP.get(networkId)?.name || networkId;
}

/**
 * Truncate Ethereum address for display
 * @param address The address to truncate
 * @param prefixLength Number of characters to show at the start
 * @param suffixLength Number of characters to show at the end
 * @returns Truncated address
 */
export function truncateAddress(
    address: string,
    prefixLength = 6,
    suffixLength = 4
): string {
    if (!address) return '';
    if (address.length <= prefixLength + suffixLength) return address;

    return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Converts any network identifier to the API key used in external services
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The API key for the network or the original if not found
 */
export function getNetworkApiKey(network: string | null): string {
    if (!network) return '';

    const networkId = getNetworkId(network);
    return ID_MAP.get(networkId)?.apiKey || networkId;
}

/**
 * Gets the chain ID for a network (mainly for EVM networks)
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The chain ID for the network or null if not found/applicable
 */
export function getNetworkChainId(network: string | null): number | null {
    if (!network) return null;

    const networkId = getNetworkId(network);
    return ID_MAP.get(networkId)?.chainId || null;
}

/**
 * Determines if two network identifiers refer to the same network
 * 
 * @param networkA - First network identifier
 * @param networkB - Second network identifier
 * @returns True if both identifiers refer to the same network
 */
export function isSameNetwork(networkA: string | null, networkB: string | null): boolean {
    if (!networkA || !networkB) return false;

    const idA = getNetworkId(networkA);
    const idB = getNetworkId(networkB);

    return idA === idB;
}

/**
 * Returns full network information from any network identifier
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The full network object or null if not found
 */
export function getNetworkInfo(network: string | null): any {
    if (!network) return null;

    const networkId = getNetworkId(network);
    return ID_MAP.get(networkId) || null;
}

/**
 * Get network icon path based on network identifier
 * Maps to the appropriate icon file in /assets/networks/ folder
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The path to the network icon
 * @deprecated Use getNetworkIconPath from icon-utils.tsx instead
 */
export function getNetworkIconPath(network: string | null): string {
    // Import and use the function from icon-utils to ensure consistency
    const { getNetworkIconPath: getNetworkIconPathFromIconUtils } = require('@/lib/icon-utils');
    
    // Delegate to the canonical implementation in icon-utils.tsx
    return getNetworkIconPathFromIconUtils(network);
}

/**
 * Gets the explorer URL for a given network
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @returns The blockchain explorer URL or a default value if not found
 */
export function getExplorerUrl(network: string | null): string {
    if (!network) return 'https://etherscan.io'; // Default to Ethereum

    const networkId = getNetworkId(network);
    return ID_MAP.get(networkId)?.explorer || 'https://etherscan.io';
}

/**
 * Builds a complete explorer URL for a specific address (contract/wallet)
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @param address - The address to view on the explorer
 * @returns The complete URL to view the address on the explorer
 */
export function getAddressExplorerUrl(network: string | null, address: string): string {
    if (!address) return getExplorerUrl(network);
    return `${getExplorerUrl(network)}/address/${address}`;
}

/**
 * Builds a complete explorer URL for a specific transaction
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @param txHash - The transaction hash to view on the explorer
 * @returns The complete URL to view the transaction on the explorer
 */
export function getTxExplorerUrl(network: string | null, txHash: string): string {
    if (!txHash) return getExplorerUrl(network);
    return `${getExplorerUrl(network)}/tx/${txHash}`;
}

/**
 * Builds a complete explorer URL for a specific token
 * 
 * @param network - Any network identifier (name, slug, id, alias)
 * @param tokenAddress - The token contract address to view on the explorer
 * @returns The complete URL to view the token on the explorer
 */
export function getTokenExplorerUrl(network: string | null, tokenAddress: string): string {
    if (!tokenAddress) return getExplorerUrl(network);
    return `${getExplorerUrl(network)}/token/${tokenAddress}`;
}

/**
 * Gets all supported networks in the application
 * 
 * @returns Array of network objects
 */
export function getAllNetworks(): any[] {
    return Object.values(NETWORK_MAP);
}