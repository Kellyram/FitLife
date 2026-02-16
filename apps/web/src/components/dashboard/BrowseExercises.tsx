import { useState, useMemo } from "react"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "strength", label: "Strength" },
    { id: "cardio", label: "Cardio" },
    { id: "full-body", label: "Full Body" },
]

export function BrowseExercises() {
    const exercises = useWorkoutStore((state) => state.exercises)
    const [category, setCategory] = useState("cardio")
    const navigate = useNavigate()

    const filtered = useMemo(() => {
        if (category === "all") return exercises
        return exercises.filter((e) => e.category === category)
    }, [exercises, category])

    const displayList = filtered.slice(0, 4)

    return (
        <div className="rounded-2xl bg-card border border-border p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-foreground mb-3">Browse Exercises</h3>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full max-w-[140px] text-sm rounded-lg bg-muted border border-border px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
                {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.label}
                    </option>
                ))}
            </select>
            <div className="grid grid-cols-2 gap-2 mt-3 flex-1 min-h-0">
                {displayList.map((ex, i) => (
                    <motion.button
                        key={ex.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate("/workout")}
                        className="rounded-xl overflow-hidden border border-border bg-muted/50 hover:bg-muted transition-colors text-left flex flex-col aspect-square"
                    >
                        <div className="flex-1 relative min-h-0">
                            {(ex.gifUrl || ex.imageUrl) ? (
                                <img
                                    src={ex.gifUrl || ex.imageUrl}
                                    alt={ex.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center text-2xl">
                                    🏋️
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] font-medium text-foreground p-1.5 truncate">{ex.name}</p>
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
