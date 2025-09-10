"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { governanceAbi } from '@/components/modules/view/governance/abi/governance-abi';
import { bscTestnet } from 'wagmi/chains';

const GOVERNANCE_CONTRACT_ADDRESS = '0xBC7C7C8bE48dCB848723a21Dc7E4a11E887a037C' as `0x${string}`;

interface ProposalInformation {
    title: string;
    summary: string;
    motivationProblem: string;
    proposedSolution: string;
    costFundingRequired: string;
    implementationPlan: string;
    expectedImpact: string;
}

interface ProposalStatus {
    approvedStatus: boolean;
    rejectedStatus: boolean;
    canceledStatus: boolean;
    executedStatus: boolean;
    reviewingStatus: boolean;
    approvedPic: `0x${string}`;
    rejectedPic: `0x${string}`;
    canceledPic: `0x${string}`;
    executedPic: `0x${string}`;
}

interface ProposalCore {
    id: bigint;
    startTime: bigint;
    endTime: bigint;
    category: bigint;
    lockedToken: bigint;
    proposer: `0x${string}`;
    updateMsg: string;
    needUpdate: boolean;
    completed: boolean;
    success: boolean;
    information: ProposalInformation;
    status: ProposalStatus;
}

export interface ProposalData {
    id: bigint;
    totalOptions: bigint;
    proposal: ProposalCore;
    stats: {
        quorumAmount: bigint;
        totalVoters: bigint;
        totalVotesWeight: bigint;
        allVoters: readonly `0x${string}`[];
    };
    options: Array<{
        optionInfo: string;
        totalVoted: bigint;
        totalWeight: bigint;
        userVoted: readonly `0x${string}`[];
    }>;
}

