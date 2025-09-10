import pkg from "@/package.json"

// Set a global variable to store the commit hash for client-side access
declare global {
  interface Window {
    __COMMIT_HASH__: string;
  }
}

// Function to get commit hash from environment variables
const getCommitHash = (): string => {
  // Check for Vercel environment variables first
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7);
  }

  // Check for the Next.js public environment variable
  if (process.env.NEXT_PUBLIC_COMMIT_HASH) {
    return process.env.NEXT_PUBLIC_COMMIT_HASH;
  }

  // Default to development mode
  return "dev";
}

// Determine commit hash at build/server time
let commitHash = "dev";

if (typeof window === "undefined") {
  // We're on the server
  commitHash = getCommitHash();

  // Make hash available via env for client components
  if (typeof process !== "undefined" && process.env) {
    process.env.NEXT_PUBLIC_COMMIT_HASH = commitHash;
  }
} else {
  // We're on the client - add a delay to ensure CommitHashInjector has run
  const getClientSideHash = () => {
    // First check if injected by CommitHashInjector
    if (window.__COMMIT_HASH__ && window.__COMMIT_HASH__ !== "dev") {
      return window.__COMMIT_HASH__;
    }
    
    // Next check environment variable
    if (process.env.NEXT_PUBLIC_COMMIT_HASH && 
        process.env.NEXT_PUBLIC_COMMIT_HASH !== "dev") {
      return process.env.NEXT_PUBLIC_COMMIT_HASH;
    }
    
    // Fallback to Vercel environment variable that might be exposed
    if (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA) {
      return process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7);
    }
    
    // Ultimate fallback
    return "dev";
  };
  
  commitHash = getClientSideHash();
  
  // Store for future client-side access
  window.__COMMIT_HASH__ = commitHash;
}

export const getCommit = () => {
  // For client-side, we need to re-check each time to handle potential timing issues
  const currentHash = typeof window !== "undefined" ? 
    (window.__COMMIT_HASH__ || process.env.NEXT_PUBLIC_COMMIT_HASH || commitHash) : 
    commitHash;
      return {
    name: pkg.name,
    title: pkg.title,
    short_title: pkg.short_title,
    year: pkg.year,
    description: pkg.description,
    version: pkg.version,
    support: pkg.tech_support,
    repository: pkg.repository,
    license: pkg.license,
    hash: currentHash,
    commitHash: currentHash // Additional explicit property for better semantics
  }
}