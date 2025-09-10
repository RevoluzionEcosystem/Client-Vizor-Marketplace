import { useState, useEffect } from 'react';
import { useContractData } from './use-contract-data';

// Define the token info data structure
export interface TokenInfo {
    name?: string;
    symbol?: string;
    price: string;
    price_raw: number;
    market_cap: string;
    market_cap_raw: number;
    volume_24h: string;
    volume_24h_raw: number;
    holders: string;
    holders_raw: number;
    total_supply: string;
    total_supply_normalized?: string;
    staked_supply: string;
    staked_supply_raw: number;
    staking_percentage?: string;
    image_url: string;
    contract_address: string;
    distribution?: {
        initial_liquidity: number;
        staking_rewards: number;
        incubation_fund: number;
        treasury: number;
        marketing: number;
    };
}

// Define the hero section data structure
export interface HeroSectionData {
    stats: {
        tvl: {
            label: string;
            value: string;
        };
        investors: {
            label: string;
            value: string;
        };
        profits: {
            label: string;
            value: string;
        };
    };
    floating_cards: {
        returns: {
            value: string;
            label: string;
        };
        security: {
            title: string;
            subtitle: string;
        };
        tvl: {
            value: string;
            label: string;
        };
    };
    token_info: TokenInfo;
}

/**
 * Hook for fetching token data from the blockchain with API fallback
 * @returns Object containing token data, loading state, and error
 */
export function useTokenData() {
    const [tokenData, setTokenData] = useState<HeroSectionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Get data from blockchain
    const { contractData, loading: contractLoading, error: contractError } = useContractData();    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Prioritize API data since it includes comprehensive market data
                // Add cache-busting to ensure fresh data
                const response = await fetch(`/api/hero-data?t=${Date.now()}`, {
                    cache: 'no-cache',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                console.log('API data fetched successfully:', data.token_info?.price, data.token_info?.market_cap);
                setTokenData(data);
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error('Error fetching token data from API:', err);
                
                // Fallback to contract data if API fails
                if (contractData) {
                    console.log('Using contract data as fallback');
                    setTokenData(contractData);
                } else {
                    setError(err instanceof Error ? err : new Error('Unknown error occurred'));
                }
            } finally {
                setLoading(false);
            }
        };

        // Always fetch data, don't wait for contract loading
        fetchData();
    }, []); // Remove dependencies to force fresh fetch

    // Prepare a fallback data structure
    const fallbackData: HeroSectionData = {
        stats: {
            tvl: {
                label: 'Total Value Locked',
                value: '$1.1M+'
            },
            investors: {
                label: 'Active Stakers',
                value: '371+'
            },
            profits: {
                label: 'Rewards Distributed',
                value: '$100K+'
            }
        },
        floating_cards: {
            returns: {
                value: '3-24 months',
                label: 'Lock Periods'
            },
            security: {
                title: 'Security',
                subtitle: 'Multi-sig Protected'
            },
            tvl: {
                value: '$1.1M',
                label: 'Total Value Locked'
            }
        },        token_info: {
            name: "Web3 Whales",
            symbol: "W3W",
            price: '$0.011163',
            price_raw: 0.011163,
            market_cap: '$1.04M',
            market_cap_raw: 1040000,
            volume_24h: '$2.12K',
            volume_24h_raw: 2120,
            holders: '371',
            holders_raw: 371,
            total_supply: '100000000000000000000000000.0',
            total_supply_normalized: '100000000.0',
            staked_supply: '76,324,590',
            staked_supply_raw: 76324590,
            staking_percentage: '76.32%',
            image_url: 'https://coin-images.coingecko.com/coins/images/30763/large/image_2024-02-28_125253731.png?1709096246',
            contract_address: '0x0079914B3C6fF1867b62c2CF8F108126970EAb6e',
            distribution: {
                initial_liquidity: 30,
                staking_rewards: 35,
                incubation_fund: 20,
                treasury: 10,
                marketing: 5
            }
        }
    };

    // Provide data to the component with safe fallbacks
    const safeData = tokenData || fallbackData;

    return {
        tokenData,
        safeData,
        loading: loading || contractLoading,
        error: error || contractError
    };
}