export function useProposals(totalProposals?: bigint) {
    const [proposals, setProposals] = useState<ProposalData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const publicClient = usePublicClient({ chainId: bscTestnet.id });
    const proposalCount = totalProposals ? Number(totalProposals) : 0;

    // Fetch all proposals dynamically using viem public client
    const fetchAllProposals = useCallback(async () => {
        if (proposalCount === 0 || !publicClient) {
            setProposals([]);
            setIsLoading(false);
            setError(null);
            setLoadingProgress(0);
            return;
        }

        setIsLoading(true);
        setError(null);
        setLoadingProgress(0);

        try {
            const processedProposals: ProposalData[] = [];

            // Fetch proposals in batches to avoid overwhelming the RPC
            const BATCH_SIZE = 3;
            const totalBatches = Math.ceil(proposalCount / BATCH_SIZE);

            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const startId = batchIndex * BATCH_SIZE + 1;
                const endId = Math.min(startId + BATCH_SIZE - 1, proposalCount);
                
                console.log(`Fetching batch ${batchIndex + 1}/${totalBatches}: proposals ${startId}-${endId}`);

                // Create promises for this batch
                const batchPromises = [];
                
                for (let proposalId = startId; proposalId <= endId; proposalId++) {
                    const proposalPromises = Promise.all([
                        // Fetch proposal data
                        publicClient.readContract({
                            address: GOVERNANCE_CONTRACT_ADDRESS,
                            abi: governanceAbi,
                            functionName: 'idToProposal',
                            args: [BigInt(proposalId)]
                        }),
                        
                        // Fetch proposal stats
                        publicClient.readContract({
                            address: GOVERNANCE_CONTRACT_ADDRESS,
                            abi: governanceAbi,
                            functionName: 'idToProposalStats',
                            args: [BigInt(proposalId)]
                        }),
                        
                        // Fetch option 1 (Approve)
                        publicClient.readContract({
                            address: GOVERNANCE_CONTRACT_ADDRESS,
                            abi: governanceAbi,
                            functionName: 'proposalIdToVotingOptions',
                            args: [BigInt(proposalId), 1n]
                        }),
                        
                        // Fetch option 2 (Reject)
                        publicClient.readContract({
                            address: GOVERNANCE_CONTRACT_ADDRESS,
                            abi: governanceAbi,
                            functionName: 'proposalIdToVotingOptions',
                            args: [BigInt(proposalId), 2n]
                        })
                    ]).then(([proposalData, statsData, option1Data, option2Data]) => ({
                        proposalId,
                        proposalData,
                        statsData,
                        option1Data,
                        option2Data
                    }));

                    batchPromises.push(proposalPromises);
                }

                // Wait for this batch to complete
                const batchResults = await Promise.all(batchPromises);

                // Process this batch
                for (const result of batchResults) {
                    if (result.proposalData && result.statsData && result.option1Data && result.option2Data) {
                        try {
                            const proposalData = await parseProposalData(
                                BigInt(result.proposalId),
                                result.proposalData as any[],
                                result.statsData as any[],
                                result.option1Data as any[],
                                result.option2Data as any[]
                            );
                            if (proposalData) {
                                processedProposals.push(proposalData);
                            }
                        } catch (parseError) {
                            console.error(`Error parsing proposal ${result.proposalId}:`, parseError);
                        }
                    }
                }

                // Update progress
                const progress = ((batchIndex + 1) / totalBatches) * 100;
                setLoadingProgress(progress);

                // Small delay between batches to avoid rate limiting
                if (batchIndex < totalBatches - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            // Sort proposals by ID in descending order (newest first)
            processedProposals.sort((a, b) => Number(b.id) - Number(a.id));
            
            console.log(`Successfully loaded ${processedProposals.length} proposals`);
            setProposals(processedProposals);
            setError(null);

        } catch (fetchError) {
            console.error('Error fetching proposals:', fetchError);
            setError(`Failed to fetch proposals: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
            setLoadingProgress(100);
        }
    }, [proposalCount, publicClient]);

    // Helper function to parse proposal data
    const parseProposalData = async (
        proposalId: bigint,
        proposalTuple: any[],
        statsTuple: any[],
        option1Tuple: any[],
        option2Tuple: any[]
    ): Promise<ProposalData | null> => {
        try {
            console.log(`Parsing proposal ${proposalId}:`, {
                proposal: proposalTuple,
                stats: statsTuple,
                option1: option1Tuple,
                option2: option2Tuple
            });

            // Parse proposal information and status
            const proposalInfo = proposalTuple[10] as any;
            const proposalStatus = proposalTuple[11] as any;

            // Handle both array and object formats for status
            let parsedStatus;
            if (Array.isArray(proposalStatus)) {
                parsedStatus = {
                    approvedStatus: Boolean(proposalStatus[0]),
                    rejectedStatus: Boolean(proposalStatus[1]),
                    canceledStatus: Boolean(proposalStatus[2]),
                    executedStatus: Boolean(proposalStatus[3]),
                    reviewingStatus: Boolean(proposalStatus[4]),
                    approvedPic: (proposalStatus[5] || '0x0000000000000000000000000000000000000000') as `0x${string}`,
                    rejectedPic: (proposalStatus[6] || '0x0000000000000000000000000000000000000000') as `0x${string}`,
                    canceledPic: (proposalStatus[7] || '0x0000000000000000000000000000000000000000') as `0x${string}`,
                    executedPic: (proposalStatus[8] || '0x0000000000000000000000000000000000000000') as `0x${string}`
                };
            } else {
                parsedStatus = {
                    approvedStatus: Boolean(proposalStatus?.approvedStatus),
                    rejectedStatus: Boolean(proposalStatus?.rejectedStatus),
                    canceledStatus: Boolean(proposalStatus?.canceledStatus),
                    executedStatus: Boolean(proposalStatus?.executedStatus),
                    reviewingStatus: Boolean(proposalStatus?.reviewingStatus),
                    approvedPic: (proposalStatus?.approvedPic || '0x0000000000000000000000000000000000000000') as `0x${string}`,
                    rejectedPic: (proposalStatus?.rejectedPic || '0x0000000000000000000000000000000000000000') as `0x${string}`,
                    canceledPic: (proposalStatus?.canceledPic || '0x0000000000000000000000000000000000000000') as `0x${string}`,
                    executedPic: (proposalStatus?.executedPic || '0x0000000000000000000000000000000000000000') as `0x${string}`
                };
            }

            const proposalCore: ProposalCore = {
                id: proposalTuple[0] as bigint,
                startTime: proposalTuple[1] as bigint,
                endTime: proposalTuple[2] as bigint,
                category: proposalTuple[3] as bigint,
                lockedToken: proposalTuple[4] as bigint,
                proposer: proposalTuple[5] as `0x${string}`,
                updateMsg: proposalTuple[6] as string,
                needUpdate: proposalTuple[7] as boolean,
                completed: proposalTuple[8] as boolean,
                success: proposalTuple[9] as boolean,
                information: {
                    title: proposalInfo?.title || proposalInfo?.[0] || '',
                    summary: proposalInfo?.summary || proposalInfo?.[1] || '',
                    motivationProblem: proposalInfo?.motivationProblem || proposalInfo?.[2] || '',
                    proposedSolution: proposalInfo?.proposedSolution || proposalInfo?.[3] || '',
                    costFundingRequired: proposalInfo?.costFundingRequired || proposalInfo?.[4] || '',
                    implementationPlan: proposalInfo?.implementationPlan || proposalInfo?.[5] || '',
                    expectedImpact: proposalInfo?.expectedImpact || proposalInfo?.[6] || ''
                },
                status: parsedStatus
            };

            const proposalData: ProposalData = {
                id: proposalId,
                totalOptions: 2n,
                proposal: proposalCore,
                stats: {
                    quorumAmount: statsTuple[0] as bigint,
                    totalVoters: statsTuple[1] as bigint,
                    totalVotesWeight: statsTuple[2] as bigint,
                    allVoters: (statsTuple[3] || []) as readonly `0x${string}`[]
                },
                options: [
                    {
                        optionInfo: (option1Tuple[0] || "Approve") as string,
                        totalVoted: BigInt(option1Tuple[1] || 0),
                        totalWeight: BigInt(option1Tuple[2] || 0),
                        userVoted: []
                    },
                    {
                        optionInfo: (option2Tuple[0] || "Reject") as string,
                        totalVoted: BigInt(option2Tuple[1] || 0),
                        totalWeight: BigInt(option2Tuple[2] || 0),
                        userVoted: []
                    }
                ]
            };

            return proposalData;
        } catch (error) {
            console.error(`Error parsing proposal ${proposalId}:`, error);
            return null;
        }
    };

    // Effect to trigger fetching when proposalCount changes
    useEffect(() => {
        fetchAllProposals();
    }, [fetchAllProposals]);

    // Refetch function
    const refetch = useCallback(async () => {
        await fetchAllProposals();
    }, [fetchAllProposals]);

    return {
        proposals,
        isLoading,
        error,
        loadingProgress,
        refetch
    };
}
