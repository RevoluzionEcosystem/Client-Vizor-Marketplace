export type ParseActionType = "parse" | "clear" | "add" | "remove" | "copy"

export const pushGtagEvent = (event: string, args: any) => {
	if (typeof window !== "undefined" && (window as any).gtag) {
		const { gtag } = window as any
	
		gtag("event", event, args)
	} else {
		if (process.env.NODE_ENV === "development") {
			console.log("gtag('event',", event, args, ")")
		}
	}
}

export const pushGtagParsesActionButton = (action: ParseActionType) => {
	pushGtagEvent("parser", {
		event_category: "action_button",
		event_label: action,
	})
}

export const pushGtagChooseFunction = (fnLabel: string) => {
	pushGtagEvent("choose_func", {
		event_category: "parser",
		event_label: fnLabel,
	})
}

export const pushGtagChooseArgument = (argumentLabel: string) => {
	pushGtagEvent("choose_argument", {
		event_category: "parser",
		event_label: argumentLabel,
	})
}  