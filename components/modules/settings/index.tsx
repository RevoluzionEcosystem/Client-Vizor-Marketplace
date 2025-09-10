import { Separator } from "@/components/ui/separator"

export function AdvancedSettings({
	icon,
	title,
	children
}: {
	icon: React.ReactNode,
	title: string,
	children: React.ReactNode
}) {
	return (
		<div className="p-1">
			<div className="flex items-center mb-3 text-foreground/80">
				{icon}
				<h3 className="text-md font-semibold">{title}</h3>
			</div>
			<div className="space-y-3">
				{children}
			</div>
			<Separator className="my-4" />
		</div>
	)
}