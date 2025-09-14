"use client"

import { EmblaOptionsType } from 'embla-carousel'
// import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
	PrevButton,
	NextButton,
	usePrevNextButtons
} from './arrows'
import useEmblaCarousel from 'embla-carousel-react'
import { FC, useEffect, useState, FormEvent, ReactNode } from 'react'
import CardCustom from '../card/custom'
import Image from 'next/image'
import img1 from "@/public/assets/images/progress-1.png"
import img2 from "@/public/assets/images/progress-2.png"
import img3 from "@/public/assets/images/progress-3.png"
import { useAppKitAccount } from '@reown/appkit/react';

import { Plus, Loader2, CheckCircle2, AlertCircle, ExternalLink, User, Calendar, Shield, Link, Timer, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useMarketplaceWrite } from '../view/marketplace/hooks/use-marketplace-write'
import { Badge } from '@/components/ui/badge'
import { formatEther } from 'viem'
import { getStatusText, getStatusColor } from '../view/marketplace/abi/marketplace-abi'

type PropType = {
	slides: number[] | any[]
	listing?: any
	options?: EmblaOptionsType
}

const BuyCarousel: FC<PropType> = (props) => {
	const { slides, options, listing } = props
	const [emblaRef, emblaApi] = useEmblaCarousel(options)
	const [index, setIndex] = useState(0)

	const formatTimestamp = (timestamp: bigint) => {
        if (timestamp === BigInt(0)) return 'Not set';
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

	// const isAvailable = listing.status === 0;
    const hasTransferProof = listing.transferProofHash && listing.transferProofHash !== '';

	const { 
		createListing, 
		isLoading, 
		isConfirming, 
		isConfirmed, 
		error: contractError,
		hash,
		clearError
	} = useMarketplaceWrite();
	
	const [formData, setFormData] = useState({
		price: '',
		tokenAddress: '',
		lpAddress: '',
		lockUrl: '',
		contactMethod: '',
		tokenPair: ''
	});

	// Reset form when transaction is confirmed
	useEffect(() => {
		if (isConfirmed) {
			setFormData({
				price: '',
				tokenAddress: '',
				lpAddress: '',
				lockUrl: '',
				contactMethod: '',
				tokenPair: ''
			});
			toast.success("Your LP position has been listed successfully!");
		}
	}, [isConfirmed, toast]);

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick
	} = usePrevNextButtons(emblaApi)

	const prev = () => {
		if (!prevBtnDisabled) {
			setIndex(index - 1);
		}
		onPrevButtonClick()
	}

	const next = () => {
		if (!nextBtnDisabled) {
			setIndex(index + 1);
		}
		onNextButtonClick()
	}

	return (
		<section className="embla">
			<div className="embla__viewport" ref={emblaRef}>

					{/* Form */}
					<div className="embla__container">
						<div className="embla__slide__full">
								<CardCustom
									key={index}
									className="h-full rounded-2xl"
									gradient="bg-[#000513]"
									border="three-points-gradient-border-listing"
									content={(
										<div className="flex flex-col p-4 gap-4">
											{/* Price and Status Header */}
											<div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-cyan-400/20">
												<div>
													<p className="text-slate-400 font-mono text-xs mb-1">Listing Price</p>
													<p className="text-cyan-400 font-bold font-mono text-2xl">
														{listing.price ? formatEther(listing.price) : '0'} BNB
													</p>
												</div>
												<div className="text-right">
													<p className="text-slate-400 font-mono text-xs mb-1">Status</p>
													<Badge className={`${getStatusColor(listing.status)} font-mono`}>
														{getStatusText(listing.status)}
													</Badge>
												</div>
											</div>

											{/* Listing ID */}
											<div className="flex items-center justify-between">
												<span className="text-slate-400 font-mono text-sm">Listing ID:</span>
												<span className="text-cyan-400 font-mono text-sm font-bold">#{listing.id?.toString()}</span>
											</div>

											{/* Seller and Buyer Info */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												<div className="flex items-center space-x-2">
													<User className="w-4 h-4 text-slate-400" />
													<div>
														<p className="text-slate-400 font-mono text-xs">Seller</p>
														<p className="text-white font-mono text-sm">
															{listing.seller && listing.seller.slice(0, 8)}...{listing.seller && listing.seller.slice(-6)}
														</p>
													</div>
												</div>
												
												{listing.buyer !== '0x0000000000000000000000000000000000000000' && (
													<div className="flex items-center space-x-2">
														<User className="w-4 h-4 text-slate-400" />
														<div>
															<p className="text-slate-400 font-mono text-xs">Buyer</p>
															<p className="text-white font-mono text-sm">
																{listing.buyer && listing.buyer.slice(0, 8)}...{listing.buyer && listing.buyer.slice(-6)}
															</p>
														</div>
													</div>
												)}
											</div>

											{/* Token Addresses */}
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-slate-400 font-mono text-sm">Token Address:</span>
													<a 
														href={`https://testnet.bscscan.com/address/${listing.tokenAddress}`}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-mono text-sm"
													>
														<span>{listing.tokenAddress && listing.tokenAddress.slice(0, 8)}...{listing.tokenAddress && listing.tokenAddress.slice(-6)}</span>
														<ExternalLink className="w-3 h-3" />
													</a>
												</div>
												
												<div className="flex items-center justify-between">
													<span className="text-slate-400 font-mono text-sm">LP Address:</span>
													<a 
														href={`https://testnet.bscscan.com/address/${listing.lpAddress}`}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-mono text-sm"
													>
														<span>{listing.lpAddress && listing.lpAddress.slice(0, 8)}...{listing.lpAddress && listing.lpAddress.slice(-6)}</span>
														<ExternalLink className="w-3 h-3" />
													</a>
												</div>
											</div>

											{/* Timestamps */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												<div className="flex items-center space-x-2">
													<Calendar className="w-4 h-4 text-slate-400" />
													<div>
														<p className="text-slate-400 font-mono text-xs">Created</p>
														<p className="text-white font-mono text-sm">
															{formatTimestamp(listing.createdAt)}
														</p>
													</div>
												</div>
												
												<div className="flex items-center space-x-2">
													<User className="w-4 h-4 text-slate-400" />
													<div>
														<p className="text-slate-400 font-mono text-xs">Contact Method</p>
														<p className="text-white font-mono text-sm">
															{listing.contactMethod || 'Not provided'}
														</p>
													</div>
												</div>
											</div>

											{/* Chain Info - BSC Testnet */}
											<div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
												<div className="flex items-center space-x-2">
													<Shield className="w-4 h-4 text-blue-400" />
													<span className="text-blue-400 font-mono text-sm">
														BSC Testnet
													</span>
												</div>
												<Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30 font-mono text-xs">
													Chain 97
												</Badge>
											</div>

											{/* Lock URL */}
											{listing.lockUrl && (
												<div className="flex items-center justify-between p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
													<div className="flex items-center space-x-2">
														<Link className="w-4 h-4 text-amber-400" />
														<span className="text-amber-400 font-mono text-sm">Lock Details</span>
													</div>
													<a 
														href={listing.lockUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-mono text-sm"
													>
														<span>View Lock</span>
														<ExternalLink className="w-4 h-4" />
													</a>
												</div>
											)}

											{/* Transfer Proof (if exists) */}
											{hasTransferProof && (
												<div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
													<div className="flex items-center space-x-2 mb-2">
														<Shield className="w-4 h-4 text-green-400" />
														<span className="text-green-400 font-mono text-sm">Transfer Proof Submitted</span>
													</div>
													<p className="text-green-300 font-mono text-xs break-all">
														{listing.transferProofHash}
													</p>
												</div>
											)}

											{/* Purchase Timestamp (if sold) */}
											{listing.purchaseTimestamp > 0 && (
												<div className="flex items-center space-x-2">
													<Timer className="w-4 h-4 text-yellow-400" />
													<div>
														<p className="text-slate-400 font-mono text-xs">Purchased</p>
														<p className="text-yellow-400 font-mono text-sm">
															{formatTimestamp(listing.purchaseTimestamp)}
														</p>
													</div>
												</div>
											)}

											{/* Purchase Action */}
											<div className="border-t border-slate-700/50 pt-4 mt-4">
												{listing.status === 0 ? (
													<Button 
														className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold font-mono py-3"
														onClick={() => {
															// TODO: Implement purchase logic
															toast.info('Purchase functionality coming soon!');
														}}
													>
														<DollarSign className="w-5 h-5 mr-2" />
														Purchase for {listing.price ? formatEther(listing.price) : '0'} BNB
													</Button>
												) : listing.status === 1 ? (
													<Button 
														className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold font-mono py-3"
														disabled
													>
														<Timer className="w-5 h-5 mr-2" />
														In Escrow
													</Button>
												) : listing.status === 3 ? (
													<Button 
														className="w-full bg-green-600 text-white font-bold font-mono py-3"
														disabled
													>
														<CheckCircle2 className="w-5 h-5 mr-2" />
														Completed
													</Button>
												) : (
													<Button 
														className="w-full bg-slate-600 text-slate-300 font-bold font-mono py-3"
														disabled
													>
														Not Available
													</Button>
												)}
											</div>

										</div>
									)}
								/>
						</div>
				</div>
			</div>

			{/* <div className="embla__controls">

				<div className="embla__dots">
					{index > 0 ? (
						index > 1 ? (
							<Image
								width={img3.width / 4}
								height={img3.height / 4}
								src={img3.src}
								alt={`Vizor Progress`}
								className={`w-full h-auto ml-auto transition duration-300 ease-in-out`}
							/>
						) : (
							<Image
								width={img2.width / 4}
								height={img2.height / 4}
								src={img2.src}
								alt={`Vizor Progress`}
								className={`w-full h-auto ml-auto transition duration-300 ease-in-out`}
							/>
						)
					) : (
						<Image
							width={img1.width / 4}
							height={img1.height / 4}
							src={img1.src}
							alt={`Vizor Progress`}
							className={`w-full h-auto ml-auto transition duration-300 ease-in-out`}
						/>
					)}
				</div>

				<div className="embla__buttons">
					<PrevButton onClick={prev} disabled={prevBtnDisabled} />
					<NextButton onClick={next} disabled={nextBtnDisabled} />
				</div>
			</div> */}
		</section>
	)
}

export default BuyCarousel
