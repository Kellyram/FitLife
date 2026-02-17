import { motion } from "framer-motion"
import { Trophy, Flame, Dumbbell, Target, Clock, Star, Lock } from "lucide-react"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { WORKOUTS } from "@/data/workouts"

interface AchievementBadge {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    unlocked: boolean
    color: string
    bgColor: string
}

export default function AchievementsPage() {
    const { history } = useWorkoutStore()
    const totalWorkouts = history.length

    // Calculate total exercises completed across all sessions
    const totalExercises = history.reduce((acc, session) => {
        return acc + Object.keys(session.completedExercises).length
    }, 0)

    // Calculate total workout time in minutes
    const totalMinutes = history.reduce((acc, session) => {
        // duration is in ms (Date.now() diff), convert to minutes
        const mins = session.duration > 0 ? Math.round(session.duration / 60000) : 0
        // Fallback: look up the workout's estimated duration
        if (mins === 0) {
            const workout = WORKOUTS.find(w => w.id === session.workoutId)
            return acc + (workout?.duration || 0)
        }
        return acc + mins
    }, 0)

    // Calculate current streak
    const calculateStreak = () => {
        if (history.length === 0) return 0

        // Create a set of dates with workouts
        const workoutDates = new Set<string>()
        history.forEach(session => {
            const date = new Date(session.date)
            workoutDates.add(date.toDateString())
        })

        // Check streak from today going backwards
        let streak = 0
        const currentDate = new Date()

        while (workoutDates.has(currentDate.toDateString())) {
            streak++
            currentDate.setDate(currentDate.getDate() - 1)
        }

        // If no streak today, check if there was a streak ending yesterday
        if (streak === 0) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            while (workoutDates.has(yesterday.toDateString())) {
                streak++
                yesterday.setDate(yesterday.getDate() - 1)
            }
        }

        return streak
    }

    const currentStreak = calculateStreak()
    const hasConsistencyBadge = currentStreak >= 3

    // Check for variety badge: completed at least 3 different workout types
    const uniqueWorkoutTypes = new Set(history.map(s => s.workoutId)).size
    const hasVarietyBadge = uniqueWorkoutTypes >= 3

    const badges: AchievementBadge[] = [
        {
            id: "first-workout",
            title: "First Step",
            description: "Complete your first workout",
            icon: Dumbbell,
            unlocked: totalWorkouts >= 1,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
        },
        {
            id: "five-workouts",
            title: "Getting Started",
            description: "Complete 5 workouts",
            icon: Flame,
            unlocked: totalWorkouts >= 5,
            color: "text-orange-400",
            bgColor: "bg-orange-500/10",
        },
        {
            id: "ten-workouts",
            title: "Committed",
            description: "Complete 10 workouts",
            icon: Target,
            unlocked: totalWorkouts >= 10,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
        },
        {
            id: "twenty-workouts",
            title: "Dedicated",
            description: "Complete 20 workouts",
            icon: Star,
            unlocked: totalWorkouts >= 20,
            color: "text-amber-400",
            bgColor: "bg-amber-500/10",
        },
        {
            id: "fifty-workouts",
            title: "Beast Mode",
            description: "Complete 50 workouts",
            icon: Trophy,
            unlocked: totalWorkouts >= 50,
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
        },
        {
            id: "consistency",
            title: "Consistency King",
            description: "Work out 3 days in a row",
            icon: Clock,
            unlocked: hasConsistencyBadge,
            color: "text-cyan-400",
            bgColor: "bg-cyan-500/10",
        },
        {
            id: "variety",
            title: "Well-Rounded",
            description: "Try 3 different workout routines",
            icon: Target,
            unlocked: hasVarietyBadge,
            color: "text-pink-400",
            bgColor: "bg-pink-500/10",
        },
    ]

    const unlockedCount = badges.filter((b) => b.unlocked).length

    // Get recent workout history with names
    const recentHistory = history.slice(0, 5).map(session => {
        const workout = WORKOUTS.find(w => w.id === session.workoutId)
        return {
            ...session,
            name: workout?.name || "Unknown Workout",
            exerciseCount: workout?.exercises.length || 0,
        }
    })

    return (
        <div className="p-4 lg:p-6 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Achievements</h1>
                        <p className="text-sm text-muted-foreground">
                            {unlockedCount}/{badges.length} unlocked
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(unlockedCount / badges.length) * 100}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className={`rounded-2xl border p-4 text-center transition-colors ${badge.unlocked
                                ? "bg-card border-border"
                                : "bg-card/50 border-border/50 opacity-50"
                                }`}
                        >
                            <div className={`h-12 w-12 rounded-xl ${badge.bgColor} flex items-center justify-center mx-auto mb-2 relative`}>
                                <badge.icon className={`h-5 w-5 ${badge.unlocked ? badge.color : "text-muted-foreground"}`} />
                                {!badge.unlocked && (
                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-muted flex items-center justify-center">
                                        <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-semibold text-foreground">{badge.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <div className="rounded-2xl bg-card border border-border p-4 mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Your Stats</h3>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{totalWorkouts}</p>
                            <p className="text-[10px] text-muted-foreground">Total Workouts</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{totalExercises}</p>
                            <p className="text-[10px] text-muted-foreground">Exercises Done</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{unlockedCount}</p>
                            <p className="text-[10px] text-muted-foreground">Badges Earned</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
                            <p className="text-[10px] text-muted-foreground">Day Streak</p>
                        </div>
                    </div>
                </div>

                {/* Recent Workout History */}
                <div className="rounded-2xl bg-card border border-border p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Recent Workouts</h3>
                    {recentHistory.length === 0 ? (
                        <div className="text-center py-8">
                            <Dumbbell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                            <p className="text-sm text-muted-foreground">No workouts completed yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Start a workout to earn badges!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentHistory.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <Dumbbell className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{session.name}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {new Date(session.date).toLocaleDateString(undefined, {
                                                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">
                                            {Object.keys(session.completedExercises).length}/{session.exerciseCount} exercises
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
