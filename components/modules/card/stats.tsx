import { ReactNode } from "react"

export default function CardStats({
	icon,
	title,
	description,
	className,
	headerClass,
	textClass
} :{
	icon?: ReactNode
	title?: ReactNode
	description?: ReactNode
	className?: string
	headerClass?: string
	textClass?: string
}) {
	return (
		<div className={`${className} bg-cover bg-[url('/assets/images/circuit.png')] backdrop-opacity-15 rounded-2xl grid`}>
			<div className="three-points-gradient-border col-start-1 row-start-1" />
			<div className={`bg-[#000513CF] rounded-2xl col-start-1 row-start-1`}>
				<div className={`p-4 three-points-gradient rounded-2xl`}>
					<div className={`rounded-2xl`}>
						{icon && icon}
						{title ? (
							<h1 className={`${headerClass} font-bold text-3xl py-2`}>
								{title}
							</h1>
						) : (
							<h1 className={`${headerClass} font-bold text-3xl py-2`}>
								Title
							</h1>
						)}
						{description ? (
							<p className={`${textClass}`}>
								{description}
							</p>
						) : (
							<p className={`${textClass}`}>
								Description
							</p>
						)}			
					</div>
				</div>
			</div>
		</div>
	)
}