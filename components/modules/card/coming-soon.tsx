import general from "@/data/lang/en/general";

const terms = general["terms"]

export default function ComingSoon({
	className,
	headerClass,
	textClass
} :{
	className?
	headerClass?
	textClass?
}) {
	return (
		<div className={`${className} text-center py-4`}>
			<h1 className={`${headerClass} font-bold text-4xl py-4`}>
				{`${terms.coming_soon}`}
			</h1>
			<p className={`${textClass}`}>
				{`${terms.coming_soon_description}`}
			</p>
		</div>
	)
}