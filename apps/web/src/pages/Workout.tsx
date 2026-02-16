import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ExerciseRow } from "@/components/workout/ExerciseRow"
import { ExerciseGuide } from "@/components/workout/ExerciseGuide"
import { RestTimerProvider } from "@/context/RestTimerContext"
import { Button } from "@fitlife/ui"
import { Badge } from "@fitlife/ui"
import { Clock, CheckCircle2, ChevronLeft, Flame, Dumbbell, Target } from "lucide-react"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { useUserStore } from "@/store/useUserStore"
import type { Exercise as SharedExercise, WorkoutLog } from "@fitlife/shared"

// Muscle group visual config (capitalized for display)
const MUSCLE_VISUALS: Record<string, { badge: string; gradient: string; dot: string }> = {
    Chest: { badge: "bg-red-500/10 text-red-500 dark:text-red-400", gradient: "from-red-500/20 to-orange-500/20", dot: "bg-red-500" },
    "Upper Chest": { badge: "bg-rose-500/10 text-rose-500 dark:text-rose-400", gradient: "from-rose-500/20 to-red-500/20", dot: "bg-rose-500" },
    Triceps: { badge: "bg-pink-500/10 text-pink-500 dark:text-pink-400", gradient: "from-pink-500/20 to-purple-500/20", dot: "bg-pink-500" },
    Shoulders: { badge: "bg-amber-500/10 text-amber-500 dark:text-amber-400", gradient: "from-amber-500/20 to-yellow-500/20", dot: "bg-amber-500" },
    Back: { badge: "bg-blue-500/10 text-blue-500 dark:text-blue-400", gradient: "from-blue-500/20 to-indigo-500/20", dot: "bg-blue-500" },
    Biceps: { badge: "bg-violet-500/10 text-violet-500 dark:text-violet-400", gradient: "from-violet-500/20 to-purple-500/20", dot: "bg-violet-500" },
    Quads: { badge: "bg-orange-500/10 text-orange-500 dark:text-orange-400", gradient: "from-orange-500/20 to-red-500/20", dot: "bg-orange-500" },
    Core: { badge: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400", gradient: "from-emerald-500/20 to-green-500/20", dot: "bg-emerald-500" },
    Abs: { badge: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400", gradient: "from-emerald-500/20 to-green-500/20", dot: "bg-emerald-500" },
    "Full-body": { badge: "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400", gradient: "from-cyan-500/20 to-blue-500/20", dot: "bg-cyan-500" },
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

/** Get last performed weight/reps for an exercise from workout logs */
function getPreviousForExercise(logs: WorkoutLog[], exerciseId: string): { weight: number; reps: number } | undefined {
    for (const log of logs) {
        const we = log.exercises?.find((e) => e.exerciseId === exerciseId)
        if (!we?.sets?.length) continue
        const lastSet = we.sets[we.sets.length - 1]
        if (lastSet.weight != null && lastSet.reps != null) {
            return { weight: lastSet.weight, reps: lastSet.reps }
        }
    }
    return undefined
}

/** Map shared Exercise to workout row shape with previous data */
function toWorkoutRow(
    ex: SharedExercise,
    previousData?: { weight: number; reps: number }
): {
    id: string
    name: string
    muscle: string
    equipment: string
    image: string | undefined
    gifUrl: string | undefined
    prev: { weight: number; reps: number } | undefined
    targetSets: number
    targetReps: string
} {
    const muscle = ex.muscleGroups?.[0] ? capitalize(ex.muscleGroups[0]) : "Full-body"
    return {
        id: ex.id,
        name: ex.name,
        muscle,
        equipment: ex.equipment || "—",
        image: ex.imageUrl,
        gifUrl: ex.gifUrl,
        prev: previousData,
        targetSets: 3,
        targetReps: "8-12",
    }
}

// Extracted timer into its own component — prevents re-rendering the entire page every second
function ElapsedTimer() {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => setElapsed((s) => s + 1), 1000)
        return () => clearInterval(interval)
    }, [])

    const mins = Math.floor(elapsed / 60)
    const secs = elapsed % 60

    return (
        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-mono font-medium">
                {mins}:{secs.toString().padStart(2, "0")}
            </span>
        </div>
    )
}

