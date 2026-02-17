import { memo, useMemo } from "react"
import { motion } from "framer-motion"
import { useUserStore } from "@/store/useUserStore"
import { useNutritionStore, getToday } from "@/store/useNutritionStore"

interface RingProps {
    label: string
    value: number
    total: number
    color: string
    bgColor: string
    radius: number
    stroke: number
}

const Ring = memo(function Ring({ label, value, total, color, bgColor, radius, stroke }: RingProps) {
    const normalizedRadius = radius - stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const progress = Math.min(value / total, 1)
    const strokeDashoffset = circumference - progress * circumference
    const remaining = Math.max(total - value, 0)

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg]"
                >
                    <circle
                        stroke={bgColor}
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <motion.circle
                        stroke={color}
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-base font-bold text-foreground">{remaining}g</span>
                    <span className="text-[10px] text-zinc-500">left</span>
                </div>
            </div>
            <div className="text-center">
                <span className="text-xs font-semibold text-zinc-300">{label}</span>
                <p className="text-[10px] text-zinc-500">{value}/{total}g</p>
            </div>
        </div>
    )
})

export function MacroRings() {
    const profile = useUserStore((state) => state.profile)
    const { getTotalsForDate } = useNutritionStore()

    const today = getToday()
    const totals = getTotalsForDate(today)

    // Compute personalized macro targets from onboarding data
    const macros = useMemo(() => {
        const weight = profile.weight || 70
        const goalCals = profile.goalCalories || profile.tdee || 2500

        // Protein: 2g per kg body weight
        const proteinTotal = Math.round(weight * 2)
        // Fat: 0.8g per kg body weight
        const fatTotal = Math.round(weight * 0.8)
        // Carbs: remaining calories after protein (4 cal/g) and fat (9 cal/g)
        const carbTotal = Math.round((goalCals - proteinTotal * 4 - fatTotal * 9) / 4)

        return {
            proteinTotal: Math.max(proteinTotal, 0),
            carbTotal: Math.max(carbTotal, 0),
            fatTotal: Math.max(fatTotal, 0),
        }
    }, [profile.weight, profile.goalCalories, profile.tdee])

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl bg-card border border-white/5 overflow-hidden"
        >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400" />

            <div className="p-5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-4">Today's Macros</h3>
                <div className="flex justify-around">
                    <Ring
                        label="Protein"
                        value={totals.protein}
                        total={macros.proteinTotal}
                        color="#3B82F6"
                        bgColor="rgba(59,130,246,0.12)"
                        radius={48}
                        stroke={5}
                    />
                    <Ring
                        label="Carbs"
                        value={totals.carbs}
                        total={macros.carbTotal}
                        color="#22D3EE"
                        bgColor="rgba(34,211,238,0.12)"
                        radius={48}
                        stroke={5}
                    />
                    <Ring
                        label="Fats"
                        value={totals.fats}
                        total={macros.fatTotal}
                        color="#14B8A6"
                        bgColor="rgba(20,184,166,0.12)"
                        radius={48}
                        stroke={5}
                    />
                </div>
            </div>
        </motion.div>
    )
}
