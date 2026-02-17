import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Dumbbell, Plus, CheckCircle2, Circle, Trash2 } from "lucide-react"
import { Button, Badge } from "@fitlife/ui"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { useScheduleStore } from "@/store/useScheduleStore"
import { WORKOUTS } from "@/data/workouts"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function SchedulePage() {
    const { history } = useWorkoutStore()
    const { schedule, addActivity, toggleCompletion, deleteActivity } = useScheduleStore()
    const navigate = useNavigate()
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedWorkoutId, setSelectedWorkoutId] = useState("")

    const weekDays = useMemo(() => {
        const today = new Date()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay() + currentWeekOffset * 7)

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek)
            d.setDate(startOfWeek.getDate() + i)
            return {
                day: DAYS[d.getDay()],
                date: d.getDate(),
                month: d.toLocaleDateString(undefined, { month: "short" }),
                isToday: d.toDateString() === today.toDateString(),
                full: d,
                dateKey: d.toISOString().split("T")[0], // YYYY-MM-DD
            }
        })
    }, [currentWeekOffset])

    const monthLabel = weekDays[0].full.toLocaleDateString(undefined, { month: "long", year: "numeric" })

    // Get completed workouts for a given date
    const getCompletedWorkoutsForDate = (date: Date) => {
        return history.filter(session => {
            const sessionDate = new Date(session.date)
            return sessionDate.toDateString() === date.toDateString()
        })
    }

    // Get scheduled activities for a given date
    const getScheduledForDate = (dateKey: string) => {
        return schedule.filter(a => a.date === dateKey)
    }

    const activeDate = selectedDate || weekDays.find(d => d.isToday)?.full || new Date()
    const activeDateKey = activeDate.toISOString().split("T")[0]
    const completedForDate = getCompletedWorkoutsForDate(activeDate)
    const scheduledForDate = getScheduledForDate(activeDateKey)

    const handleScheduleWorkout = () => {
        if (!selectedWorkoutId) return
        const workout = WORKOUTS.find(w => w.id === selectedWorkoutId)
        if (!workout) return

        addActivity({
            id: crypto.randomUUID(),
            date: activeDateKey,
            title: workout.name,
            type: "workout",
            completed: false,
        })

        setShowAddForm(false)
        setSelectedWorkoutId("")
    }

    // Weekly stats
    const weeklyCompleted = weekDays.reduce((acc, wd) => acc + getCompletedWorkoutsForDate(wd.full).length, 0)
    const weeklyScheduled = weekDays.reduce((acc, wd) => acc + getScheduledForDate(wd.dateKey).length, 0)
    const weeklyMinutes = weekDays.reduce((acc, wd) => {
        const sessions = getCompletedWorkoutsForDate(wd.full)
        return acc + sessions.reduce((a, s) => {
            const workout = WORKOUTS.find(w => w.id === s.workoutId)
            return a + (workout?.duration || 0)
        }, 0)
    }, 0)

    return (
        <div className="p-4 lg:p-6 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Schedule</h1>
                        <p className="text-sm text-muted-foreground">Plan and track your workouts</p>
                    </div>
                </div>

                {/* Week Navigator */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setCurrentWeekOffset((o) => o - 1)}
                        className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-foreground">{monthLabel}</span>
                    <button
                        onClick={() => setCurrentWeekOffset((o) => o + 1)}
                        className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Week Days Grid */}
                <div className="grid grid-cols-7 gap-2 mb-6">
                    {weekDays.map((wd) => {
                        const dayCompleted = getCompletedWorkoutsForDate(wd.full).length
                        const dayScheduled = getScheduledForDate(wd.dateKey).length
                        const hasActivity = dayCompleted > 0 || dayScheduled > 0
                        const isSelected = selectedDate?.toDateString() === wd.full.toDateString()

                        return (
                            <button
                                key={wd.full.toISOString()}
                                onClick={() => setSelectedDate(wd.full)}
                                className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-colors ${isSelected
                                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                    : wd.isToday
                                        ? "bg-blue-500/5 border-blue-500/20 text-blue-400"
                                        : "bg-card border-border text-muted-foreground hover:bg-muted"
                                    }`}
                            >
                                <span className="text-[10px] font-medium uppercase">{wd.day}</span>
                                <span className={`text-base font-bold ${isSelected || wd.isToday ? "text-blue-400" : "text-foreground"}`}>
                                    {wd.date}
                                </span>
                                {hasActivity && (
                                    <div className="flex gap-0.5">
                                        {dayCompleted > 0 && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        )}
                                        {dayScheduled > 0 && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        )}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Selected Day Content */}
                <div className="rounded-2xl bg-card border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            {selectedDate
                                ? selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })
                                : "Today"}
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="gap-1"
                        >
                            <Plus className="h-3 w-3" /> Schedule
                        </Button>
                    </div>

                    {/* Add Workout Form */}
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-4 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5"
                        >
                            <p className="text-sm font-medium mb-2 text-foreground">Schedule a workout</p>
                            <div className="flex gap-2">
                                <select
                                    value={selectedWorkoutId}
                                    onChange={(e) => setSelectedWorkoutId(e.target.value)}
                                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                >
                                    <option value="">Select a workout...</option>
                                    {WORKOUTS.map(w => (
                                        <option key={w.id} value={w.id}>{w.name} ({w.duration} min)</option>
                                    ))}
                                </select>
                                <Button size="sm" onClick={handleScheduleWorkout} disabled={!selectedWorkoutId}>
                                    Add
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Scheduled Activities */}
                    {scheduledForDate.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scheduled</p>
                            <div className="space-y-2">
                                {scheduledForDate.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${activity.completed
                                            ? "bg-green-500/5 border-green-500/20"
                                            : "bg-muted/50 border-border"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => toggleCompletion(activity.id)}>
                                                {activity.completed
                                                    ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    : <Circle className="h-5 w-5 text-muted-foreground" />
                                                }
                                            </button>
                                            <div>
                                                <p className={`text-sm font-medium ${activity.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                                    {activity.title}
                                                </p>
                                                <Badge variant="outline" className="text-[10px] mt-1">
                                                    {activity.type}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!activity.completed && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigate("/workouts")}
                                                    className="text-xs"
                                                >
                                                    Start
                                                </Button>
                                            )}
                                            <button
                                                onClick={() => deleteActivity(activity.id)}
                                                className="text-muted-foreground hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Workouts */}
                    {completedForDate.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Completed</p>
                            <div className="space-y-2">
                                {completedForDate.map((session) => {
                                    const workout = WORKOUTS.find(w => w.id === session.workoutId)
                                    return (
                                        <motion.div
                                            key={session.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Dumbbell className="h-3.5 w-3.5 text-blue-400" />
                                                        <h3 className="font-semibold text-sm text-foreground">
                                                            {workout?.name || "Workout"}
                                                        </h3>
                                                    </div>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                                        {workout?.duration || 0} min • {Object.keys(session.completedExercises).length} exercises
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {scheduledForDate.length === 0 && completedForDate.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-sm text-muted-foreground mb-1">No activities for this day</p>
                            <p className="text-xs text-muted-foreground mb-4">
                                Schedule a workout or complete one to see it here
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/workouts")}
                                className="gap-1"
                            >
                                <Dumbbell className="h-3 w-3" /> Go to Workouts
                            </Button>
                        </div>
                    )}
                </div>

                {/* Weekly Stats Summary */}
                <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-500/20 p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">This Week</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">{weeklyCompleted}</p>
                            <p className="text-[10px] text-muted-foreground">Completed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-cyan-400">{weeklyMinutes}</p>
                            <p className="text-[10px] text-muted-foreground">Total min</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">{weeklyScheduled}</p>
                            <p className="text-[10px] text-muted-foreground">Scheduled</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
