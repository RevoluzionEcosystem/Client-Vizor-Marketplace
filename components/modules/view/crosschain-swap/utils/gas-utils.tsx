/**
 * Utilities for gas price calculation, validation and formatting
 * Uses Rubic SDK's advanced gas estimation functions for more accurate estimates
 */
import BigNumber from "bignumber.js";
import { BLOCKCHAIN_NAME } from "rubic-sdk";

/**
 * Custom error types from Rubic SDK related to gas price issues
 */
export class GasPriceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GasPriceError';
    }
}

export class InsufficientFundsGasPriceValueError extends GasPriceError {
    constructor(message = 'Insufficient funds for gas') {
        super(message);
        this.name = 'InsufficientFundsGasPriceValueError';
    }
}

export class LowGasError extends GasPriceError {
    constructor(message = 'Gas price is too low') {
        super(message);
        this.name = 'LowGasError';
    }
}

export class MaxGasPriceOverflowError extends GasPriceError {
    constructor(message = 'Gas price exceeds maximum allowed') {
        super(message);
        this.name = 'MaxGasPriceOverflowError';
    }
}

/**
 * Get cross-chain gas data using Rubic SDK's advanced estimation
 * 
 * @param sdkInstance The Rubic SDK instance
 * @param trade The cross-chain trade object
 * @param blockchain Source blockchain name
 * @returns Detailed gas data for cross-chain trades
 */
