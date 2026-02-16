import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@fitlife/ui"
import { Input } from "@fitlife/ui"
import { ChevronDown, ChevronUp, Plus, Check, Timer } from "lucide-react"
import { useRestTimer } from "@/context/RestTimerContext"
import { getExerciseGifUrl } from "@/lib/exerciseGifUrls"

interface SetData {
    weight: string
    reps: string
    done: boolean
}

interface ExerciseRowProps {
    exerciseName: string
    muscleGroup: string
    previousData?: { weight: number; reps: number }
    image?: string
    gifUrl?: string
    equipment?: string
    muscleGradient?: string
    targetSets?: number
    targetReps?: string
}

export const ExerciseRow = memo(function ExerciseRow({
    exerciseName,
    muscleGroup,
    previousData,
    image,
    gifUrl,
    equipment,
    muscleGradient,
    targetSets = 3,
    targetReps,
}: ExerciseRowProps) {
    // Use provided gifUrl first, fall back to mapped GIF URL
    const displayGifUrl = gifUrl || getExerciseGifUrl(exerciseName)
    
    const restTimer = useRestTimer()
    const [expanded, setExpanded] = useState(false)
    const [sets, setSets] = useState<SetData[]>(
        Array.from({ length: targetSets }, () => ({ weight: "", reps: "", done: false }))
    )

    const completedSets = sets.filter((s) => s.done).length
    const allDone = completedSets === sets.length && sets.length > 0

    const updateSet = useCallback((index: number, field: keyof SetData, value: string | boolean) => {
        setSets((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
        )
    }, [])

    const markDone = useCallback((index: number) => {
        setSets((prev) =>
            prev.map((s, i) => (i === index ? { ...s, done: !s.done } : s))
        )
    }, [])

    const addSet = useCallback(() => {
        setSets((prev) => [...prev, { weight: "", reps: "", done: false }])
    }, [])

    return (
        <motion.div
            layout
            className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                allDone
                    ? "bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20"
                    : "bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none"
            }`}
        >
            {/* Exercise Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-3 text-left"
            >
                {/* Exercise thumbnail: prefer GIF when available */}
                {(displayGifUrl || image) ? (
                    <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-white/10">
                        <img
                            src={displayGifUrl || image}
                            alt={exerciseName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${muscleGradient || "from-blue-500/20 to-cyan-500/20"} flex items-center justify-center shrink-0`}>
                        <span className="text-xl">🏋️</span>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{exerciseName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-zinc-500">{muscleGroup}</span>
                        {equipment && (
                            <>
                                <span className="text-zinc-300 dark:text-zinc-700 text-[11px]">·</span>
                                <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{equipment}</span>
                            </>
                        )}
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${allDone ? "bg-emerald-500" : "bg-blue-500"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedSets / sets.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                            {completedSets}/{sets.length}
                        </span>
                    </div>
                </div>

                {allDone ? (
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                ) : (
                    <div className="text-zinc-400 dark:text-zinc-500">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                )}
            </button>

            {/* Sets */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 space-y-3">
                            {/* Large GIF demo when expanded - PROMINENT DISPLAY */}
                            {(displayGifUrl || image) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="rounded-xl overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 aspect-video"
                                >
                                    <img
                                        src={displayGifUrl || image}
                                        alt={`${exerciseName} demo`}
                                        className="w-full h-full object-contain p-2"
                                        loading="lazy"
                                    />
                                </motion.div>
                            )}

                            {/* GIF/Image Guide Tips */}
                            {!gifUrl && image && (
                                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                                    <p className="text-[11px] text-amber-700 dark:text-amber-300">
                                        💡 <strong>Tip:</strong> Add a <code className="bg-white/20 px-1 rounded text-[9px] font-mono">gifUrl</code> to show an animated guide
                                    </p>
                                </div>
                            )}

                            {/* Rest timer quick buttons */}
                            {restTimer && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] text-zinc-500 font-medium">Rest:</span>
                                    {[60, 90].map((sec) => (
                                        <Button
                                            key={sec}
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={() => restTimer.startRest(sec)}
                                        >
                                            <Timer className="h-3 w-3 mr-1" />
                                            {sec}s
                                        </Button>
                                    ))}
                                </div>
                            )}
                            {/* Previous best + target */}
                            {previousData && (
                                <div className="flex items-center gap-2 px-0.5 py-1">
                                    <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                                        Previous: {previousData.weight}kg × {previousData.reps}
                                    </span>
                                    {targetReps && (
                                        <>
                                            <span className="text-zinc-300 dark:text-zinc-700">·</span>
                                            <span className="text-[10px] font-medium text-blue-500 dark:text-blue-400">
                                                Target: {targetReps} reps
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Column Headers */}
                            <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium px-0.5">
                                <span>SET</span>
                                <span>KG</span>
                                <span>REPS</span>
                                <span></span>
                            </div>

                            {sets.map((set, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center ${set.done ? "opacity-60" : ""}`}
                                >
                                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 text-center">{i + 1}</span>
                                    <Input
                                        type="number"
                                        placeholder={previousData ? `${previousData.weight}` : "0"}
                                        value={set.weight}
                                        onChange={(e) => updateSet(i, "weight", e.target.value)}
                                        disabled={set.done}
                                        className="h-9 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-center text-sm rounded-lg"
                                    />
                                    <Input
                                        type="number"
                                        placeholder={previousData ? `${previousData.reps}` : "0"}
                                        value={set.reps}
                                        onChange={(e) => updateSet(i, "reps", e.target.value)}
                                        disabled={set.done}
                                        className="h-9 bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-center text-sm rounded-lg"
                                    />
                                    <Button
                                        size="icon"
                                        variant={set.done ? "default" : "outline"}
                                        onClick={() => markDone(i)}
                                        className={`h-9 w-9 rounded-lg transition-all ${set.done
                                            ? "bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600"
                                            : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-700 dark:hover:text-white"
                                        }`}
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                    </Button>
                                </motion.div>
                            ))}

                            <button
                                onClick={addSet}
                                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add Set
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
})
