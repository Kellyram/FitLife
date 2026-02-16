import { motion } from "framer-motion"
import { useUserStore } from "@/store/useUserStore"
import { Utensils, Flame, Activity } from "lucide-react"

export function CalorieCard() {
    const profile = useUserStore((state) => state.profile)
    const tdee = profile.goalCalories || profile.tdee || 2500
    const consumed = 0 // Will increase as user logs meals
    const remaining = tdee - consumed
    const progress = tdee > 0 ? (consumed / tdee) * 100 : 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl bg-card border border-white/5 overflow-hidden"
        >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400" />

            <div className="p-5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-1 text-center">Calories Remaining</h3>
                <p className="text-center text-[10px] text-zinc-500 mb-4">Goal: {tdee} kcal</p>

                <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                        <motion.span
                            className="text-6xl font-extrabold tracking-tighter text-foreground"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {remaining}
                        </motion.span>
                        <p className="text-sm text-zinc-400 font-medium mt-1">kcal</p>
                    </div>

                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>{consumed} eaten</span>
                            <span>{tdee} goal</span>
                        </div>
                        <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-800/80">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full pt-1">
                        <div className="text-center bg-white/[0.03] dark:bg-white/[0.03] rounded-xl py-2.5">
                            <Utensils className="h-3.5 w-3.5 text-cyan-400 mx-auto mb-1" />
                            <p className="text-[10px] text-zinc-500">Eaten</p>
                            <p className="text-sm font-bold text-foreground">{consumed}</p>
                        </div>
                        <div className="text-center bg-white/[0.03] dark:bg-white/[0.03] rounded-xl py-2.5">
                            <Flame className="h-3.5 w-3.5 text-orange-400 mx-auto mb-1" />
                            <p className="text-[10px] text-zinc-500">Burned</p>
                            <p className="text-sm font-bold text-foreground">0</p>
                        </div>
                        <div className="text-center bg-white/[0.03] dark:bg-white/[0.03] rounded-xl py-2.5">
                            <Activity className="h-3.5 w-3.5 text-blue-400 mx-auto mb-1" />
                            <p className="text-[10px] text-zinc-500">Net</p>
                            <p className="text-sm font-bold text-blue-400">{consumed}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
