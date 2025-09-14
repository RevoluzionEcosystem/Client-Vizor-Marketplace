"use client"

import { ReactNode, useState } from "react"
import CardCustom from "./custom"
import { AlertCircle, ChevronRight, DollarSign, List, Loader2, LockKeyhole, Plus } from "lucide-react"
import CardIcons from "./icons"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import SellCarousel from "../carousel/sell"
import BuyCarousel from "../carousel/buy"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"
import { useAppKitAccount } from "@reown/appkit/react"

const header = [
	"Pair",
	"Liquidity",
	"Status",
	"Lock duration",
	"Action"
]

type listing = {
	name: ReactNode
	value: ReactNode
	status: ReactNode
	duration: ReactNode
	action: ReactNode
	price: ReactNode
}

interface CardListingProps {
	listings: listing[]
}

export default function CardListing({ listings }: CardListingProps) {
	const [error, setError] = useState<string | null>(null);
	const [isLoadingProcess, setIsLoadingProcess] = useState(false);
	const [success, setSuccess] = useState(false);
	const { address, isConnected } = useAppKitAccount();

	const handlePurchase = async () => {
		if (!isConnected) {
			setError('Please connect your wallet');
			return;
		}

		setIsLoadingProcess(true);
		setError(null);

		try {
			// Simulate transaction for now - replace with actual contract call
			await new Promise(resolve => setTimeout(resolve, 3000));

			setSuccess(true);

			setTimeout(() => {
				setSuccess(false);
				// onClose();
			}, 3000);

		} catch (err: any) {
			setError(err.message || 'Failed to purchase listing');
		} finally {
			setIsLoadingProcess(false);
		}
	};

	return (
		<CardCustom
			className="min-h-[50vh] rounded-2xl"
			gradient="three-points-gradient-light"
			border="three-points-gradient-border-listing"
			content={(
				<div className={`grid gap-4 py-2`}>
					<div className={`hidden lg:block`}>
						<CardCustom
							className="p-4 pb-2"
							border="three-points-gradient-border-list"
							gradient="border-[1px] border-white/10 rounded-2xl"
							content={(
								<div className={`grid grid-cols-5 gap-4 p-4 rounded-2xl uppercase bg-[#000513] listing-glow-0`}>
									{header.map((item, index) => (
										<h3 key={index} className={`${index === 0 ? "text-left" : "text-center"} text-gray-400 text-sm`}>
											{item}
										</h3>
									))}
								</div>
							)}
						/>
					</div>
					{listings && listings.map((item, index) => (
						<Dialog
							key={`lp-${index}`}
						>
							<DialogTrigger asChild>
								<div className={`cursor-pointer`}>
									<CardCustom
										className="px-4"
										border={`${index % 3 > 0 ? index % 3 > 1 ? `three-points-gradient-border` : `three-points-gradient-border-listing` : `three-points-gradient-border-list`}`}
										gradient={`border-[1px] border-white/10 rounded-2xl`}
										content={(
											<div className={`grid grid-cols-[2fr_1fr] md:grid-cols-[1fr_2fr_1fr] lg:grid-cols-[2fr_2fr_1fr] gap-4 p-4 align-middle rounded-2xl bg-[#000513] ${index % 2 > 0 ? `listing-glow-1` : `listing-glow-2`}`}>
												<div className={`grid lg:grid-cols-2 lg:gap-4 align-middle`}>
													<h3 className={`h-fit font-bold lg:font-normal my-auto text-left text-white`}>
														{item.name}
													</h3>
													<h3 className={`h-fit my-auto text-left lg:text-center text-sm lg:text-base text-white`}>
														{item.value}
													</h3>
												</div>
												<div className={`grid grid-cols-2 col-span-2 md:col-span-1 md:gap-4 align-middle`}>
													<CardCustom
														className={`w-fit p-1 text-sm text-center mx-auto`}
														border={`three-points-gradient-border`}
														gradient="three-points-gradient-light"
														content={(
															<div
																className={`flex align-middle gap-1 py-2 px-3 my-auto`}
															>
																<LockKeyhole
																	className={`text-red-700 w-4 h-4 pt-1`}
																/>
																<p className={`text-white`}>
																	{item.status}
																</p>
															</div>
														)}
													/>
													<CardCustom
														className={`w-fit p-1 text-sm text-center mx-auto`}
														border={`three-points-gradient-border`}
														gradient="three-points-gradient-light"
														content={(
															<div
																className={`flex align-middle gap-1 py-2 px-3 my-auto`}
															>
																<LockKeyhole
																	className={`text-white w-4 h-4 pt-1`}
																/>
																<p className={`text-white`}>
																	{item.duration}
																</p>
															</div>
														)}
													/>
												</div>
												<CardIcons
													className={`w-fit row-start-1 col-start-2 md:col-start-3 h-fit m-auto text-center text-[#000513] border-[1px] border-[#1DBBFF] bg-gradient-to-b from-[#1DBBFF]/75 via-[#000513] to-[#1DBBFF]/75`}
													icon={(
														<ChevronRight
															className={`rounded-full p-[2px] bg-[#1DBBFF]`}
														/>
													)}
												/>
											</div>
										)}
									/>
								</div>
							</DialogTrigger>
							<DialogContent className="max-w-[600px] bg-[#000513]">
								<DialogTitle>
									<CardCustom
										className="rounded-2xl"
										gradient="three-points-gradient-light"
										border="three-points-gradient-border-listing"
										content={(
											<div className="p-4">
												<div className="flex items-center space-x-3">
													<List className="w-6 h-6 text-cyan-400 drop-shadow-sm" />
													<CardTitle className="text-white font-mono text-xl">Live Marketplace Listings</CardTitle>
												</div>
												<p className="text-slate-400 font-mono text-sm">
													Real-time data from BSC Testnet contract
												</p>
											</div>
										)}
									/>
								</DialogTitle>
								<div className="w-full mt-4">
									<BuyCarousel
										slides={[0]}
										listing={item}
										options={{ loop: false }}
									/>
									<div className={`p-4 mt-2`}>
										{error && (
											<div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
												<div className="flex items-center space-x-2">
													<AlertCircle className="w-5 h-5 text-red-400" />
													<p className="text-red-400 font-mono text-sm">{error}</p>
												</div>
											</div>
										)}

										{/* Action Buttons */}
										<div className="flex space-x-3">
											<DialogClose asChild>
												<Button
													variant="outline"
													// disabled={isLoadingProcess}
													className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 font-mono"
												>
													Cancel
												</Button>
											</DialogClose>
											<Button
												onClick={handlePurchase}
												disabled={!isConnected || isLoadingProcess}
												className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono font-bold"
											>
												{isLoadingProcess ? (
													<>
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
														Processing...
													</>
												) : (
													<>
														<DollarSign className="w-4 h-4 mr-2" />
														Buy for {item.price} BNB
													</>
												)}
											</Button>
										</div>

										{!isConnected && (
											<p className="text-center text-slate-400 font-mono text-sm">
												Connect your wallet to purchase
											</p>
										)}
									</div>
								</div>
							</DialogContent>
						</Dialog>
					))}
				</div>
			)}
		/>
	)
}