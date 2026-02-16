import { memo } from "react"
import { Button } from "@fitlife/ui"
import { Plus, Footprints, Droplets, Moon, Scale } from "lucide-react"
import { motion } from "framer-motion"
import { useUserStore } from "@/store/useUserStore"

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    goal: string
    progress: number
    accentColor: string
    bgColor: string
    barColor: string
    delay: number
}

const StatCard = memo(function StatCard({ icon: Icon, label, value, goal, progress, accentColor, bgColor, barColor, delay }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.03 }}
            className="relative rounded-2xl bg-card border border-white/5 p-4 transition-shadow hover:shadow-lg overflow-hidden"
        >
            {/* Subtle top accent */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${barColor}`} />

            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${bgColor}`}>
                    <Icon className={`h-4 w-4 ${accentColor}`} />
                </div>
                {label === "Water" && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-lg ${bgColor} ${accentColor} hover:opacity-80`}
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </Button>
                )}
            </div>
            <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-[10px] text-zinc-500 mb-2">/ {goal}</p>
            <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: accentColor.includes("blue") ? "#3B82F6" : accentColor.includes("cyan") ? "#22D3EE" : accentColor.includes("teal") ? "#14B8A6" : "#10B981" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: delay + 0.2 }}
                />
            </div>
        </motion.div>
    )
})

export function ActivityGrid() {
    const profile = useUserStore((state) => state.profile)

    // Use profile weight, compute goal weight based on user's goal
    const currentWeight = profile.weight || 70
    const goalWeight = profile.goal === 'lose'
        ? Math.round(currentWeight * 0.9) // target 10% loss
        : profile.goal === 'gain'
            ? Math.round(currentWeight * 1.1) // target 10% gain
            : currentWeight
    const weightProgress = goalWeight > 0
        ? Math.round((currentWeight / goalWeight) * 100)
        : 0

    return (
        <div>
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Daily Tracking</h3>
            <div className="grid grid-cols-2 gap-3">
                <StatCard
                    icon={Footprints}
                    label="Steps"
                    value="0"
                    goal="10,000"
                    progress={0}
                    accentColor="text-blue-400"
                    bgColor="bg-blue-500/10"
                    barColor="bg-gradient-to-r from-blue-500 to-blue-400"
                    delay={0.3}
                />
                <StatCard
                    icon={Droplets}
                    label="Water"
                    value="0L"
                    goal="2.5L"
                    progress={0}
                    accentColor="text-cyan-400"
                    bgColor="bg-cyan-500/10"
                    barColor="bg-gradient-to-r from-cyan-500 to-cyan-400"
                    delay={0.35}
                />
                <StatCard
                    icon={Moon}
                    label="Sleep"
                    value="—"
                    goal="8h"
                    progress={0}
                    accentColor="text-teal-400"
                    bgColor="bg-teal-500/10"
                    barColor="bg-gradient-to-r from-teal-500 to-teal-400"
                    delay={0.4}
                />
                <StatCard
                    icon={Scale}
                    label="Weight"
                    value={`${currentWeight} kg`}
                    goal={`${goalWeight} kg`}
                    progress={weightProgress}
                    accentColor="text-emerald-400"
                    bgColor="bg-emerald-500/10"
                    barColor="bg-gradient-to-r from-emerald-500 to-emerald-400"
                    delay={0.45}
                />
            </div>
        </div>
    )
}
