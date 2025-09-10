import {
  SDK,
  BLOCKCHAIN_NAME,
  OnChainTrade,
  EvmBlockchainName,
  BlockchainName,
  CrossChainTrade,
  CrossChainTradeType,
  OnChainTradeType,
  PriceTokenAmount,
  Token,
  RubicSdkError,
  SwapRequestError,
  InsufficientFundsError,
  FailedToCheckForTransactionReceiptError
} from 'rubic-sdk';
import { initializeSDK } from '../utils/sdk-init';
import { formatError, isUserRejectionError } from '../utils/error-handler';

/**
 * Helper function to handle Rubic SDK errors
 */
function handleRubicError(error: unknown): { code: string; message: string } {
  // Default error response
  let errorResponse = {
    code: 'UNKNOWN_ERROR',
    message: 'Unknown error occurred'
  };

  // Check if it's a user rejection error (from metamask or other wallet)
  if (isUserRejectionError(error)) {
    return {
      code: 'USER_REJECTED',
      message: 'Transaction was rejected by user'
    };
  }

  // Handle specific Rubic SDK errors
  if (error instanceof RubicSdkError) {
    // Use error.constructor.name as a way to identify error types
    // since RubicSdkError no longer has a code property
    const errorTypeName = error.constructor.name;
    errorResponse.code = errorTypeName;
    errorResponse.message = error.message || 'SDK error occurred';

    // Handle specific error types
    if (error instanceof InsufficientFundsError) {
      errorResponse.code = 'INSUFFICIENT_FUNDS';
      errorResponse.message = 'Insufficient funds for transaction';
    } else if (error instanceof SwapRequestError) {
      errorResponse.code = 'SWAP_REQUEST_FAILED';
      errorResponse.message = 'Failed to execute swap';
    } else if (error instanceof FailedToCheckForTransactionReceiptError) {
      errorResponse.code = 'TX_CHECK_FAILED';
      errorResponse.message = 'Failed to check transaction receipt';
    }
  } else if (error instanceof Error) {
    // Handle generic JS errors
    errorResponse.message = error.message;
  } else if (typeof error === 'string') {
    // Handle string errors
    errorResponse.message = error;
  }

  // Format message for user display
  errorResponse.message = formatError(errorResponse.message);

  return errorResponse;
}

/**
 * Service class for handling Rubic SDK operations
 */
export class RubicSwapService {
  private static instance: RubicSwapService;
  private sdk: SDK | null = null;
  private isInitialized = false;

  private constructor() { }

  /**
   * Get singleton instance
   */
  public static getInstance(): RubicSwapService {
    if (!RubicSwapService.instance) {
      RubicSwapService.instance = new RubicSwapService();
    }
    return RubicSwapService.instance;
  }

