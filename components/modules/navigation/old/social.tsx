"use client"

import { Separator } from "@/components/ui/separator"

import general from "@/data/lang/en/general";
import { getSocialIcon } from "@/lib/helpers"

const social = general["social"]
const terms = general["terms"]

export default function NavSocial({
	iconClass,
	titleClass,
	separatorClass,
	onClick
}: {
	iconClass?
	titleClass?
	separatorClass?,
	onClick?
}) {	return (
		social.length > 0 && (
			<div className={`p-2 font-bold`}>				<div className={`${titleClass} grid grid-cols-[auto_1fr] font-light items-center gap-2 w-full mr-1 py-0`}>
					<div className="font-bold text-xs flex items-center bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
						{`${terms.social}`}
					</div>
					<Separator className={`${separatorClass} my-auto`} />
				</div>
				<div className={`grid grid-cols-6 gap-1`}>
					{social.map((item, index) => (
						<a 
							target="_blank" 
							href={`${item.link}`} 
							key={index} 
							className={`${iconClass} flex items-center justify-center p-1 text-slate-300 hover:text-accent transition-colors hover:bg-accent/10 rounded-full`} 
							onClick={onClick}
						>
							<div className="relative">
								{getSocialIcon(item.id)}
								<div className="absolute -inset-1 scale-0 bg-accent/10 rounded-full hover:scale-100 transition-transform duration-200"></div>
							</div>
						</a>
					))}
				</div>
			</div>
		)
	)
}