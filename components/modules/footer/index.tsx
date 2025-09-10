"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { 
  Github, 
  Twitter, 
  MessageCircle, 
  ExternalLink, 
  Shield, 
  Zap, 
  Globe,
  ChevronRight,
  Code2,
  Terminal,
  Hexagon
} from "lucide-react"
import { getCommit } from "@/lib/versions"

import general from "@/data/lang/en/general"
import { Button } from "@/components/ui/button"

export default function Footer() {
	const controls = useAnimation()
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1
	})
	const [commitHash, setCommitHash] = useState<string>("loading...")
	const { title, year, version } = getCommit()

	useEffect(() => {
		if (inView) {
			controls.start("visible")
		}

		// Get and set the commit hash on component mount
		const storedHash = typeof window !== 'undefined' && window.localStorage ?
			window.localStorage.getItem("__COMMIT_HASH__") : null;

		if (storedHash && storedHash !== "dev") {
			setCommitHash(storedHash);
			return;
		}

		// Try other methods to get commit hash
		if (typeof window !== 'undefined' && window.__COMMIT_HASH__) {
			setCommitHash(window.__COMMIT_HASH__);
		} else if (process.env.NEXT_PUBLIC_COMMIT_HASH) {
			setCommitHash(process.env.NEXT_PUBLIC_COMMIT_HASH);
		} else if (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA) {
			setCommitHash(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7));
		} else {
			setCommitHash("dev");
		}
	}, [controls, inView]);

	// Format the hash for display
	const displayHash = commitHash && !["dev", "loading...", "prod"].includes(commitHash) && commitHash.length > 7 ?
		commitHash.substring(0, 7) : commitHash;

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	}

	const itemVariants = {
		hidden: { y: 30, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.6 }
		}
	}

	const glowVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 4,
				repeat: Infinity,
				repeatType: "reverse" as const
			}
		}
	}

	return (
		<footer ref={ref} className="relative mt-20 overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent" />
			
			{/* Glowing orbs */}
			<motion.div 
				variants={glowVariants}
				initial="hidden"
				animate={controls}
				className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"
			/>
			<motion.div 
				variants={glowVariants}
				initial="hidden"
				animate={controls}
				className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
				style={{ animationDelay: '2s' }}
			/>

			{/* Grid pattern overlay */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

			<div className="relative z-10 container mx-auto px-6 pt-16 pb-8">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate={controls}
					className="space-y-12"
				>
					{/* Main footer content */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
						{/* Brand section */}
						<motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
							<div className="flex items-center space-x-3">
								<div className="relative">
									<Hexagon className="w-8 h-8 text-cyan-400" />
									<div className="absolute inset-0 w-8 h-8 bg-cyan-400/20 rounded blur-sm" />
								</div>
								<h3 className="text-2xl font-bold font-mono bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
									{general.project_title}
								</h3>
							</div>
							
							<p className="text-slate-300 text-lg leading-relaxed max-w-md">
								Pioneering the future of decentralized governance and blockchain innovation. 
								Built for the next generation of Web3 enthusiasts.
							</p>

							{/* Feature highlights */}
							<div className="space-y-3">
								<div className="flex items-center space-x-3 text-sm text-slate-400">
									<Shield className="w-4 h-4 text-cyan-400" />
									<span>Secure DAO Governance</span>
								</div>
								<div className="flex items-center space-x-3 text-sm text-slate-400">
									<Zap className="w-4 h-4 text-cyan-400" />
									<span>Cross-Chain Compatibility</span>
								</div>
								<div className="flex items-center space-x-3 text-sm text-slate-400">
									<Globe className="w-4 h-4 text-cyan-400" />
									<span>Community Driven</span>
								</div>
							</div>

							{/* Social links */}
							<div className="flex space-x-4 pt-2">
								<Link
									href="https://github.com/RevoluzionEcosystem"
									target="_blank"
									className="group relative p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
								>
									<Github className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
									<div className="absolute inset-0 rounded-lg bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
								</Link>
								<Link
									href="https://twitter.com/VizorDAO"
									target="_blank"
									className="group relative p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
								>
									<Twitter className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
									<div className="absolute inset-0 rounded-lg bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
								</Link>
								<Link
									href={general.footer.community_section.telegram_link}
									target="_blank"
									className="group relative p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300"
								>
									<MessageCircle className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
									<div className="absolute inset-0 rounded-lg bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
								</Link>
							</div>
						</motion.div>

						{/* Navigation links */}
						<motion.div variants={itemVariants} className="lg:col-span-7">
							<div className="grid grid-cols-2 md:grid-cols-3 gap-8">
								{/* Platform */}
								<div className="space-y-4">
									<h4 className="text-white font-semibold font-mono text-sm uppercase tracking-wider flex items-center">
										<Terminal className="w-4 h-4 mr-2 text-cyan-400" />
										Platform
									</h4>
									<ul className="space-y-3">
										{general.footer.product_section.links.map((link, index) => (
											<li key={`platform-${index}`}>
												<Link
													href={link.href}
													className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center group text-sm"
												>
													<ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
													<span>{link.title}</span>
												</Link>
											</li>
										))}
									</ul>
								</div>

								{/* Resources */}
								<div className="space-y-4">
									<h4 className="text-white font-semibold font-mono text-sm uppercase tracking-wider flex items-center">
										<Code2 className="w-4 h-4 mr-2 text-cyan-400" />
										Resources
									</h4>
									<ul className="space-y-3">
										{general.footer.resources_section.links.map((link, index) => (
											<li key={`resource-${index}`}>
												<Link
													href={link.href}
													className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center group text-sm"
													target={link.href.startsWith('http') ? '_blank' : undefined}
												>
													<ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
													<span>{link.title}</span>
													{link.href.startsWith('http') && (
														<ExternalLink className="w-3 h-3 ml-1 opacity-60" />
													)}
												</Link>
											</li>
										))}
									</ul>
								</div>

								{/* Community */}
								<div className="space-y-4 col-span-2 md:col-span-1">
									<h4 className="text-white font-semibold font-mono text-sm uppercase tracking-wider flex items-center">
										<MessageCircle className="w-4 h-4 mr-2 text-cyan-400" />
										Community
									</h4>
									<div className="space-y-4">
										<p className="text-slate-400 text-sm leading-relaxed">
											Join our growing community of developers, validators, and innovators.
										</p>
										<Link
											href={general.footer.community_section.telegram_link}
											target="_blank"
											className="inline-block group"
										>
											<div className="relative">
												<div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 opacity-30 group-hover:opacity-100 blur transition-all duration-300" />
												<Button
													variant="outline"
													size="sm"
													className="relative bg-slate-800/90 border-cyan-400/30 text-cyan-400 hover:bg-slate-700/90 hover:border-cyan-400/50 font-mono"
												>
													<MessageCircle className="w-4 h-4 mr-2" />
													Join Telegram
													<ExternalLink className="w-3 h-3 ml-2" />
												</Button>
											</div>
										</Link>
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Bottom section */}
					<motion.div variants={itemVariants}>
						{/* Separator line */}
						<div className="relative mb-8">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-slate-800/50" />
							</div>
							<div className="relative flex justify-center">
								<div className="px-4 bg-gradient-to-r from-transparent via-slate-900 to-transparent">
									<Hexagon className="w-6 h-6 text-cyan-400/50" />
								</div>
							</div>
						</div>

						{/* Copyright and version info */}
						<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
							<div className="text-slate-500 text-sm font-mono">
								{general.project_copyright}
							</div>
							
							<div className="flex items-center space-x-6 text-sm font-mono text-slate-500">
								<span>
									Built by{" "}
									<Link 
										href={general.developer_link} 
										target="_blank" 
										className="text-cyan-400 hover:text-cyan-300 transition-colors"
									>
										{general.developer_name}
									</Link>
								</span>
								
								<div className="flex items-center space-x-2">
									<span>v{version}</span>
									{displayHash !== "dev" && displayHash !== "loading..." && (
										<Link
											href={`https://github.com/RevoluzionEcosystem/Client-Vizor/commit/${commitHash}`}
											target="_blank"
											className="flex items-center space-x-1 text-slate-600 hover:text-cyan-400 transition-colors"
										>
											<Code2 className="w-3 h-3" />
											<span>{displayHash}</span>
										</Link>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</footer>
	)
}