export async function getCrossChainGasData(sdkInstance: any, trade: any, blockchain: string): Promise<{
  gasPrice: BigNumber;
  gasLimit: BigNumber;
  gasPriceInUsd: BigNumber;
  isHighGasPrice: boolean;
}> {
  if (!sdkInstance || !trade) {
    throw new Error('SDK instance and trade object are required');
  }

  try {
    // First try to use the trade's built-in gas data if available
    if (
      trade.gasData && 
      trade.gasData.gasPrice && 
      trade.gasData.gasLimit
    ) {
      const gasPrice = new BigNumber(trade.gasData.gasPrice.toString());
      const gasLimit = new BigNumber(trade.gasData.gasLimit.toString());
      const gasPriceInUsd = trade.gasData.gasPriceInUsd 
        ? new BigNumber(trade.gasData.gasPriceInUsd.toString())
        : await estimateGasPriceInUsd(sdkInstance, blockchain, gasPrice, gasLimit);

      return {
        gasPrice,
        gasLimit,
        gasPriceInUsd,
        isHighGasPrice: isHighGasPrice(gasPriceInUsd, blockchain)
      };
    }

    // Check if trade has its own gas data access methods
    if (trade.getGasData && typeof trade.getGasData === 'function') {
      try {
        const gasData = await trade.getGasData();
        if (gasData) {
          return {
            gasPrice: new BigNumber(gasData.gasPrice?.toString() || '0'),
            gasLimit: new BigNumber(gasData.gasLimit?.toString() || '0'),
            gasPriceInUsd: new BigNumber(gasData.gasPriceInUsd?.toString() || '0'),
            isHighGasPrice: isHighGasPrice(new BigNumber(gasData.gasPriceInUsd || '0'), blockchain)
          };
        }
      } catch (error) {
        console.warn('Error using trade.getGasData():', error);
      }
    }

    // Direct integration with the SDK's gas data access (version-dependent)
    // Version check for different SDK structures - Rubic SDK has evolved over time
    if (sdkInstance.crossChainManager && typeof sdkInstance.crossChainManager.getGasData === 'function') {
      // Latest SDK version structure
      try {
        const fromToken = trade.from || (trade.trade && trade.trade.from) || null;
        const toToken = trade.to || (trade.trade && trade.trade.to) || null;
        const amount = trade.amount || (trade.trade && trade.trade.amount) || '0';
        const fromBlockchain = fromToken?.blockchain || blockchain;
        const toBlockchain = toToken?.blockchain || '';
        
        if (fromToken && toToken && fromBlockchain && toBlockchain) {
          // This is the key SDK function that provides accurate cross-chain gas estimates
          const gasData = await sdkInstance.crossChainManager.getGasData(
            fromBlockchain,
            toBlockchain,
            fromToken.address,
            toToken.address,
            amount
          );

          return {
            gasPrice: new BigNumber(gasData.gasPrice.toString()),
            gasLimit: new BigNumber(gasData.gasLimit.toString()),
            gasPriceInUsd: new BigNumber(gasData.gasPriceInUsd.toString()),
            isHighGasPrice: isHighGasPrice(new BigNumber(gasData.gasPriceInUsd.toString()), fromBlockchain)
          };
        }
      } catch (error) {
        console.warn('Error using crossChainManager.getGasData:', error);
      }
    }
    
    // Try SDK's gas utility functions as a fallback - used in some SDK versions
    if (sdkInstance.getGasPrice && typeof sdkInstance.getGasPrice === 'function') {
      try {
        const gasPrice = await sdkInstance.getGasPrice(blockchain);
        const gasPriceInUsd = await estimateGasPriceInUsd(sdkInstance, blockchain, 
          new BigNumber(gasPrice.toString()), new BigNumber('300000')); // Default gas limit
        
        return {
          gasPrice: new BigNumber(gasPrice.toString()),
          gasLimit: new BigNumber('300000'), // Default estimate
          gasPriceInUsd,
          isHighGasPrice: isHighGasPrice(gasPriceInUsd, blockchain)
        };
      } catch (error) {
        console.warn('Error using sdkInstance.getGasPrice:', error);
      }
    }

    // Fallback - Access gas data directly from the trade object's nested structures
    // Different versions of Rubic SDK store gas data in different places
    const potentialGasData = 
      (trade.trade && trade.trade.gasData) ||
      (trade.crossChain && trade.crossChain.gasData) ||
      (trade.onChainTrade && trade.onChainTrade.gasData) ||
      trade.gasData;
    
    if (potentialGasData) {
      const gasPrice = new BigNumber(potentialGasData.gasPrice?.toString() || '0');
      const gasLimit = new BigNumber(potentialGasData.gasLimit?.toString() || '0');
      const gasPriceInUsd = potentialGasData.gasPriceInUsd 
        ? new BigNumber(potentialGasData.gasPriceInUsd?.toString())
        : await estimateGasPriceInUsd(sdkInstance, blockchain, gasPrice, gasLimit);

      return {
        gasPrice,
        gasLimit, 
        gasPriceInUsd,
        isHighGasPrice: isHighGasPrice(gasPriceInUsd, blockchain)
      };
    }

    // Absolute fallback - extract from the trade object with best-effort conversion
    const gasEstimate = extractGasPrice(trade, true);
    const gasPriceInUsd = new BigNumber(gasEstimate.gasPriceInUsd || '15.00');
    
    // Create best-effort gas data
    return {
      gasPrice: new BigNumber(trade.gasPrice || '0'),
      gasLimit: new BigNumber(trade.gasLimit || '0'),
      gasPriceInUsd,
      isHighGasPrice: isHighGasPrice(gasPriceInUsd, blockchain)
    };
  } catch (error) {
    console.error('Error getting cross-chain gas data:', error);
    throw processGasError(error);
  }
}

/**
 * Get on-chain gas data using Rubic SDK's advanced estimation
 * 
 * @param sdkInstance The Rubic SDK instance
 * @param trade The on-chain trade object
 * @param blockchain Blockchain name
 * @returns Detailed gas data for on-chain trades
 */
