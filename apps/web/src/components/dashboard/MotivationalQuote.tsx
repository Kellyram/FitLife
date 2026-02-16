import { Star } from "lucide-react"

export function MotivationalQuote() {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-rose-500/20 border border-orange-500/10 p-4 h-full flex flex-col justify-center">
            <Star className="h-5 w-5 text-amber-400 mb-2" />
            <p className="text-sm font-medium text-foreground italic">
                "If you want something you've never had, you must be willing to do something you've never done."
            </p>
            <p className="text-xs text-muted-foreground mt-2">— Unknown</p>
        </div>
    )
}
