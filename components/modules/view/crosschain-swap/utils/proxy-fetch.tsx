/**
 * Custom fetch implementation that routes Rubic SDK requests through our proxy endpoints
 * This solves CORS issues by ensuring all external API calls go through our server
 */

// Map of API endpoint patterns to our proxy routes
const API_PROXY_ROUTES = {
  "/crosschain/v1/": "/api/crosschain-swap/calculate-trade",
  "/on-chain/v1/": "/api/crosschain-swap/calculate-trade",
  "/execute/": "/api/crosschain-swap/execute-swap",
  "x-api.rubic.exchange": "/api/crosschain-swap/x-api",
  "api.thegraph.com": "/api/crosschain-swap/thegraph",
  "changelly": "/api/crosschain-swap/external",
  "symbiosis.finance": "/api/crosschain-swap/external",
  "simpleswap": "/api/crosschain-swap/external",
  "changenow.io": "/api/crosschain-swap/external",
  "pathfinder.routerprotocol.com": "/api/crosschain-swap/external",
  "squidrouter": "/api/crosschain-swap/external",
  "rango": "/api/crosschain-swap/external",
  "unizen": "/api/crosschain-swap/external",
  // Default fallback
  default: "/api/crosschain-swap/proxy",
};

/**
 * Custom fetch function that routes requests through our proxy
 */
export async function proxyFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = input.toString();

  // Determine which proxy route to use based on the URL pattern
  let proxyRoute = API_PROXY_ROUTES.default;
  for (const [pattern, route] of Object.entries(API_PROXY_ROUTES)) {
    if (url.includes(pattern)) {
      proxyRoute = route;
      break;
    }
  }

  // For direct RPC calls to blockchain nodes, use the default fetch
  if (
    url.includes("https://") &&
    (url.includes("rpc.") || url.includes(".rpc.") || url.includes("-rpc."))
  ) {
    return fetch(input, init);
  }

  // Special handling for TheGraph API
  if (url.includes("api.thegraph.com")) {
    // Parse the GraphQL request
    const body = init?.body ? 
      typeof init.body === 'string' ? 
        JSON.parse(init.body) : init.body : 
      {};
      
    // Route through our thegraph proxy with the subgraph URL
    const response = await fetch("/api/crosschain-swap/thegraph", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subgraphUrl: url,
        query: body.query,
        variables: body.variables || {}
      })
    });

    return response;
  }

  // Special handling for x-api.rubic.exchange
  if (url.includes("x-api.rubic.exchange")) {
    const urlObj = new URL(url);
    const path = urlObj.pathname + urlObj.search;

    // Handle GET requests to x-api differently
    if (!init || init.method === "GET" || !init.method) {
      const proxyUrl = new URL("/api/crosschain-swap/x-api", window.location.origin);
      proxyUrl.searchParams.set("path", path);
      
      // Copy over other parameters from the original URL
      for (const [key, value] of urlObj.searchParams.entries()) {
        proxyUrl.searchParams.set(key, value);
      }

      return fetch(proxyUrl.toString(), {
        ...init,
        method: "GET"
      });
    }

    // Handle POST requests to x-api
    if (init.method === "POST") {
      return fetch("/api/crosschain-swap/x-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: path,
          body: init.body && typeof init.body === 'string' ? 
            JSON.parse(init.body) : init.body
        })
      });
    }
  }

  // External services handling through the external proxy
  if (
    url.includes("changelly") || 
    url.includes("changenow") || 
    url.includes("simpleswap") || 
    url.includes("symbiosis") ||
    url.includes("pathfinder.routerprotocol") ||
    url.includes("squidrouter") ||
    url.includes("rango") ||
    url.includes("unizen")
  ) {
    if (!init || init.method === "GET" || !init.method) {
      const proxyUrl = new URL("/api/crosschain-swap/external", window.location.origin);
      proxyUrl.searchParams.set("url", url);
      return fetch(proxyUrl.toString(), {
        method: "GET"
      });
    } else {
      const proxyUrl = new URL("/api/crosschain-swap/external", window.location.origin);
      proxyUrl.searchParams.set("url", url);
      return fetch(proxyUrl.toString(), {
        method: "POST",
        headers: init.headers,
        body: init.body
      });
    }
  }

  // Prepare the request data for our proxy
  const method = init?.method || "GET";
  const headers = init?.headers || {};
  const body = init?.body
    ? typeof init.body === "string"
      ? JSON.parse(init.body)
      : init.body
    : undefined;

  // Make the request to our proxy endpoint
  const proxyResponse = await fetch(proxyRoute, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      method,
      headers,
      body,
      endpoint: url.includes("api.rubic.exchange")
        ? url.replace("https://api.rubic.exchange", "")
        : undefined
    }),
  });

  return proxyResponse;
}

/**
 * Install our proxy fetch as the global fetch in specific environments
 * This will intercept all Rubic SDK fetch calls and route them through our proxy
 */
export function installProxyFetch() {
  // Only patch fetch in client-side environments
  if (typeof window !== "undefined") {
    // Store original fetch
    const originalFetch = window.fetch;

    // Replace global fetch with our proxy version
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      // Only intercept Rubic API calls and known problematic services
      if (
        url.includes("api.rubic.exchange") ||
        url.includes("x-api.rubic.exchange") ||
        url.includes("/crosschain/") ||
        url.includes("/on-chain/") ||
        url.includes("/execute/") ||
        url.includes("api.thegraph.com") ||
        url.includes("changelly") ||
        url.includes("changenow") ||
        url.includes("simpleswap") ||
        url.includes("symbiosis") ||
        url.includes("pathfinder.routerprotocol") ||
        url.includes("squidrouter") ||
        url.includes("rango") ||
        url.includes("unizen")
      ) {
        return proxyFetch(input, init);
      }

      // Use original fetch for everything else
      return originalFetch(input, init);
    };

    console.log("Proxy fetch installed for Rubic SDK requests");
  }
}