export async function getOnChainGasData(sdkInstance: any, trade: any, blockchain: string): Promise<{
    gasPrice: BigNumber;
    gasLimit: BigNumber;
    gasPriceInUsd: BigNumber;
    isHighGasPrice: boolean;
}> {
    if (!sdkInstance || !trade) {
        throw new Error('SDK instance and trade object are required');
    }

    try {
        // First try to use the trade's built-in gas data if available
        if (
            trade.gasFeeInfo &&
            trade.gasFeeInfo.gasPrice &&
            trade.gasFeeInfo.gasLimit
        ) {
            const gasPrice = new BigNumber(trade.gasFeeInfo.gasPrice.toString());
            const gasLimit = new BigNumber(trade.gasFeeInfo.gasLimit.toString());
            const gasPriceInUsd = new BigNumber(trade.gasFeeInfo.gasFeeInUsd.toString());

            return {
                gasPrice,
                gasLimit,
                gasPriceInUsd,
                isHighGasPrice: isHighGasPrice(gasPriceInUsd, blockchain)
            };
        }

        // If we have an on-chain manager, use it to calculate the gas data
        if (sdkInstance.onChainManager) {
            // Try to extract transaction parameters from the trade
            const fromToken = trade.from || null;
            const toToken = trade.to || null;
            const amount = trade.amount || '0';

            if (fromToken && toToken) {
                // This is the key SDK function that provides accurate on-chain gas estimates
                const gasData = await sdkInstance.onChainManager.getGasData(
                    blockchain,
                    fromToken.address,
                    toToken.address,
                    amount
                );

                return {
                    gasPrice: new BigNumber(gasData.gasPrice.toString()),
                    gasLimit: new BigNumber(gasData.gasLimit.toString()),
                    gasPriceInUsd: new BigNumber(gasData.gasPriceInUsd.toString()),
                    isHighGasPrice: isHighGasPrice(new BigNumber(gasData.gasPriceInUsd.toString()), blockchain)
                };
            }
        }

        // Fallback to extracting from the trade object with best-effort conversion
        const gasEstimate = extractGasPrice(trade, false);
        const gasPriceInUsd = new BigNumber(gasEstimate.gasPriceInUsd || '5.00');

        // Create best-effort gas data
        return {
            gasPrice: new BigNumber(trade.gasPrice || '0'),
            gasLimit: new BigNumber(trade.gasLimit || '0'),
            gasPriceInUsd,
            isHighGasPrice: isHighGasPrice(gasPriceInUsd, blockchain)
        };
    } catch (error) {
        console.error('Error getting on-chain gas data:', error);
        throw processGasError(error);
    }
}

/**
 * Safely extract gas price from a trade object with proper validation
 * 
 * @param trade The trade object (on-chain or cross-chain)
 * @param isCrossChain Whether it's a cross-chain trade
 * @returns An object with validated gas price values
 */
export function extractGasPrice(trade: any, isCrossChain: boolean = false): {
    gasPriceInUsd: string | null;
    gasPriceInEth: string | null;
    isEstimated: boolean;
} {
    // Initialize empty result
    const result = {
        gasPriceInUsd: null,
        gasPriceInEth: null,
        isEstimated: true
    };

    if (!trade) return result;

    // Try to extract gas price from trade object based on different structures
    try {
        // First try direct gasFeeInfo for on-chain trades
        if (!isCrossChain && trade.gasFeeInfo) {
            const feeInUsd = validateNumber(trade.gasFeeInfo.gasFeeInUsd);
            if (feeInUsd !== null) {
                result.gasPriceInUsd = feeInUsd;
                return result;
            }
        }

        // For cross-chain trades, check trade.gasData structure
        if (isCrossChain && trade.trade?.gasData?.gasPrice) {
            const feeInUsd = validateNumber(trade.trade.gasData.gasPrice);
            if (feeInUsd !== null) {
                result.gasPriceInUsd = feeInUsd;
                return result;
            }
        }

        // Try alternative cross-chain paths
        if (isCrossChain) {
            // Check crossChain property
            if (trade.crossChain?.gasData?.gasPrice) {
                const feeInUsd = validateNumber(trade.crossChain.gasData.gasPrice);
                if (feeInUsd !== null) {
                    result.gasPriceInUsd = feeInUsd;
                    return result;
                }
            }

            // Check gasAmount property sometimes used in v2
            if (trade.gasAmount) {
                const feeInUsd = validateNumber(trade.gasAmount);
                if (feeInUsd !== null) {
                    result.gasPriceInUsd = feeInUsd;
                    return result;
                }
            }
        }

        // Try estimating fallback values if we have some info
        if (trade.gasLimit && trade.gasPrice) {
            try {
                const gasLimit = new BigNumber(trade.gasLimit.toString());
                const gasPrice = new BigNumber(trade.gasPrice.toString());
                const ethPrice = new BigNumber(1800); // Hardcoded ETH price as fallback

                const gasCostEth = gasLimit.multipliedBy(gasPrice).dividedBy(1e18);
                const gasCostUsd = gasCostEth.multipliedBy(ethPrice);

                result.gasPriceInEth = gasCostEth.toString();
                result.gasPriceInUsd = gasCostUsd.toString();
                result.isEstimated = true;
                return result;
            } catch (e) {
                console.error("Error estimating gas price from raw values:", e);
            }
        }

        // Fallback default estimation for specific networks
        return getDefaultGasEstimate(isCrossChain);
    } catch (error) {
        console.error("Error extracting gas price:", error);
        return getDefaultGasEstimate(isCrossChain);
    }
}

