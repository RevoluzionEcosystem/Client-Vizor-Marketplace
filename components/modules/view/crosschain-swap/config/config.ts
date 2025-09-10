import { Configuration, BLOCKCHAIN_NAME, CHAIN_TYPE } from "rubic-sdk"

// Define the extended configuration type to include wsProviders
interface ExtendedConfiguration extends Configuration {
  wsProviders?: Record<string, string[]>;
  walletProvider?: any;
  enableEstimation?: boolean; // Add enableEstimation property
  mainnetNetworks?: string[]; // Add mainnetNetworks property
  allNetworks?: boolean; // Add allNetworks property
}

// Define RPC providers configuration
export const rubicConfiguration: ExtendedConfiguration = {
  rpcProviders: {
    [BLOCKCHAIN_NAME.ETHEREUM]: {
      rpcList: [
        'https://ethereum-rpc.publicnode.com',
      ]
    },
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
      rpcList: [
        'https://bsc-rpc.publicnode.com',
      ]
    },
    [BLOCKCHAIN_NAME.POLYGON]: {
      rpcList: [
        'https://polygon-bor-rpc.publicnode.com',
      ]
    },
    [BLOCKCHAIN_NAME.ARBITRUM]: {
      rpcList: [
        'https://arbitrum-one-rpc.publicnode.com',
      ]
    },
    [BLOCKCHAIN_NAME.OPTIMISM]: {
      rpcList: [
        'https://optimism-rpc.publicnode.com',
      ]
    },
    [BLOCKCHAIN_NAME.BASE]: {
      rpcList: [
        'https://base-rpc.publicnode.com',
      ]
    },
    [BLOCKCHAIN_NAME.AVALANCHE]: {
      rpcList: [
        'https://avalanche-c-chain-rpc.publicnode.com',
      ]
    },
    [BLOCKCHAIN_NAME.LINEA]: {
      rpcList: [
        'https://linea-rpc.publicnode.com',
      ]
    },
    [BLOCKCHAIN_NAME.SCROLL]: {
      rpcList: [
        'https://scroll-rpc.publicnode.com',
      ]
    }
  },
  // Add WebSocket provider URLs
  wsProviders: {
    [BLOCKCHAIN_NAME.ETHEREUM]: [
      'wss://ethereum-rpc.publicnode.com'
    ],
    [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: [
      'wss://bsc-rpc.publicnode.com'
    ],
    [BLOCKCHAIN_NAME.POLYGON]: [
      'wss://polygon-bor-rpc.publicnode.com'
    ],
    [BLOCKCHAIN_NAME.ARBITRUM]: [
      'wss://arbitrum-one-rpc.publicnode.com'
    ],
    [BLOCKCHAIN_NAME.OPTIMISM]: [
      'wss://optimism-rpc.publicnode.com'
    ],
    [BLOCKCHAIN_NAME.BASE]: [
      'wss://base-rpc.publicnode.com'
    ],
    [BLOCKCHAIN_NAME.AVALANCHE]: [
      'wss://avalanche-c-chain-rpc.publicnode.com',
    ]
  },
  
  // IMPORTANT! NEVER CHANGE configuration parameters
  providerAddress: {
		[CHAIN_TYPE.EVM]: {
			crossChain: "0x95dB7Abc07D6A55D77c30889f35DF200cf96Fe58",
			onChain: "0x9C48405d8E4d107C9DC033993d18D60F67380ca1"
		}
	},
  
  // Additional configuration options to improve functionality
  enableEstimation: true, // Enable accurate gas estimation
  mainnetNetworks: [ // Specify which networks to treat as mainnet for pricing
    BLOCKCHAIN_NAME.ETHEREUM,
    BLOCKCHAIN_NAME.POLYGON,
    BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN,
    BLOCKCHAIN_NAME.AVALANCHE,
    BLOCKCHAIN_NAME.ARBITRUM,
    BLOCKCHAIN_NAME.OPTIMISM,
    BLOCKCHAIN_NAME.BASE,
    BLOCKCHAIN_NAME.LINEA,
    BLOCKCHAIN_NAME.SCROLL
  ],
  allNetworks: true, // Include all supported networks
};

export default rubicConfiguration;
