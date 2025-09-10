"use client"

import { readContract } from "@wagmi/core"
import { useState, useEffect } from "react"
import { getAddress, isAddress } from "viem"
import { checkAPI, truncateAddress } from "@/lib/helpers"
import { conf } from "../context/context"
import { tokenAbi } from "../hooks/token"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { terms } from "../data/swap-data"
import { IconImage } from "@/lib/icon-utils"
import { useTokenImage, getTokenImage } from "../hooks/use-token-image"

// Import both the static and dynamic whitelists
import staticWhitelist from "./whitelist"
import { useTokens } from "./whitelist"

const api = process.env.NEXT_PUBLIC_PROJECT_ID

// Token image component that uses the useTokenImage hook
const TokenImageWithHook = ({ address, symbol, network, className }) => {
    const { logoUrl } = useTokenImage({
        address,
        symbol,
        network
    });

    return (
        <IconImage 
            src={logoUrl} 
            alt={symbol} 
            className={className}
            fallbackSrc="/assets/tokens/default.svg" 
        />
    );
};

export default function CardTokenFrom({network, selectToken}) {
	const [complete, setComplete] = useState(true)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [result, setResult] = useState([])
	
	// Get token data from dynamic whitelist
	const { tokens, loading: tokensLoading, fetchNetworkTokens } = useTokens();
	
	// Use the dynamic token list if available, fall back to static whitelist
	const allowed = tokens[network] || staticWhitelist[network] || [];
	
	// Fetch tokens for this network when component mounts or network changes
	useEffect(() => {
		if (network) {
			fetchNetworkTokens(network);
		}
	}, [network]);

	const searching = async (val) => {
		setResult([])
		setLoading(true)
		setComplete(false)
		setSearch(val)
		if (val.length === 42 && isAddress(val)) {
			const res = await fetch(`/api/validate/${network}?address=${val}`, {
				next: {
					revalidate: 60
				},
				headers: {
					"API-Key": api
				}
			})
			const resultRes = await res.json()
			if (resultRes.status) {
				setResult(resultRes["info"])
			}
		} else {
			const res = await fetch(`/api/search?network=${network}&search=${val}`, {
				next: {
					revalidate: 60
				},
				headers: {
					"API-Key": api
				}
			})
			const resultRes = await res.json()
			setResult(resultRes["data"])
		}
		setComplete(true)
		setLoading(false)
	}

	const selecting = async (val, symbol) => {
		const resTokenSymbol = await readContract(conf, {
			abi: tokenAbi,
			address: getAddress(val),
			functionName: "symbol",
			chainId: checkAPI(network).chain.id
		})
		
		// Get the token image from GeckoTerminal
		const tokenImage = await getTokenImage(val, resTokenSymbol, network);
		selectToken(val, resTokenSymbol, tokenImage)
	}

	return (
		<div>
			<Input className="mb-3" id="searchToken" type="text" placeholder={`${terms.search_token}`} value={search} onChange={(e) => searching(e.target.value)}/>
			{search === "" ? (
				<ScrollArea className="h-60 w-full rounded-md">
					{tokensLoading ? (
						<div className="flex w-full items-center px-2 rounded-md mb-1 py-1">
							Loading tokens...
						</div>
					) : allowed && allowed.length > 0 ? (
						allowed.map((item, index) => (
							<div key={`token-${index}`} className="flex w-full items-center cursor-pointer hover:bg-muted-foreground px-2 rounded-md mb-1 py-1" onClick={complete ? () => selectToken(item.address, item.symbol, item.image) : null}>
								<TokenImageWithHook 
                                    address={item.address} 
                                    symbol={item.symbol} 
                                    network={network}
                                    className="w-6 h-6 mr-3" 
                                />
								<div>
									<div className="font-bold text-md">
										{item.title || item.symbol}
									</div>
									<div className="font-light text-sm">
										{item.name}
									</div>
								</div>
							</div>
						))
					) : (
						<div className="flex w-full items-center px-2 rounded-md mb-1 py-1">
							No tokens available for this network.
						</div>
					)}
				</ScrollArea>
			) : (
				<ScrollArea className="h-60 w-full rounded-md text-foreground">
					{loading ? (
						<div className="flex w-full items-center cursor-pointer group hover:bg-muted-foreground px-2 rounded-md mb-1 py-1">
							{`${terms.token_searching}...`}
						</div>
					) :  (
						result && result.length > 0 ? (
							result.map((item, index) => (
								<div key={`token-${index}`} className="flex w-full items-center cursor-pointer group hover:bg-muted-foreground px-2 rounded-md mb-1 py-1" onClick={complete ? () => selecting(item.address, item.title || "") : null}>
									<TokenImageWithHook 
                                        address={item.address} 
                                        symbol={item.title} 
                                        network={network}
                                        className="w-6 h-6 mr-3" 
                                    />
									<div>
										<div className="font-light text-sm">
											{item.title}
										</div>
										<div className="font-light text-sm">
											{truncateAddress(item.address, 9, 9)}
										</div>
									</div>
								</div>
							))
						) : (
							<div className="flex w-full items-center cursor-pointer group hover:bg-muted-foreground px-2 rounded-md mb-1 py-1">
								{terms.token_not_found}
							</div>
						)
					)}
				</ScrollArea>
			)}
		</div>
	)
}