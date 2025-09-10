import { SDK } from "rubic-sdk";
import { getSDK } from "./sdk-init";

export type TransactionStatus = "pending" | "success" | "failed" | "unknown";

export interface TransactionStatusResponse {
  status: TransactionStatus;
  txHash: string;
  destinationTxHash?: string;
  fromNetwork: string;
  toNetwork: string;
  timestamp: number;
  lastUpdated: number;
  details?: {
    provider?: string;
    estimatedTime?: number;
    completedSteps?: number;
    totalSteps?: number;
    currentStep?: string;
  };
}

/**
 * Tracks the status of a cross-chain transaction
 */
export class CrossChainTransactionTracker {
  private static instance: CrossChainTransactionTracker;
  private transactions: Record<string, TransactionStatusResponse> = {};
  private pollingIntervals: Record<string, NodeJS.Timeout> = {};
  private sdkPromise: Promise<SDK>;

  private constructor() {
    this.sdkPromise = getSDK();
  }

  /**
   * Gets the singleton instance of the tracker
   */
  public static getInstance(): CrossChainTransactionTracker {
    if (!CrossChainTransactionTracker.instance) {
      CrossChainTransactionTracker.instance =
        new CrossChainTransactionTracker();
    }
    return CrossChainTransactionTracker.instance;
  }

  /**
   * Start tracking a cross-chain transaction
   * @param txHash Source transaction hash
   * @param fromNetwork Source blockchain name
   * @param toNetwork Destination blockchain name
   * @param provider Bridge provider name
   * @returns Transaction status object
   */
  public async trackTransaction(
    txHash: string,
    fromNetwork: string,
    toNetwork: string,
    provider: string
  ): Promise<TransactionStatusResponse> {
    // If already tracking, return existing status
    if (this.transactions[txHash]) {
      return this.transactions[txHash];
    }

    // Initialize new transaction status
    const status: TransactionStatusResponse = {
      status: "pending",
      txHash,
      fromNetwork,
      toNetwork,
      timestamp: Date.now(),
      lastUpdated: Date.now(),
      details: {
        provider,
        estimatedTime: this.getEstimatedTimeByProvider(provider),
        completedSteps: 1,
        totalSteps: 3, // Default steps: source tx, bridge processing, destination tx
        currentStep: "Source transaction confirmed",
      },
    };

    // Store in memory
    this.transactions[txHash] = status;

    // Start polling for updates
    this.startPolling(txHash);

    return status;
  }

  /**
   * Get the current status of a transaction
   * @param txHash Transaction hash to check
   * @returns Transaction status or null if not found
   */
  public getTransactionStatus(
    txHash: string
  ): TransactionStatusResponse | null {
    return this.transactions[txHash] || null;
  }

  /**
   * Start polling for updates on a transaction's status
   * @param txHash Transaction hash to monitor
   */
  private startPolling(txHash: string): void {
    const POLLING_INTERVAL = 15000; // 15 seconds
    const MAX_POLLING_COUNT = 120; // 30 minutes max (120 * 15s)

    let pollingCount = 0;

    // Clear any existing interval
    if (this.pollingIntervals[txHash]) {
      clearInterval(this.pollingIntervals[txHash]);
    }

    // Set up polling interval
    this.pollingIntervals[txHash] = setInterval(async () => {
      try {
        pollingCount++;

        // Get latest transaction status
        await this.updateTransactionStatus(txHash);

        // Stop polling if terminal state reached or max polling time exceeded
        const status = this.transactions[txHash].status;
        if (
          status === "success" ||
          status === "failed" ||
          pollingCount >= MAX_POLLING_COUNT
        ) {
          this.stopPolling(txHash);
        }
      } catch (error) {
        console.error(`Error polling transaction ${txHash}:`, error);

        // Even on error, keep trying until max count
        if (pollingCount >= MAX_POLLING_COUNT) {
          this.stopPolling(txHash);
        }
      }
    }, POLLING_INTERVAL);
  }

