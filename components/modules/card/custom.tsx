import { ReactNode } from "react"

export default function CardCustom({
	border,
	gradient,
	content,
	className,
} :{
	border?: string
	gradient?: string
	content?: ReactNode
	className?: string
}) {
	return (
		<div className={`${className} backdrop-opacity-15 rounded-2xl grid`}>
			<div className={`${border} z-10 rounded-2xl col-start-1 row-start-1`} />
			<div className={`${gradient} z-50 rounded-2xl col-start-1 row-start-1`}>
				{content}
			</div>
		</div>
	)
}