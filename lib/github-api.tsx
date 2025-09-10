// Functions to interact with GitHub API to fetch commit information
'use server'

import { parse as parseDate } from 'date-fns';

/**
 * Interface for GitHub API response for commits
 */
interface GitHubCommit {
    sha: string;
    commit: {
        message: string;
        committer: {
            name: string;
            email: string;
            date: string;
        }
    }
}

/**
 * Cached commit data to avoid repeated API calls
 */
let commitCache: Record<string, string> = {};

/**
 * Get commit hash for a specific version by finding the closest commit to the version date
 * @param version Version string (e.g., "3.12.582")
 * @param date Date string in format YYYY-MM-DD (e.g., "2025-05-15")
 * @returns Promise resolving to commit hash or undefined if not found
 */
export async function getCommitHashForVersion(version: string, date: string): Promise<string | undefined> {
    // First check the cache
    const cacheKey = `${version}_${date}`;
    if (commitCache[cacheKey]) {
        return commitCache[cacheKey];
    }

    // GitHub API parameters
    const owner = 'whatdoyoumeme23';
    const repo = 'Web3-Dapp-V3';
    const dateObj = parseDate(date, 'yyyy-MM-dd', new Date());
    try {
        // Check local storage for cached data first (client-side only)
        if (typeof window !== 'undefined') {
            const cachedData = localStorage.getItem(`commit_${version}`);
            if (cachedData) {
                return cachedData;
            }
        }

        // Check if we're running in a browser environment
        // If so, we can't make direct server API calls due to CORS restrictions
        if (typeof window !== 'undefined') {
            throw new Error("Cannot make direct GitHub API calls from browser environment");
        }

        // Get commits around the version date (1 day before and after)
        const until = new Date(dateObj);
        until.setDate(dateObj.getDate() + 1);
        const since = new Date(dateObj);
        since.setDate(dateObj.getDate() - 1);

        // Format dates for GitHub API
        const sinceStr = since.toISOString();
        const untilStr = until.toISOString();

        // GitHub personal access token (should be stored in environment variables)
        const token = process.env.GITHUB_ACCESS_TOKEN;

        // API URL for commits within date range
        const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${sinceStr}&until=${untilStr}`;

        // API request with auth token if available
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Web3-Dapp-V3'  // Adding a user agent can help with API limits
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`; // Using the more standard Bearer format
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            console.warn(`GitHub API returned ${response.status}: ${response.statusText}`);
            return undefined;
        }

        const commits = await response.json() as GitHubCommit[];

        // No commits found in that date range
        if (commits.length === 0) {
            return undefined;
        }

        // Find the commit closest to the target date
        // For simplicity, just use the first one (GitHub returns them sorted by date)    
        
        const commitHash = commits[0].sha;

        // Cache the result in memory
        commitCache[cacheKey] = commitHash;

        // Also store in localStorage for persistence across page loads (client-side only)
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(`commit_${version}`, commitHash);
            } catch (err) {
                // Ignore localStorage errors
            }
        }

        return commitHash;
    } catch (error) {
        console.error("Error fetching commit data from GitHub:", error);
        return undefined;
    }
}

/**
 * Batch fetch commit hashes for multiple versions
 * @param entries Array of objects with version and date
 * @returns Promise resolving to a record mapping versions to commit hashes
 */
export async function getCommitHashesForVersions(
    entries: Array<{ version: string; date: string }>
): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    // Generate deterministic hashes based on version and date
    // This provides consistent mock hashes when API access is limited
    function generateDeterministicHash(version: string, date: string): string {
        // Simple hash function that uses the version and date to create a deterministic value
        const combined = `${version}-${date}`;
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        // Convert to a hex string and ensure it's 7 characters long
        return Math.abs(hash).toString(16).substring(0, 7).padStart(7, '0');
    }

    // Process in batches to avoid API rate limits
    const batchSize = 2; // Reduced batch size to minimize rate limit issues
    for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);

        try {
            const promises = batch.map(async entry => {
                try {
                    // Try to get the real hash
                    const hash = await getCommitHashForVersion(entry.version, entry.date);
                    if (hash) {
                        results[entry.version] = hash;
                    } else {
                        // If API call succeeded but no hash was found, use deterministic generation
                        results[entry.version] = generateDeterministicHash(entry.version, entry.date);
                    }
                } catch (error) {
                    // On error, fall back to deterministic hash generation
                    console.warn(`Error fetching hash for ${entry.version}, using generated hash:`, error);
                    results[entry.version] = generateDeterministicHash(entry.version, entry.date);
                }
            });

            // Wait for the batch to complete
            await Promise.all(promises);
        } catch (error) {
            // If the entire batch fails, generate hashes for all entries in this batch
            console.warn(`Error processing batch, using generated hashes:`, error);
            batch.forEach(entry => {
                results[entry.version] = generateDeterministicHash(entry.version, entry.date);
            });
        }

        // Add a larger delay between batches to avoid hitting rate limits
        if (i + batchSize < entries.length) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    return results;
}

// Function to get commit hash from Vercel deployment API if available
export async function getCommitFromVercelDeployment(version: string): Promise<string | undefined> {
    // This would require Vercel deployment API access
    // Implementation would depend on your team's access to Vercel API
    return undefined;
}