  /**
   * Initialize the SDK
   */
  public async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized && this.sdk) {
        return true;
      }

      this.sdk = await initializeSDK();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Rubic SDK:', error);
      return false;
    }
  }

  /**
   * Connect wallet to the SDK
   * @param walletProvider Wallet provider instance
   */
  public async connectWallet(walletProvider: any): Promise<boolean> {
    try {
      if (!this.sdk) {
        await this.initialize();
      }

      if (this.sdk && walletProvider) {
        await this.sdk.updateWalletProvider(walletProvider);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect wallet to SDK:', error);
      return false;
    }
  }

  /**
   * Calculate trades for on-chain swap
   * @param fromBlockchain Source blockchain
   * @param fromTokenAddress Source token address
   * @param toTokenAddress Destination token address
   * @param amount Amount in source token decimals
   */
  public async calculateOnChainTrade(
    fromBlockchain: EvmBlockchainName,
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string
  ): Promise<OnChainTrade[]> {
    try {
      if (!this.sdk) {
        await this.initialize();
      }

      if (!this.sdk) {
        throw new Error('SDK not initialized');
      }

      const tradeResponse = await this.sdk.onChainManager.calculateTrade(
        {
          blockchain: fromBlockchain,
          address: fromTokenAddress
        },
        amount,
        toTokenAddress
      );

      // Extract the OnChainTrade objects from the response
      // The SDK might return an array of wrapped trade objects, so we need to extract the actual trade objects
      return Array.isArray(tradeResponse) ?
        tradeResponse.map((item: any) => item.trade || item).filter(Boolean) :
        [];
    } catch (error) {
      console.error('Error calculating on-chain trade:', error);
      const { message } = handleRubicError(error);
      throw new Error(message);
    }
  }

  /**
   * Calculate trades for cross-chain swap
   * @param fromBlockchain Source blockchain
   * @param fromTokenAddress Source token address
   * @param toBlockchain Destination blockchain
   * @param toTokenAddress Destination token address
   * @param amount Amount in source token decimals
   */
  public async calculateCrossChainTrade(
    fromBlockchain: BlockchainName,
    fromTokenAddress: string,
    toBlockchain: BlockchainName,
    toTokenAddress: string,
    amount: string
  ): Promise<CrossChainTrade<unknown>[]> {
    try {
      if (!this.sdk) {
        await this.initialize();
      }

      if (!this.sdk) {
        throw new Error('SDK not initialized');
      }

      const tradeResponse = await this.sdk.crossChainManager.calculateTrade(
        {
          blockchain: fromBlockchain,
          address: fromTokenAddress
        },
        amount,
        {
          blockchain: toBlockchain,
          address: toTokenAddress
        },
        { slippageTolerance: 1.5 } // Default 1.5% slippage
      );

      // Extract the CrossChainTrade objects from the response
      // The SDK might return wrapped trade objects, so we need to extract the actual trade objects
      return Array.isArray(tradeResponse) ?
        tradeResponse.map((item: any) => item.trade || item).filter(Boolean) :
        [];
    } catch (error) {
      console.error('Error calculating cross-chain trade:', error);
      const { message } = handleRubicError(error);
      throw new Error(`Cross-chain swap error: ${message}`);
    }
  }

  /**
   * Execute a swap transaction
   * @param trade Trade object from calculateOnChainTrade or calculateCrossChainTrade
   * @param options Additional options for the swap
   */
  public async executeSwap(
    trade: OnChainTrade | CrossChainTrade,
    options: any = {}
  ): Promise<any> {
    try {
      if (!this.sdk) {
        await this.initialize();
      }

      if (!this.sdk) {
        throw new Error('SDK not initialized');
      }

      // Default options for swap
      const swapOptions = {
        onConfirm: (hash: string) => console.log("Transaction confirmed:", hash),
        onApprove: (hash: string) => console.log("Approval transaction:", hash),
        ...options
      };

      return await trade.swap(swapOptions);
    } catch (error) {
      console.error('Error executing swap:', error);
      const { message } = handleRubicError(error);
      throw new Error(message);
    }
  }

  /**
   * Find token information by address
   * @param blockchain BlockchainName
   * @param address Token address
   */
  public async findToken(blockchain: BlockchainName, address: string): Promise<Token | null> {
    try {
      if (!this.sdk) {
        await this.initialize();
      }

      if (!this.sdk) {
        throw new Error('SDK not initialized');
      }

      // Use the tokensService to find a token by blockchain and address
      const token = {
        blockchain,
        address
      };

      return token as Token;
    } catch (error) {
      console.error('Error finding token:', error);
      return null;
    }
  }

  /**
   * Get user's balance for a token
   * @param blockchain Blockchain name
   * @param tokenAddress Token address
   * @param userAddress User's wallet address
   */
  public async getBalance(
    blockchain: BlockchainName,
    tokenAddress: string,
    userAddress: string
  ): Promise<string> {
    try {
      if (!this.sdk) {
        await this.initialize();
      }

      if (!this.sdk) {
        throw new Error('SDK not initialized');
      }

      // For EVM chains
      if (blockchain === BLOCKCHAIN_NAME.ETHEREUM ||
        blockchain === BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN ||
        blockchain === BLOCKCHAIN_NAME.POLYGON ||
        (typeof blockchain === 'string' && blockchain.includes('EVM'))) {

        const evmWeb3Public = this.sdk.web3PublicService[blockchain as EvmBlockchainName];
        if (evmWeb3Public) {
          const token = await evmWeb3Public.getTokenInfo(tokenAddress);
          const balance = await evmWeb3Public.getBalance(userAddress, token);
          return balance.toString();
        }
      }

      // Default fallback
      return '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  /**
   * Get chain ID from blockchain name
   * @param blockchainName Blockchain name
   */
  public getChainId(blockchainName: BlockchainName): number {
    const chainIdMap: Record<string, number> = {
      [BLOCKCHAIN_NAME.ETHEREUM]: 1,
      [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: 56,
      [BLOCKCHAIN_NAME.POLYGON]: 137,
      [BLOCKCHAIN_NAME.ARBITRUM]: 42161,
      [BLOCKCHAIN_NAME.OPTIMISM]: 10,
      [BLOCKCHAIN_NAME.AVALANCHE]: 43114,
      [BLOCKCHAIN_NAME.FANTOM]: 250,
      [BLOCKCHAIN_NAME.LINEA]: 59144,
      [BLOCKCHAIN_NAME.BASE]: 8453,
      [BLOCKCHAIN_NAME.SCROLL]: 534352,
      [BLOCKCHAIN_NAME.TELOS]: 40,
      [BLOCKCHAIN_NAME.CELO]: 42220,
      [BLOCKCHAIN_NAME.MANTLE]: 5000,
      [BLOCKCHAIN_NAME.BLAST]: 81457,
      [BLOCKCHAIN_NAME.ZK_SYNC]: 324,
      [BLOCKCHAIN_NAME.POLYGON_ZKEVM]: 1101,
    };

    return chainIdMap[blockchainName] || 1;
  }
}

export default RubicSwapService.getInstance();
