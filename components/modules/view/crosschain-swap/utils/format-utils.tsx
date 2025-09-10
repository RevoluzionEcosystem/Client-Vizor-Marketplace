import BigNumber from 'bignumber.js';

/**
 * Format a number or string to a consistent display format for quotes
 * This handles the auto-formatting that used to be built into the SDK
 * 
 * @param amount The amount to format
 * @param decimals Optional number of decimals (defaults to 6)
 * @returns Formatted string with proper decimal places
 */
export const formatTokenAmount = (amount: string | number | BigNumber, decimals: number = 6): string => {
    if (!amount) return '0';

    try {
        // Convert various input formats to BigNumber for consistent handling
        const bn = BigNumber.isBigNumber(amount) 
            ? amount 
            : new BigNumber(String(amount));

        // Handle NaN or invalid values
        if (bn.isNaN() || !bn.isFinite()) return '0';

        // For very small numbers, use more precision to avoid showing 0
        if (bn.isGreaterThan(0) && bn.isLessThan(new BigNumber(`0.${'0'.repeat(decimals-1)}1`))) {
            // Find the first non-zero decimal place
            const absStr = bn.abs().toString();
            const decimalPart = absStr.includes('.') ? absStr.split('.')[1] : '';
            if (decimalPart) {
                let firstNonZeroPos = 0;
                while (firstNonZeroPos < decimalPart.length && decimalPart[firstNonZeroPos] === '0') {
                    firstNonZeroPos++;
                }
                // Use precision that shows at least 2 significant digits
                const precisDecimals = Math.min(firstNonZeroPos + 2, 10);
                return bn.toFormat(precisDecimals);
            }
        }

        // Format the number with the specified decimal places and thousand separators
        return bn.toFormat(decimals);
    } catch (error) {
        console.error('Error formatting token amount:', error);
        // Return original value as string if parsing fails
        return String(amount);
    }
};

/**
 * Format a USD price with appropriate decimal places
 * 
 * @param amount Price amount
 * @returns Formatted price string with $ prefix
 */
export const formatUsdPrice = (amount: string | number | BigNumber): string => {
    if (!amount) return '$0.00';

    try {
        const bn = BigNumber.isBigNumber(amount) 
            ? amount 
            : new BigNumber(String(amount));
        
        if (bn.isNaN() || !bn.isFinite()) return '$0.00';
        
        // Format based on value range
        if (bn.isGreaterThanOrEqualTo(1000000)) {
            // For large amounts, use fewer decimal places
            return '$' + bn.toFormat(0);
        } else if (bn.isGreaterThanOrEqualTo(1000)) {
            return '$' + bn.toFormat(2);
        } else if (bn.isGreaterThanOrEqualTo(1)) {
            return '$' + bn.toFormat(2);
        } else if (bn.isGreaterThan(0)) {
            // For small values, show more decimal places
            if (bn.isLessThan(0.001)) {
                return '$<0.001';
            } else {
                return '$' + bn.toFormat(3);
            }
        } else {
            return '$0.00';
        }
    } catch (error) {
        console.error('Error formatting USD price:', error);
        return '$0.00';
    }
};

/**
 * Format a gas price for display in the UI
 * 
 * @param gasPrice Gas price in USD
 * @returns Formatted gas price string
 */
export const formatGasPrice = (gasPrice: string | number | BigNumber | null): string => {
    if (!gasPrice) return '~$0.00';

    try {
        const bn = BigNumber.isBigNumber(gasPrice) 
            ? gasPrice 
            : new BigNumber(String(gasPrice));
        
        if (bn.isNaN() || !bn.isFinite()) return '~$0.00';
        
        // Always start with a tilde to indicate approximation
        if (bn.isGreaterThanOrEqualTo(1000)) {
            return '~$' + bn.toFormat(0);
        } else if (bn.isGreaterThanOrEqualTo(1)) {
            return '~$' + bn.toFormat(2);
        } else if (bn.isGreaterThan(0)) {
            if (bn.isLessThan(0.01)) {
                return '~$<0.01';
            } else {
                return '~$' + bn.toFormat(2);
            }
        } else {
            return '~$0.00';
        }
    } catch (error) {
        console.error('Error formatting gas price:', error);
        return '~$0.00';
    }
};

/**
 * Format a percentage number
 * 
 * @param percentage Percentage value
 * @param decimals Number of decimals to display
 * @returns Formatted percentage string
 */
export const formatPercentage = (percentage: string | number | BigNumber, decimals: number = 2): string => {
    if (!percentage) return '0%';

    try {
        const bn = BigNumber.isBigNumber(percentage) 
            ? percentage 
            : new BigNumber(String(percentage));
        
        if (bn.isNaN() || !bn.isFinite()) return '0%';

        if (bn.abs().isLessThan(0.01)) {
            return '<0.01%';
        }
        
        return bn.toFormat(decimals) + '%';
    } catch (error) {
        console.error('Error formatting percentage:', error);
        return '0%';
    }
};

/**
 * Format a ratio number (e.g., exchange rate)
 * 
 * @param ratio The ratio to format
 * @param decimals Number of decimals to display
 * @returns Formatted ratio string
 */
export const formatRatio = (ratio: string | number | BigNumber, decimals: number = 6): string => {
    return formatTokenAmount(ratio, decimals);
};

/**
 * Validates a number to ensure it's a valid number string
 * @param value Value to validate
 * @returns Validated string or null if invalid
 */
function validateNumber(value: any): string | null {
    if (value === undefined || value === null) return null;
    
    try {
        // Convert to a BigNumber to validate
        const bn = new BigNumber(String(value));
        if (bn.isNaN() || !bn.isFinite()) return null;
        return bn.toString();
    } catch {
        return null;
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
                
                // Also extract ETH price if available
                const feeInEth = validateNumber(trade.gasFeeInfo.gasFeeInEth);
                if (feeInEth !== null) {
                    result.gasPriceInEth = feeInEth;
                }
                
                result.isEstimated = false;
                return result;
            }
        }

        // For cross-chain trades, check trade.gasData structure
        if (isCrossChain && trade.trade?.gasData?.gasPrice) {
            const feeInUsd = validateNumber(trade.trade.gasData.gasPrice);
            if (feeInUsd !== null) {
                result.gasPriceInUsd = feeInUsd;
                result.isEstimated = false;
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
                    result.isEstimated = false;
                    return result;
                }
            }

            // Check gasAmount property sometimes used in v2
            if (trade.gasAmount) {
                const feeInUsd = validateNumber(trade.gasAmount);
                if (feeInUsd !== null) {
                    result.gasPriceInUsd = feeInUsd;
                    result.isEstimated = true;
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

        // Return default values if all extraction attempts fail
        result.gasPriceInUsd = isCrossChain ? "15.00" : "5.00";
        result.gasPriceInEth = null;
        result.isEstimated = true;
        return result;
    } catch (error) {
        console.error("Error extracting gas price:", error);
        result.gasPriceInUsd = isCrossChain ? "15.00" : "5.00";
        result.gasPriceInEth = null;
        result.isEstimated = true;
        return result;
    }
}