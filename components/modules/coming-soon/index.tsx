import { Button } from "../../ui/button"
import { Clock } from "lucide-react"


export default function ComingSoon() {
    return (
        <div className="absolute bg-black-90 inset-0 backdrop-blur-md flex justify-center items-start pt-20 z-50 rounded-lg">
            <div className="bg-slate-950/95 border border-slate-500/30 rounded-lg p-8 max-w-md text-center">
                <div className="text-slate-500 mb-2">
                    <Clock className="h-12 w-12 mx-auto" />
                </div>
                <h2 className="text-slate-300 text-xl font-bold mb-2">
                    Under Development
                </h2>
                <p className="text-slate-400 mb-6">
                    This section is currently under development. Please check back later.
                </p>
                <Button variant="outline" onClick={() => window.location.href = "/"} className="border-slate-500/30 hover:bg-amber-500/20">
                    Back to Home
                </Button>
            </div>
        </div>
    )
}