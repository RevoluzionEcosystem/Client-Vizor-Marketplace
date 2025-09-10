import { http, createConfig } from "@wagmi/core"
import { mainnet, polygon, bsc } from "@wagmi/core/chains"
import { safe, metaMask, walletConnect, injected, coinbaseWallet } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

export const conf = createConfig({
	chains: [mainnet, polygon, bsc],
	connectors: [
		injected(),
		walletConnect({
			projectId: projectId,
		}),
		coinbaseWallet({
			appName: "Revoluzion Ecosystem",
		}),      
		safe(),
		metaMask({
			dappMetadata: {
				name: "Revoluzion Ecosystem"
			}
		})
	],
	transports: {
		[mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
		[polygon.id]: http("https://polygon-bor-rpc.publicnode.com"),
		[bsc.id]: http("https://bsc-rpc.publicnode.com")
	},
})