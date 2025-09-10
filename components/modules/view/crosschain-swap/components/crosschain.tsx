import { nFormatter } from "@/lib/helpers" // Fixed import path
import { terms } from "../data/swap-data"
import { formatTokenAmount, formatPercentage } from '../utils/format-utils';

export default function CrosschainInfo({
	providerInfo,
	gasSymbol
}) {
	const gas = nFormatter(Number(providerInfo["gasFeeInfo"]?.gasFeeInEth), 3)
	const price = nFormatter(Number(providerInfo["gasFeeInfo"]?.gasFeeInUsd), 3)
	const slippage = providerInfo?.slippage
	const impact = providerInfo?.priceImpact
	const decimals = providerInfo["to"]?.decimals
	
	// Safer way to handle bigint conversion to avoid precision loss
	const weiAmount = providerInfo["to"]?.weiAmount
	let newAmount = 0
	if (weiAmount) {
		if (typeof weiAmount === 'bigint') {
			// Convert to string first to preserve precision
			const weiAmountStr = weiAmount.toString()
			// For small enough numbers, we can convert directly
			if (weiAmountStr.length < 15) {
				newAmount = Number(weiAmount) / Math.pow(10, Number(decimals))
			} else {
				// Handle very large numbers
				const wholePartLength = weiAmountStr.length - Number(decimals)
				if (wholePartLength > 0) {
					const wholePart = weiAmountStr.substring(0, wholePartLength)
					const decimalPart = weiAmountStr.substring(wholePartLength)
					newAmount = parseFloat(`${wholePart}.${decimalPart}`)
				} else {
					// Handle very small numbers
					newAmount = parseFloat(`0.${'0'.repeat(Math.abs(wholePartLength))}${weiAmountStr}`)
				}
			}
		} else {
			// Handle if it's not a bigint
			newAmount = Number(weiAmount) / Math.pow(10, Number(decimals))
		}
	}
	
	// Use our formatting utilities for consistent output
	const minimum = formatTokenAmount(newAmount * (1 - slippage), 6)
	const formattedImpact = formatPercentage(impact)

	return (
		<div className={`rounded-lg py-2 gradient-header m-4 mb-0 border border-primary`}>
			<div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
				<div className="w-full opacity-80 flex justify-start gap-2 items-center">
					{`${terms.minimum_received}`}
				</div>
				<div className={`w-full text-right justify-end items-center flex gap-2`}>
					{minimum}
				</div>
			</div>
			<div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
				<div className="w-full opacity-80 flex justify-start gap-2 items-center">
					{`${terms.price_impact}`}
				</div>
				<div className={`w-full text-right justify-end items-center flex gap-2`}>
					{formattedImpact}
				</div>
			</div>
			{providerInfo["gasFeeInfo"] && (
				<div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
					<div className="w-full opacity-80 flex justify-start gap-2 items-center">
						{terms.trading_fee}
					</div>
					<div className={`w-full text-right justify-end items-center flex gap-1`}>
						{gas} {gasSymbol} ~ ${price}
					</div>
				</div>
			)}
		</div>
	)
}