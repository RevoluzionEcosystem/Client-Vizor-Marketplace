"use client"

import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

import NavChild from "./child"
import NavChildLevel from "./child/level"

import general from "@/data/lang/en/general";

import NavChildModal from "./child/modal"
import NavSocial from "./social"
import ComingSoon from "../../card/coming-soon"

const menu = general["menu"]
const terms = general["terms"]

export default function NavSidebar({
	openSidebar,
	setOpenSidebar
}) {
	const pathname = usePathname()
	return (     		<aside
			className={`${
				openSidebar ? "translate-x-0" : "-translate-x-60"
			} bg-black/20 backdrop-blur-lg grid grid-rows-[auto_1fr_auto] px-2 fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-52 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-slate-800/50 hover:border-cyan-400/30 overflow-hidden`}
		>
			
			<div className={`p-3 font-bold text-2xl flex items-center gap-3`} onClick={() => openSidebar ? setOpenSidebar(false) : null}>
				<Image 
					src="/assets/images/logo.png" 
					alt="Vizor Logo" 
					width={32} 
					height={32} 
					className="w-8 h-8"
				/>
				<a href="/" className="bg-gradient-to-r from-white to-cyan-500 bg-clip-text text-transparent hover:from-cyan-400 hover:to-cyan-600 transition-colors">
					{`${general.project_title}`}
				</a>
			</div>
			<ScrollArea className="h-full w-full rounded-md">
				{menu.length > 0 && menu.map((item, index) => (
					item.type === "modal" ? (
						<NavChildModal
							key={index}
							id={`${item.id}`}
							title={`${item.title}`}
							link={`${item.link}`}
							pathName={pathname}
							className={`w-full justify-start px-2 py-1`}
							modalTitle={`${terms.under_development}`}
							modalDescription={`${terms.under_development_description}`}
							modalContent={<ComingSoon />}
							onClick={() => openSidebar ? setOpenSidebar(false) : null}
						/>
					) : (
						item.child.length > 0 ? (
							<NavChildLevel
								key={index}
								list={item.child}
								open={item.open}
								title={`${item.title}`}
								link={`${item.link}`}
								size={`sm`}
								pathName={pathname}
								titleClass={`text-xs my-2 text-primary`}
								separatorClass={`bg-accent h-[0.5px]`}
								className={`w-full justify-start px-2 py-1`}
								modalTitle={`${terms.under_development}`}
								modalDescription={`${terms.under_development_description}`}
								modalContent={<ComingSoon />}
								onClick={() => openSidebar ? setOpenSidebar(false) : null}
							/>
						) : (
							<NavChild
								key={index}
								id={`${item.id}`}
								title={`${item.title}`}
								link={`${item.link}`}
								type={`${item.type}`}
								size={`sm`}
								pathName={pathname}
								className={`w-full justify-start px-2 py-1`}
								onClick={() => openSidebar ? setOpenSidebar(false) : null}
							/>
						)
					)
				))}
			</ScrollArea>			<NavSocial
				iconClass={`py-[4px] rounded-md hover:bg-accent/20`}
				titleClass={`text-xs my-2 text-primary`}
				separatorClass={`bg-accent h-[0.5px]`}
				onClick={() => openSidebar ? setOpenSidebar(false) : null}		
			/>
		</aside>
	)
}