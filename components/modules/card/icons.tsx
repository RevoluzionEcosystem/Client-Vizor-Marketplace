import { ReactNode } from "react"

export default function CardIcons({
	icon,
	className,
} :{
	icon: ReactNode
	className?: string
}) {
	return (
		<div className={`${className} border-1 rounded-full p-2`}>
			{icon}
		</div>
	)
}