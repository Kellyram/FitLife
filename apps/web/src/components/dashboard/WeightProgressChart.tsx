import { useMemo } from "react"
import { useUserStore } from "@/store/useUserStore"
import { useNavigate } from "react-router-dom"

const WEEKS = 12

export function WeightProgressChart() {
    const profile = useUserStore((state) => state.profile)
    const navigate = useNavigate()

    const { points, minY, maxY } = useMemo(() => {
        const history = profile.weightHistory || []
        const currentWeight = profile.weight ?? 70
        if (history.length === 0) {
            return {
                points: Array.from({ length: WEEKS }, () => currentWeight),
                minY: Math.max(20, currentWeight - 10),
                maxY: Math.min(70, currentWeight + 10),
            }
        }
        const sorted = [...history].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        const weights = sorted.map((h) => h.weight)
        const minW = Math.min(...weights, currentWeight)
        const maxW = Math.max(...weights, currentWeight)
        const minY = Math.max(20, Math.floor(minW / 5) * 5 - 5)
        const maxY = Math.min(70, Math.ceil(maxW / 5) * 5 + 5)
        const weekStep = Math.max(1, Math.floor(WEEKS / Math.max(1, sorted.length)))
        const points: number[] = []
        for (let i = 0; i < WEEKS; i++) {
            const idx = Math.min(Math.floor(i / weekStep), sorted.length - 1)
            points.push(idx >= 0 ? sorted[idx].weight : currentWeight)
        }
        if (points.length > 0 && history.length > 0) points[points.length - 1] = currentWeight
        return { points, minY, maxY }
    }, [profile.weightHistory, profile.weight])

    const range = maxY - minY || 1

    return (
        <div className="rounded-2xl bg-card border border-border p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Weight progress for 3 months (kg)</h3>
                <button
                    onClick={() => navigate("/profile")}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Update weight →
                </button>
            </div>
            <div className="flex-1 min-h-[120px] flex items-end gap-0.5">
                {points.map((w, i) => (
                    <div
                        key={i}
                        className="flex-1 flex flex-col items-center justify-end"
                        style={{ height: "100%" }}
                    >
                        <div
                            className="w-full rounded-t bg-primary/80 min-h-[4px]"
                            style={{
                                height: `${Math.max(4, ((w - minY) / range) * 100)}%`,
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                <span>Week 1</span>
                <span>Week of 3 Months</span>
                <span>Week 12</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Weight (kg)</p>
        </div>
    )
}
