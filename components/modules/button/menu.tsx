"use client"

import { Menu } from "lucide-react"
import { Button } from "../../ui/button"

import general from "@/data/lang/en/general";

const terms = general["terms"]

export default function MenuToggle({
    setOpenSidebar
}) {
    
	return (		
        <Button className={`w-fit justify-start px-2 py-1 xl:hidden`} variant={`secondary`} size={`sm`} onClick={setOpenSidebar}>
            <Menu className={`lg:mr-1`} /> <span className="hidden lg:block">{`${terms.menu}`}</span>
		</Button>
	)
}