  /**
   * Stop polling for a transaction
   * @param txHash Transaction hash to stop monitoring
   */
  private stopPolling(txHash: string): void {
    if (this.pollingIntervals[txHash]) {
      clearInterval(this.pollingIntervals[txHash]);
      delete this.pollingIntervals[txHash];
    }
  }

  /**
   * Get estimated time in seconds for a bridge provider
   * @param provider Bridge provider name
   * @returns Estimated time in seconds
   */
  private getEstimatedTimeByProvider(provider: string): number {
    // Estimated times in seconds
    const estimatedTimes: Record<string, number> = {
      lifi: 180,
      xy: 240,
      squidrouter: 300,
      rango: 240,
      changenow: 300,
      stargate_v2: 180,
      default: 300,
    };

    return estimatedTimes[provider.toLowerCase()] || estimatedTimes.default;
  }

  /**
   * Update the transaction status from the network
   * @param txHash Transaction hash
   */
  private async updateTransactionStatus(txHash: string): Promise<void> {
    const transaction = this.transactions[txHash];
    if (!transaction) return;

    try {
      const sdk = await this.sdkPromise;

      // Query SDK for transaction status
      // Note: Implementation depends on actual SDK methods for tracking
      const statusResponse = await fetch(
        `/api/crosschain-swap/tx-status?txHash=${txHash}&fromNetwork=${transaction.fromNetwork}&toNetwork=${transaction.toNetwork}`
      );

      if (!statusResponse.ok) {
        throw new Error("Failed to fetch transaction status");
      }

      const { status, destinationTxHash } = await statusResponse.json();

      // Update transaction status
      transaction.status = this.mapApiStatusToTransactionStatus(status);
      transaction.lastUpdated = Date.now();

      if (destinationTxHash) {
        transaction.destinationTxHash = destinationTxHash;
      }

      // Update progress information
      this.updateTransactionProgress(transaction);
    } catch (error) {
      console.error(`Error updating transaction ${txHash} status:`, error);
    }
  }

  /**
   * Map API status to our transaction status type
   * @param apiStatus Status from the API
   * @returns Standardized transaction status
   */
  private mapApiStatusToTransactionStatus(
    apiStatus: string
  ): TransactionStatus {
    switch (apiStatus) {
      case "success":
      case "completed":
        return "success";
      case "failed":
      case "error":
        return "failed";
      case "pending":
      case "processing":
        return "pending";
      default:
        return "unknown";
    }
  }

  /**
   * Update the progress details of a transaction
   * @param transaction Transaction to update
   */
  private updateTransactionProgress(
    transaction: TransactionStatusResponse
  ): void {
    if (!transaction.details) {
      transaction.details = {};
    }

    // Calculate elapsed time
    const elapsedTime = (Date.now() - transaction.timestamp) / 1000; // seconds
    const estimatedTime = transaction.details.estimatedTime || 300;

    // Update steps based on status
    if (transaction.status === "success") {
      transaction.details.completedSteps = 3;
      transaction.details.currentStep = "Transaction completed";
    } else if (transaction.status === "failed") {
      transaction.details.currentStep = "Transaction failed";
    } else if (transaction.destinationTxHash) {
      transaction.details.completedSteps = 2;
      transaction.details.currentStep = "Destination transaction created";
    } else {
      // If we're past the estimated time, update messaging
      if (elapsedTime > estimatedTime * 1.5) {
        transaction.details.currentStep =
          "Bridge processing (taking longer than expected)";
      } else if (elapsedTime > estimatedTime) {
        transaction.details.currentStep = "Bridge processing (nearly complete)";
      } else {
        transaction.details.currentStep = "Bridge processing";
      }
    }
  }

  /**
   * Clean up old transactions
   * @param maxAge Maximum age in milliseconds
   */
  public cleanupOldTransactions(maxAge: number = 86400000): void {
    // Default: 24 hours
    const now = Date.now();

    Object.keys(this.transactions).forEach((txHash) => {
      const transaction = this.transactions[txHash];

      // Clean up completed transactions older than maxAge
      if (
        (transaction.status === "success" || transaction.status === "failed") &&
        now - transaction.lastUpdated > maxAge
      ) {
        delete this.transactions[txHash];
      }
    });
  }
}