/**
 * Validate if a value is a valid number and return it formatted
 * Returns null if invalid
 */
function validateNumber(value: any): string | null {
    if (value === null || value === undefined) return null;

    try {
        // If it's already a BigNumber, use it directly
        if (BigNumber.isBigNumber(value)) {
            if (value.isNaN() || !value.isFinite()) return null;
            return value.toString();
        }

        // Convert to string first to handle various input types
        const numStr = String(value).trim();
        if (!numStr) return null;

        // Parse as BigNumber for safe calculation
        const num = new BigNumber(numStr);

        // Check if it's a valid number
        if (num.isNaN() || !num.isFinite()) return null;

        // Check for ridiculous values
        if (num.gt(1000000000)) return "20.00"; // Cap at $20 if over $1B
        if (num.lt(0)) return "0.10"; // Min $0.10 for negative values

        return num.toString();
    } catch {
        return null;
    }
}

/**
 * Format gas price for display with proper handling of edge cases
 */
export function formatGasPrice(gasPriceInUsd: string | null): string {
    if (!gasPriceInUsd) return "~$N/A";

    try {
        const price = new BigNumber(gasPriceInUsd);

        // Handle invalid numbers
        if (price.isNaN() || !price.isFinite()) return "~$N/A";

        // Format based on magnitude
        if (price.lt(0.01)) return "<$0.01";
        if (price.lt(10)) return `~$${price.toFixed(2)}`;
        if (price.lt(100)) return `~$${price.toFixed(1)}`;
        if (price.gt(1000000)) return "~$N/A"; // Too high to be valid

        return `~$${price.toNumber().toFixed(0)}`;
    } catch {
        return "~$N/A";
    }
}

/**
 * Get default gas estimate based on trade type and blockchain
 */
function getDefaultGasEstimate(isCrossChain: boolean, blockchain?: string): {
    gasPriceInUsd: string;
    gasPriceInEth: string | null;
    isEstimated: boolean;
} {
    let gasPriceInUsd = isCrossChain ? "15.00" : "5.00"; // Default estimates

    // Adjust for different blockchains if specified
    if (blockchain) {
        switch (blockchain) {
            case BLOCKCHAIN_NAME.ETHEREUM:
                gasPriceInUsd = isCrossChain ? "25.00" : "8.00";
                break;
            case BLOCKCHAIN_NAME.ARBITRUM:
            case BLOCKCHAIN_NAME.OPTIMISM:
                gasPriceInUsd = isCrossChain ? "12.00" : "1.50";
                break;
            case BLOCKCHAIN_NAME.POLYGON:
            case BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN:
                gasPriceInUsd = isCrossChain ? "10.00" : "0.50";
                break;
            case BLOCKCHAIN_NAME.AVALANCHE:
                gasPriceInUsd = isCrossChain ? "8.00" : "0.60";
                break;
            case BLOCKCHAIN_NAME.BASE:
                gasPriceInUsd = isCrossChain ? "7.00" : "0.70";
                break;
            // Add more specific blockchain estimates
        }
    }

    return {
        gasPriceInUsd,
        gasPriceInEth: null,
        isEstimated: true
    };
}

