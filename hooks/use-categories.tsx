"use client";

import { useReadContract } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { governanceAbi } from "@/components/modules/view/governance/abi/governance-abi";

const GOVERNANCE_CONTRACT_ADDRESS = '0xBC7C7C8bE48dCB848723a21Dc7E4a11E887a037C' as `0x${string}`;

export function useCategories() {
    // Get total categories count
    const { data: totalCategories, error: totalError, isLoading: totalLoading } = useReadContract({
        address: GOVERNANCE_CONTRACT_ADDRESS,
        abi: governanceAbi,
        functionName: 'totalCategories',
        chainId: bscTestnet.id,
    });

    // Get category names (we'll fetch the ones that exist)
    const { data: category1, error: cat1Error } = useReadContract({
        address: GOVERNANCE_CONTRACT_ADDRESS,
        abi: governanceAbi,
        functionName: 'proposalCategory',
        args: [1n],
        chainId: bscTestnet.id,
        query: {
            enabled: totalCategories !== undefined && Number(totalCategories) >= 1
        }
    });

    const { data: category2, error: cat2Error } = useReadContract({
        address: GOVERNANCE_CONTRACT_ADDRESS,
        abi: governanceAbi,
        functionName: 'proposalCategory',
        args: [2n],
        chainId: bscTestnet.id,
        query: {
            enabled: totalCategories !== undefined && Number(totalCategories) >= 2
        }
    });

    const { data: category3, error: cat3Error } = useReadContract({
        address: GOVERNANCE_CONTRACT_ADDRESS,
        abi: governanceAbi,
        functionName: 'proposalCategory',
        args: [3n],
        chainId: bscTestnet.id,
        query: {
            enabled: totalCategories !== undefined && Number(totalCategories) >= 3
        }
    });

    const { data: category4, error: cat4Error } = useReadContract({
        address: GOVERNANCE_CONTRACT_ADDRESS,
        abi: governanceAbi,
        functionName: 'proposalCategory',
        args: [4n],
        chainId: bscTestnet.id,
        query: {
            enabled: totalCategories !== undefined && Number(totalCategories) >= 4
        }
    });

    // Build available categories array
    const availableCategories = [];
    const categoryCount = totalCategories ? Number(totalCategories) : 0;

    if (categoryCount >= 1 && category1) {
        availableCategories.push({ value: "1", label: category1 as string });
    }
    if (categoryCount >= 2 && category2) {
        availableCategories.push({ value: "2", label: category2 as string });
    }
    if (categoryCount >= 3 && category3) {
        availableCategories.push({ value: "3", label: category3 as string });
    }
    if (categoryCount >= 4 && category4) {
        availableCategories.push({ value: "4", label: category4 as string });
    }

    return {
        totalCategories: categoryCount,
        availableCategories,
        isLoading: totalLoading,
        error: totalError,
        hasCategories: categoryCount > 0
    };
}
