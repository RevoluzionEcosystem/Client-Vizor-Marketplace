import { nFormatter } from '@/lib/helpers';
import { terms } from '../data/swap-data';
import { formatTokenAmount, formatPercentage } from '../utils/format-utils';

export default function OnchainInfo({
    providerInfo,
    gasSymbol
}) {
    const gas = nFormatter(Number(providerInfo["trade"]["gasFeeInfo"]?.gasFeeInEth), 3)
    const price = nFormatter(Number(providerInfo["trade"]["gasFeeInfo"]?.gasFeeInUsd), 3)
    const path = providerInfo["trade"]?.path
    const slippage = providerInfo["trade"]?.slippageTolerance
    const impact = providerInfo["trade"]?.priceImpact
    const decimals = providerInfo["trade"]["to"]?.decimals
    const newAmount = Number(providerInfo["trade"]["to"]?.weiAmount as bigint) / Math.pow(10, Number(decimals))
    
    // Use our formatting utility to correctly format the minimum amount
    const minimum = formatTokenAmount(newAmount * (1 - slippage), 6)
    
    // Format impact as percentage with proper formatting
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
            {providerInfo["trade"].gasFeeInfo && (
                <div className={`w-full grid grid-cols-2 gap-2 px-4 my-2 text-xs`}>
                    <div className="w-full opacity-80 flex justify-start gap-2 items-center">
                        {`${terms.trading_fee}`}
                    </div>
                    <div className={`w-full text-right justify-end items-center flex gap-1`}>
                        {gas} {gasSymbol} ~ ${price}
                    </div>
                </div>
            )}
        </div>
    )
}