const MuscleFilterButton = memo(function MuscleFilterButton({
    muscle,
    isActive,
    visual,
    onClick,
}: {
    muscle: string
    isActive: boolean
    visual?: { dot: string }
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border whitespace-nowrap transition-all duration-200 ${
                isActive
                    ? "bg-blue-500/15 border-blue-500/40"
                    : "bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10"
            }`}
        >
            {visual && <div className={`w-2 h-2 rounded-full ${visual.dot}`} />}
            <span className={`text-xs font-medium ${isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-600 dark:text-zinc-300"}`}>
                {muscle}
            </span>
        </button>
    )
})

export default function Workout() {
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState("All")

    const exercises = useWorkoutStore((state) => state.exercises)
    const logs = useWorkoutStore((state) => state.logs)
    const profile = useUserStore((state) => state.profile)

    // Build workout list: prefer exercises matching targetMuscles, otherwise all; add previous data from logs
    const workoutRows = useMemo(() => {
        const targetMuscles = profile.targetMuscles ?? []
        let list = exercises
        if (targetMuscles.length > 0) {
            list = [...exercises].sort((a, b) => {
                const aMatch = a.muscleGroups?.some((m) => targetMuscles.includes(m))
                const bMatch = b.muscleGroups?.some((m) => targetMuscles.includes(m))
                if (aMatch && !bMatch) return -1
                if (!aMatch && bMatch) return 1
                return 0
            })
        }
        return list.map((ex) => {
            const prev = getPreviousForExercise(logs, ex.id)
            return toWorkoutRow(ex, prev)
        })
    }, [exercises, logs, profile.targetMuscles])

    const muscleGroups = useMemo(
        () => ["All", ...Array.from(new Set(workoutRows.map((e) => e.muscle)))],
        [workoutRows]
    )

    const filteredExercises = useMemo(
        () => (activeFilter === "All" ? workoutRows : workoutRows.filter((e) => e.muscle === activeFilter)),
        [workoutRows, activeFilter]
    )

    const totalSets = useMemo(() => filteredExercises.reduce((sum, e) => sum + e.targetSets, 0), [filteredExercises])

    // Est. calories from weight * duration approx (personalised)
    const estCalories = useMemo(() => {
        const weight = profile.weight ?? 70
        const duration = 45
        return Math.round(weight * 0.07 * duration) || 320
    }, [profile.weight])

    const workoutTitle = useMemo(() => {
        if (logs.length > 0 && logs[0].exercises?.length) return "Today's Workout"
        if (profile.targetMuscles?.length) return "Suggested Workout"
        return "Full workout"
    }, [logs, profile.targetMuscles])

    const handleFilterClick = useCallback((muscle: string) => setActiveFilter(muscle), [])

    const badges = useMemo(() => {
        const muscles = Array.from(new Set(workoutRows.slice(0, 4).map((e) => e.muscle)))
        return muscles.length ? muscles : ["Full-body"]
    }, [workoutRows])

    return (
        <RestTimerProvider>
        <div className="relative">
            <header className="sticky top-0 z-50 glass border-b border-zinc-200 dark:border-white/10 px-4 py-3">
                <div className="max-w-lg mx-auto lg:max-w-none flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">{workoutTitle}</h1>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                {badges.map((m) => (
                                    <Badge
                                        key={m}
                                        variant="secondary"
                                        className={`${MUSCLE_VISUALS[m]?.badge || "bg-blue-500/10 text-blue-400"} border-0 text-[10px] font-semibold px-1.5 py-0`}
                                    >
                                        {m}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ElapsedTimer />
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl text-xs px-4 h-8 transition-all duration-300 shadow-lg shadow-blue-600/20"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Finish
                        </Button>
                    </div>
                </div>
            </header>

            <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto lg:max-w-none">
                {/* Hero Stats Banner - personalised counts and est. calories */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-500/90 dark:from-blue-600/80 dark:to-cyan-500/80" />
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                        loading="eager"
                    />
                    <div className="relative px-4 py-6">
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                    <Target className="h-3.5 w-3.5 text-white/70" />
                                </div>
                                <p className="text-2xl font-bold text-white">{filteredExercises.length}</p>
                                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wide">Exercises</p>
                            </div>
                            <div className="text-center border-x border-white/20">
                                <div className="flex items-center justify-center mb-1">
                                    <Dumbbell className="h-3.5 w-3.5 text-white/70" />
                                </div>
                                <p className="text-2xl font-bold text-white">{totalSets}</p>
                                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wide">Total Sets</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-1">
                                    <Flame className="h-3.5 w-3.5 text-white/70" />
                                </div>
                                <p className="text-2xl font-bold text-white">~{estCalories}</p>
                                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wide">Est. Cals</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual exercise cards strip - quick browse */}
                {workoutRows.length > 0 && (
                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-white/5">
                        <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Visual workouts</h3>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {workoutRows.slice(0, 6).map((row) => (
                                <button
                                    key={row.id}
                                    onClick={() => setActiveFilter(row.muscle === activeFilter ? "All" : row.muscle)}
                                    className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-muted/50 hover:ring-2 hover:ring-primary/50 transition-all"
                                >
                                    {row.image ? (
                                        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center text-2xl">
                                            🏋️
                                        </div>
                                    )}
                                    <p className="absolute bottom-0 left-0 right-0 text-[9px] font-medium text-foreground truncate px-1 py-0.5 bg-background/90">
                                        {row.name}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Exercise Guides - Prominent GIF Display */}
                {filteredExercises.length > 0 && (
                    <div className="px-4 py-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Exercise Guides</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Follow the movements shown. Click on any exercise below to log your sets.
                                </p>
                            </div>

                            {/* Grid of exercise guides with GIFs */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                {filteredExercises.map((exercise, i) => (
                                    <motion.div
                                        key={exercise.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <ExerciseGuide
                                            name={exercise.name}
                                            gifUrl={exercise.gifUrl}
                                            muscleGroup={exercise.muscle}
                                            reps={exercise.targetReps}
                                            equipment={exercise.equipment}
                                            muscleGradient={MUSCLE_VISUALS[exercise.muscle]?.gradient}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 mb-6">
                                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">📝 How to Add Exercise GIFs</h4>
                                <ol className="text-xs text-blue-600 dark:text-blue-400/80 space-y-1 list-decimal list-inside">
                                    <li>Find or create simple GIF animations of the exercise</li>
                                    <li>Upload the GIF to a hosting service (Imgur, CloudStorage, etc.)</li>
                                    <li>Copy the GIF URL</li>
                                    <li>Update the exercise in Firebase with the <code className="bg-white/20 px-1 rounded text-[10px]">gifUrl</code> field</li>
                                    <li>Refresh the page to see the GIF here</li>
                                </ol>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Muscle Group Filter */}
                <div className="px-4 py-4">
                    <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Muscles Targeted</h3>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {muscleGroups.map((muscle) => (
                            <MuscleFilterButton
                                key={muscle}
                                muscle={muscle}
                                isActive={activeFilter === muscle}
                                visual={MUSCLE_VISUALS[muscle]}
                                onClick={() => handleFilterClick(muscle)}
                            />
                        ))}
                    </div>
                </div>

                {/* Exercise List - personalised with previous data and images */}
                <div className="px-4 pb-8 space-y-3">
                    {filteredExercises.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-600 p-8 text-center">
                            <p className="text-muted-foreground text-sm">No exercises in this filter.</p>
                            <Button variant="outline" size="sm" className="mt-3" onClick={() => setActiveFilter("All")}>
                                Show all
                            </Button>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredExercises.map((exercise, i) => (
                                <motion.div
                                    key={exercise.id}
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                <ExerciseRow
                                    exerciseName={exercise.name}
                                    muscleGroup={exercise.muscle}
                                    previousData={exercise.prev}
                                    image={exercise.gifUrl || exercise.image}
                                    gifUrl={exercise.gifUrl}
                                    equipment={exercise.equipment}
                                    muscleGradient={MUSCLE_VISUALS[exercise.muscle]?.gradient}
                                    targetSets={exercise.targetSets}
                                    targetReps={exercise.targetReps}
                                />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </motion.main>
        </div>
        </RestTimerProvider>
    )
}
