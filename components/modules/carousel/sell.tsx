"use client"

import { EmblaOptionsType } from 'embla-carousel'
// import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
	PrevButton,
	NextButton,
	usePrevNextButtons
} from './arrows'
import useEmblaCarousel from 'embla-carousel-react'
import { FC, useEffect, useState, FormEvent } from 'react'
import CardCustom from '../card/custom'
import Image from 'next/image'
import img1 from "@/public/assets/images/progress-1.png"
import img2 from "@/public/assets/images/progress-2.png"
import img3 from "@/public/assets/images/progress-3.png"
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';

import { Plus, Loader2, CheckCircle2, AlertCircle, ExternalLink, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useMarketplaceWrite } from '../view/marketplace/hooks/use-marketplace-write'

type PropType = {
	slides: number[]
	options?: EmblaOptionsType
}

const SellCarousel: FC<PropType> = (props) => {
	const { slides, options } = props
	const [emblaRef, emblaApi] = useEmblaCarousel(options)
	const [index, setIndex] = useState(0)
	const { address, isConnected } = useAppKitAccount();
	const { open } = useAppKit();


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

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (contractError) clearError();
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		
		if (!isConnected) {
			toast.error("Please connect your wallet to create a listing");
			return;
		}

		// Basic validation
		if (!formData.price || !formData.tokenAddress || !formData.lpAddress || !formData.lockUrl || !formData.contactMethod) {
			toast.error("Please fill in all required fields");
			return;
		}

		try {
			await createListing(
				formData.price,
				formData.tokenAddress,
				formData.lpAddress,
				formData.lockUrl,
				formData.contactMethod
			);

			// Don't show success toast here - let the transaction state handle it
		} catch (err: any) {
			// Error is already handled in the hook, but we can add additional handling if needed
			console.error('Create listing error:', err);
		}
	};

	// Show success toast when transaction is submitted (hash available)
	useEffect(() => {
		if (hash && !isConfirming && !isConfirmed) {
			toast.success("Your listing transaction has been submitted!", {
				description: "Please wait for confirmation..."
			});
		}
	}, [hash, isConfirming, isConfirmed]);

	// Show error toast when there's a contract error
	useEffect(() => {
		if (contractError) {
			toast.error("Failed to create listing", {
				description: contractError
			});
		}
	}, [contractError]);

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
		<div className="relative">
			<section className="embla">
				<div className="embla__viewport" ref={emblaRef}>
				{/* <div className="embla__container"> */}

					{/* Form */}
					<form onSubmit={handleSubmit} className="embla__container">{/* ...existing code... */}
						{slides.map((index) => (
							<div className="embla__slide" key={index}>
								<CardCustom
									key={index}
									className="h-full rounded-2xl"
									gradient="bg-[#000513]"
									border="three-points-gradient-border-listing"
									content={(
										index === 0 ? (
												<div className="flex flex-col p-4 gap-4">
														{/* Price */}
														<div>
															<Label className="text-cyan-100 text-sm font-medium">Price (BNB) *</Label>
															<Input
																type="number"
																step="0.001"
																placeholder="1.5"
																value={formData.price}
																onChange={(e) => handleInputChange('price', e.target.value)}
																className="bg-slate-800/60 border-slate-600/60 text-white focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
																disabled={isLoading || isConfirming}
															/>
														</div>
									
														{/* Token Pair */}
														<div>
															<Label className="text-cyan-100 text-sm font-medium">Token Pair</Label>
															<Input
																placeholder="BNB/USDT"
																value={formData.tokenPair}
																onChange={(e) => handleInputChange('tokenPair', e.target.value)}
																className="bg-slate-800/60 border-slate-600/60 text-white focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
																disabled={isLoading || isConfirming}
															/>
														</div>
									
														{/* Token Address */}
														<div>
															<Label className="text-cyan-100 text-sm font-medium">Token Address *</Label>
															<Input
																placeholder="0x..."
																value={formData.tokenAddress}
																onChange={(e) => handleInputChange('tokenAddress', e.target.value)}
																className="bg-slate-800/60 border-slate-600/60 text-white focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
																disabled={isLoading || isConfirming}
															/>
														</div>
									
														{/* LP Address */}
														<div>
															<Label className="text-cyan-100 text-sm font-medium">LP Token Address *</Label>
															<Input
																placeholder="0x..."
																value={formData.lpAddress}
																onChange={(e) => handleInputChange('lpAddress', e.target.value)}
																className="bg-slate-800/60 border-slate-600/60 text-white focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
																disabled={isLoading || isConfirming}
															/>
														</div>
												</div>
										) : (
											index === 1 ? (
													<div className="flex flex-col p-4 gap-4">
													{/* Lock URL */}
													<div>
														<Label className="text-cyan-100 text-sm font-medium">Lock URL *</Label>
														<Input
															placeholder="https://app.uncx.network/services/pancakeswap-liquidity-locks/..."
															value={formData.lockUrl}
															onChange={(e) => handleInputChange('lockUrl', e.target.value)}
															className="bg-slate-800/60 border-slate-600/60 text-white focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
															disabled={isLoading || isConfirming}
														/>
														<p className="text-slate-400 text-xs">
															Link to your locked LP position on UNCX or similar platform
														</p>
													</div>
								
													{/* Contact Method */}
													<div>
														<Label className="text-cyan-100 text-sm font-medium">Contact Method *</Label>
														<Input
															type="text"
															placeholder="e.g., Telegram: @username, Discord: username#1234, Email: contact@email.com"
															value={formData.contactMethod}
															onChange={(e) => handleInputChange('contactMethod', e.target.value)}
															className="bg-slate-800/60 border-slate-600/60 text-white focus:border-cyan-400/60 focus:ring-cyan-400/20 shadow-sm"
															disabled={isLoading || isConfirming}
														/>
														<p className="text-slate-400 text-xs">
															How buyers can contact you to coordinate the LP token transfer
														</p>
													</div>
												</div>
											) : (
												<div className="flex flex-col p-4 gap-4">
													{/* Listing Fee Info */}
													<div className="p-4 bg-blue-900/30 border border-cyan-500/40 rounded-lg shadow-lg shadow-cyan-500/10">
														<div className="flex items-center space-x-3">
															<AlertCircle className="w-5 h-5 text-cyan-400 drop-shadow-sm" />
															<div>
																<p className="text-cyan-300 text-sm font-bold">
																	Listing Fee: 0.01 BNB
																</p>
																<p className="text-cyan-200/80 text-xs">
																	One-time fee to create your listing on the marketplace
																</p>
															</div>
														</div>
													</div>
								
													{/* Submit Button */}
													<Button
														type="submit"
														disabled={!isConnected || isLoading || isConfirming}
														className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 shadow-lg shadow-cyan-500/25 border border-cyan-500/30 transition-all duration-200"
													>
														{isLoading ? (
															<div className="flex items-center space-x-2">
																<Loader2 className="w-4 h-4 animate-spin" />
																<span>Creating Listing...</span>
															</div>
														) : isConfirming ? (
															<div className="flex items-center space-x-2">
																<Loader2 className="w-4 h-4 animate-spin" />
																<span>Confirming Transaction...</span>
															</div>
														) : (
															'Create Listing'
														)}
													</Button>
												</div>
											)
										)
									)}
								/>
							</div>
						))}
					</form>
				{/* </div> */}
			</div>

			<div className="embla__controls">

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
			</div>
		</section>

		{/* Wallet Connection Overlay */}
		{!isConnected && (
			<div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
				<div className="text-center p-8 bg-slate-900/90 border border-slate-700/50 rounded-xl shadow-2xl shadow-cyan-500/10 max-w-md mx-4">
					<div className="mb-6">
						<div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<Wallet className="w-8 h-8 text-cyan-400" />
						</div>
						<h3 className="text-white font-mono text-xl font-bold mb-2">
							Connect Your Wallet
						</h3>
						<p className="text-slate-400 font-mono text-sm">
							You need to connect your wallet to create a listing on the marketplace
						</p>
					</div>
					<Button
						onClick={() => open()}
						className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-mono py-3 shadow-lg shadow-cyan-500/25 border border-cyan-500/30 transition-all duration-200"
					>
						<Wallet className="w-4 h-4 mr-2" />
						Connect Wallet
					</Button>
				</div>
			</div>
		)}
	</div>
	)
}

export default SellCarousel
