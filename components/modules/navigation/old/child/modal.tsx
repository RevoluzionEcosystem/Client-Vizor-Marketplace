"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getNavIcon, useMediaQuery } from "../../../../lib/helpers"

import general from "@/data/lang/en/general";

const terms = general["terms"]

export default function NavChildModal({
	title,
	id,
	link,
	modalTitle,
	modalDescription,
	modalContent,
	pathName,
	className,
	size,
	asChild,
	onClick
}: {
	title
	id
	link
	modalTitle
	modalDescription
	modalContent
	pathName
	className?
	size?
	asChild?,
	onClick?
}) {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery("(min-width: 768px)")
		if (isDesktop) {
		return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button 
					onClick={onClick} 
					className={`${className} group transition-all hover:bg-accent/20 hover:text-accent`} 
					variant={pathName === link ? `secondary` : `ghost`} 
					size={size} 
					asChild={asChild}
				>
					<div className="flex items-center">
						<span className="mr-2 text-accent group-hover:text-accent transition-colors">{getNavIcon(id)}</span> 
						<span className="text-slate-200 group-hover:text-accent transition-colors">{title}</span>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{`${terms.under_development}`}
					</DialogTitle>
					<DialogDescription>
						{`${terms.under_development_description}`}
					</DialogDescription>
				</DialogHeader>
				<Separator />
				{modalContent}
			</DialogContent>
		</Dialog>
		)
	}
		return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button 
					onClick={onClick} 
					className={`${className} group transition-all hover:bg-accent/20 hover:text-slate-200`} 
					variant={pathName === link ? `secondary` : `ghost`} 
					size={size} 
					asChild={asChild}
				>
					<div className="flex items-center">
						<span className="mr-2 text-accent group-hover:text-accent transition-colors">{getNavIcon(id)}</span> 
						<span className="text-slate-200 group-hover:text-accent transition-colors">{title}</span>
					</div>
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>
						{modalTitle}
					</DrawerTitle>
					<DrawerDescription>
						{modalDescription}
					</DrawerDescription>
				</DrawerHeader>
				<Separator />
				{modalContent}
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">
							{`${terms.close}`}
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}