/**
 * Estimate gas price in USD using token price service
 * 
 * @param sdkInstance Rubic SDK instance
 * @param blockchain Blockchain name
 * @param gasPrice Gas price in wei
 * @param gasLimit Gas limit
 */
async function estimateGasPriceInUsd(
    sdkInstance: any,
    blockchain: string,
    gasPrice: BigNumber,
    gasLimit: BigNumber
): Promise<BigNumber> {
    // Get native token price in USD using SDK's price service if available
    try {
        const nativeTokenPrice = await sdkInstance?.priceTokenService?.getNativeCoinPrice(blockchain);

        if (nativeTokenPrice && typeof nativeTokenPrice === 'number' && nativeTokenPrice > 0) {
            // Calculate total gas cost in native token (eth, bnb, etc.)
            const gasCostInWei = gasPrice.multipliedBy(gasLimit);

            // Convert to native tokens (divide by 1e18)
            const gasCostInNative = gasCostInWei.dividedBy(new BigNumber(10).pow(18));

            // Calculate USD price
            const gasCostInUsd = gasCostInNative.multipliedBy(nativeTokenPrice);

            return gasCostInUsd;
        }
    } catch (error) {
        console.error('Error calculating gas price in USD:', error);
    }

    // Fallback to default USD price based on network and gas limit
    const defaultGasEstimate = getDefaultGasEstimate(true, blockchain);
    return new BigNumber(defaultGasEstimate.gasPriceInUsd);
}

/**
 * Check if the gas price is considered high for a given blockchain
 */
function isHighGasPrice(gasPriceInUsd: BigNumber, blockchain: string): boolean {
    // Define thresholds for "high" gas prices by network
    const thresholds: Record<string, number> = {
        [BLOCKCHAIN_NAME.ETHEREUM]: 12.0,
        [BLOCKCHAIN_NAME.ARBITRUM]: 3.0,
        [BLOCKCHAIN_NAME.OPTIMISM]: 3.0,
        [BLOCKCHAIN_NAME.POLYGON]: 1.5,
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: 1.0,
        [BLOCKCHAIN_NAME.AVALANCHE]: 1.2,
        [BLOCKCHAIN_NAME.BASE]: 1.0
    };

    // Get threshold for blockchain or use default
    const threshold = thresholds[blockchain] || 3.0;

    return gasPriceInUsd.gt(threshold);
}

/**
 * Process gas-related errors from the Rubic SDK
 * @param error Original error
 * @returns Properly typed gas error
 */
export function processGasError(error: any): Error {
    // Check if it's already a custom error
    if (
        error instanceof InsufficientFundsGasPriceValueError ||
        error instanceof LowGasError ||
        error instanceof MaxGasPriceOverflowError ||
        error instanceof GasPriceError
    ) {
        return error;
    }

    const errorMessage = error?.message || String(error);

    // Check for common gas-related error patterns
    if (
        errorMessage.includes('insufficient funds') ||
        errorMessage.includes('insufficient balance')
    ) {
        return new InsufficientFundsGasPriceValueError();
    }

    if (
        errorMessage.includes('gas price too low') ||
        errorMessage.includes('min gas price')
    ) {
        return new LowGasError();
    }

    if (
        errorMessage.includes('max fee per gas') ||
        errorMessage.includes('gas price exceeds')
    ) {
        return new MaxGasPriceOverflowError();
    }

    // Generic gas error
    if (errorMessage.includes('gas')) {
        return new GasPriceError(errorMessage);
    }

    // Return original error if it doesn't match any gas-specific pattern
    return error;
}