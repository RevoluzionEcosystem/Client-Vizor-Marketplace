"use client"

import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

import general from "@/data/lang/en/general"
import CardIcons from "../card/icons"
import { ChartColumnBig, GitCompareArrows, LogOut, Users2 } from "lucide-react"

const menu = general["menu"]

export default function NavSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    return (
        <aside
            className={`grid grid-rows-1 align-middle max-h-[calc(100vh-90px)] lg:grid-rows-[1fr_auto] col-start-1 col-end-2 row-start-2 row-end-3 lg:row-start-1 lg:row-end-2 bottom-0`}
        >
            <div className={`h-full my-auto mx-auto font-bold text-2xl content-center align-middle items-center lg:h-fit flex gap-4 flex-row lg:flex-col`}>
                <div onClick={() => router.push("/")} className="cursor-pointer">
                    <CardIcons
                        className={`w-fit h-fit m-auto text-center border-[1px] ${pathname === "/" ? "text-[#1DBBFF] border-[#1DBBFF] from-[#1DBBFF]/75" : "text-white border-white from-[#000513]/75"} bg-gradient-to-b via-[#000513] to-[#1DBBFF]/75`}
                        icon={(
                            <Users2
                                className={`rounded-full p-[2px]`}
                            />
                        )}
                    />
                </div>
                <div onClick={() => router.push("#")} className="cursor-pointer">
                    <CardIcons
                        className={`w-fit h-fit m-auto text-center border-[1px] ${pathname === "#" ? "text-[#1DBBFF] border-[#1DBBFF] from-[#1DBBFF]/75" : "text-white border-white from-[#000513]/75"} bg-gradient-to-b via-[#000513] to-[#1DBBFF]/75`}
                        icon={(
                            <ChartColumnBig
                                className={`rounded-full p-[2px]`}
                            />
                        )}
                    />
                </div>
                <div onClick={() => router.push("/crosschain-swap")} className="cursor-pointer">
                    <CardIcons
                        className={`w-fit h-fit m-auto text-center border-[1px] ${pathname === "/crosschain-swap" ? "text-[#1DBBFF] border-[#1DBBFF] from-[#1DBBFF]/75" : "text-white border-white from-[#000513]/75"} bg-gradient-to-b via-[#000513] to-[#1DBBFF]/75`}
                        icon={(
                            <GitCompareArrows
                                className={`rounded-full p-[2px]`}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={`hidden lg:block font-bold text-2xl content-center align-middle items-center gap-4`}>
                <div className="cursor-pointer">
                    <CardIcons
                        className={`w-fit h-fit m-auto text-center text-[#000513] border-red-700 bg-gradient-to-b from-red-700/75 via-[#000513] to-red-700/75`}
                        icon={(
                            <LogOut
                                className={`rounded-full p-[2px] bg-red-700`}
                            />
                        )}
                    />
                </div>
            </div>
        </aside>
    )
}