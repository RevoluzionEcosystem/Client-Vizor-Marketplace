/**
 * Debug utilities for the Rubic SDK integration
 * These functions help identify and resolve issues with the SDK and API calls
 */

// Enable or disable debug logging
const DEBUG_ENABLED = true;

/**
 * Log debug messages if debugging is enabled
 */
export function debug(...args: any[]) {
  if (DEBUG_ENABLED) {
    console.log("[Rubic Debug]", ...args);
  }
}

/**
 * Log errors related to Rubic SDK
 */
export function logError(context: string, error: any) {
  console.error(`[Rubic Error] ${context}:`, error);

  // Extract more detailed error information if available
  if (error?.response) {
    console.error("Response data:", error.response.data);
    console.error("Response status:", error.response.status);
  } else if (error?.message) {
    console.error("Error message:", error.message);
  } else if (typeof error === "string") {
    console.error("Error string:", error);
  }

  // Additional information about the context
  if (typeof window !== "undefined") {
    console.error("Current origin:", window.location.origin);
  }
}

/**
 * Log network requests for debugging
 */
export function logRequest(method: string, url: string, body?: any) {
  if (!DEBUG_ENABLED) return;

  console.log(`[Rubic Request] ${method} ${url}`);
  if (body) {
    console.log("Request body:", body);
  }
}

/**
 * Log network responses for debugging
 */
export function logResponse(url: string, status: number, data?: any) {
  if (!DEBUG_ENABLED) return;

  console.log(`[Rubic Response] ${url} - Status: ${status}`);
  if (data) {
    console.log("Response data:", data);
  }
}

/**
 * Monitor all fetch calls related to Rubic
 * This can be used to debug network requests
 */
export function monitorFetch() {
  if (typeof window === "undefined" || !DEBUG_ENABLED) {
    return;
  }

  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input.toString();

    // Only monitor Rubic-related calls
    if (
      url.includes("rubic") ||
      url.includes("crosschain") ||
      url.includes("/api/crosschain-swap/")
    ) {
      logRequest(init?.method || "GET", url, init?.body);

      try {
        const response = await originalFetch(input, init);

        // Clone the response to avoid consuming it
        const clonedResponse = response.clone();

        // Try to get response data for logging
        clonedResponse
          .text()
          .then((text) => {
            try {
              const data = JSON.parse(text);
              logResponse(url, response.status, data);
            } catch (e) {
              logResponse(url, response.status, text);
            }
          })
          .catch(() => {
            logResponse(url, response.status);
          });

        return response;
      } catch (error) {
        logError(`Failed fetch to ${url}`, error);
        throw error;
      }
    }

    // Use original fetch for other calls
    return originalFetch(input, init);
  };

  console.log("[Rubic Debug] Fetch monitoring enabled");
}
