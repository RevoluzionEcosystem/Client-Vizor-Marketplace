'use server'

import React from 'react'
import Script from 'next/script'

const getCommitHashForScript = async () => {
    try {
        // First try to use Vercel environment variables (production)
        if (process.env.VERCEL_GIT_COMMIT_SHA) {
            return process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7);
        }
        
        // If not on Vercel, try getting it from git (development)
        const { execSync } = await import('child_process')
        const hash = execSync("git rev-parse --short HEAD").toString().trim()
        
        // Make it available as a public env var for client components
        if (typeof process !== "undefined" && process.env) {
            process.env.NEXT_PUBLIC_COMMIT_HASH = hash;
        }
        
        return hash;
    } catch (error) {
        // Fallback to any other available options
        const fallbackHash = process.env.NEXT_PUBLIC_COMMIT_HASH || "dev";
        
        console.warn("Failed to get commit hash:", error);
        console.info("Using fallback hash:", fallbackHash);
        
        return fallbackHash;
    }
}

export async function CommitHashInjector() {
    const commitHash = await getCommitHashForScript()

    // Inject commit hash as a global variable
    return (
        <Script id="inject-commit-hash" strategy="beforeInteractive">
            {`
                window.__COMMIT_HASH__ = "${commitHash}";
                // Store in localStorage for persistence across page loads
                try {
                    localStorage.setItem("__COMMIT_HASH__", "${commitHash}");
                } catch (e) {
                    // Handle localStorage not available
                }
            `}
        </Script>
    )
}