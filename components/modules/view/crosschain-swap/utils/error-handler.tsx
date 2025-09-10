import {
    RubicSdkError,
    InsufficientFundsError,
    InsufficientLiquidityError,
    LowSlippageDeflationaryTokenError,
    MaxAmountError,
    MinAmountError,
    WalletNotConnectedError,
    NoLinkedAccountError,
    UpdatedRatesError,
    TooLowAmountError,
} from 'rubic-sdk';

/**
 * User-friendly error message mapping for Rubic SDK errors
 */
export function getSwapErrorMessage(error: unknown): { message: string; title: string; isWarning?: boolean } {
    // Default response for unknown errors
    let response = {
        title: "Error",
        message: "An unknown error occurred. Please try again.",
        isWarning: false,
    };

    // Handle Rubic SDK specific errors
    if (error instanceof RubicSdkError) {
        if (error instanceof InsufficientFundsError) {
            response = {
                title: "Insufficient Funds",
                message: "You don't have enough balance to complete this swap.",
                isWarning: true,
            };
        } else if (error instanceof InsufficientLiquidityError) {
            response = {
                title: "Insufficient Liquidity",
                message: "Not enough liquidity available for this swap amount. Try a smaller amount or different token pair.",
                isWarning: true,
            };
        } else if (error instanceof LowSlippageDeflationaryTokenError) {
            response = {
                title: "Slippage Too Low",
                message: "This token has a transfer fee. Please increase slippage tolerance.",
                isWarning: true,
            };
        } else if (error instanceof MaxAmountError) {
            response = {
                title: "Amount Too High",
                message: "The swap amount is too high. Please try a smaller amount.",
                isWarning: true,
            };
        } else if (error instanceof MinAmountError || error instanceof TooLowAmountError) {
            response = {
                title: "Amount Too Low",
                message: "The swap amount is below the minimum required. Please increase the amount.",
                isWarning: true,
            };
        } else if (error instanceof UpdatedRatesError) {
            response = {
                title: "Rates Updated",
                message: "Market rates changed. Please get a new quote and try again.",
                isWarning: true,
            };
        } else if (error instanceof WalletNotConnectedError || error instanceof NoLinkedAccountError) {
            response = {
                title: "Wallet Not Connected",
                message: "Please connect your wallet to continue.",
                isWarning: true,
            };
        } else {
            // Generic message for other Rubic errors
            response = {
                title: "Swap Error",
                message: error.message,
                isWarning: false,
            };
        }
    } else if (error instanceof Error) {
        // Handle regular JavaScript errors
        const errorMessage = error.message.toLowerCase();

        // Check for common MetaMask and wallet errors
        if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
            response = {
                title: "Transaction Rejected",
                message: "You rejected the transaction. Please try again if this was not intended.",
                isWarning: true,
            };
        } else if (errorMessage.includes('gas') && errorMessage.includes('limit')) {
            response = {
                title: "Gas Limit Error",
                message: "The gas limit for this transaction is too low or too high. Try adjusting your settings.",
                isWarning: true,
            };
        } else if (errorMessage.includes('nonce')) {
            response = {
                title: "Nonce Error",
                message: "Transaction nonce error. Try resetting your wallet's transaction history or wait for pending transactions.",
                isWarning: true,
            };
        } else if (errorMessage.includes('insufficient funds')) {
            response = {
                title: "Insufficient Funds",
                message: "You don't have enough funds to cover gas fees for this transaction.",
                isWarning: true,
            };
        } else if (errorMessage.includes('rejected') || errorMessage.includes('reverted')) {
            response = {
                title: "Transaction Reverted",
                message: "The transaction was rejected by the blockchain. This could be due to network congestion or contract errors.",
                isWarning: true,
            };
        } else if (errorMessage.includes('network') || errorMessage.includes('disconnect')) {
            response = {
                title: "Network Error",
                message: "Network connection issue. Please check your internet connection and try again.",
                isWarning: true,
            };
        } else if (errorMessage.includes('timeout')) {
            response = {
                title: "Request Timeout",
                message: "The request timed out. The network might be congested. Please try again later.",
                isWarning: true,
            };
        } else if (errorMessage.includes('slippage')) {
            response = {
                title: "Slippage Error",
                message: "Transaction would result in too much slippage. Try increasing your slippage tolerance or use a smaller amount.",
                isWarning: true,
            };
        } else if (errorMessage.includes('api') || errorMessage.includes('cors')) {
            response = {
                title: "API Error",
                message: "Error connecting to one of our services. Please try again later.",
                isWarning: true,
            };
        } else {
            // Generic Error with the actual message
            response = {
                title: "Transaction Error",
                message: error.message,
                isWarning: false,
            };
        }
    }

    return response;
}

/**
 * Format error messages for display
 */
export function formatError(error: unknown): string {
    if (!error) return 'Unknown error';

    if (typeof error === 'string') {
        return cleanErrorMessage(error);
    }

    if (error instanceof Error) {
        return cleanErrorMessage(error.message);
    }

    if (typeof error === 'object' && error !== null) {
        // Try to extract message from error object
        const errorObj = error as Record<string, any>;
        if (errorObj.message) {
            return cleanErrorMessage(errorObj.message);
        }

        // If the object has a reason or description, use that
        if (errorObj.reason) return cleanErrorMessage(errorObj.reason);
        if (errorObj.description) return cleanErrorMessage(errorObj.description);

        // Last resort, stringify the object
        try {
            return cleanErrorMessage(JSON.stringify(error));
        } catch {
            return 'Unknown error object';
        }
    }

    return 'Unknown error';
}

/**
 * Clean up error message by removing technical details
 */
function cleanErrorMessage(message: string): string {
    // Remove common prefixes
    message = message.replace(/^Error: /i, '');
    message = message.replace(/^Exception: /i, '');

    // Remove wallet-specific prefixes
    message = message.replace(/^MetaMask: /i, '');
    message = message.replace(/^WalletConnect: /i, '');

    // Remove hex data and addresses for cleaner messages
    message = message.replace(/0x[a-fA-F0-9]{8,}/g, '[address]');

    // Remove URLs
    message = message.replace(/https?:\/\/[^\s]+/g, '');

    // Capitalize first letter
    message = message.charAt(0).toUpperCase() + message.slice(1);

    return message;
}

/**
 * Check if an error is a wallet rejection error
 */
export function isUserRejectionError(error: unknown): boolean {
    if (!error) return false;

    // Check if it's a string
    if (typeof error === 'string') {
        const errorMessage = error.toLowerCase();
        return errorMessage.includes('user rejected') ||
            errorMessage.includes('user denied') ||
            errorMessage.includes('rejected by user') ||
            errorMessage.includes('user cancelled');
    }

    // Check if it's an Error object
    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        return errorMessage.includes('user rejected') ||
            errorMessage.includes('user denied') ||
            errorMessage.includes('rejected by user') ||
            errorMessage.includes('user cancelled');
    }

    // Check if it's an error object
    if (typeof error === 'object' && error !== null) {
        const errorObj = error as Record<string, any>;

        // Check for MetaMask error codes
        if (errorObj.code === 4001) return true;

        // Check message property
        if (errorObj.message && typeof errorObj.message === 'string') {
            const errorMessage = errorObj.message.toLowerCase();
            return errorMessage.includes('user rejected') ||
                errorMessage.includes('user denied') ||
                errorMessage.includes('rejected by user') ||
                errorMessage.includes('user cancelled');
        }
    }

    return false;
}

export default {
    getSwapErrorMessage,
    formatError,
    isUserRejectionError
};