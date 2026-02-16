import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Calendar, Plus, Dumbbell, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@fitlife/ui"
import { useNavigate } from "react-router-dom"
import { useWorkoutStore } from "@/store/useWorkoutStore"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function SchedulePage() {
    const navigate = useNavigate()
    const logs = useWorkoutStore((state) => state.logs)
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

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
            }
        })
    }, [currentWeekOffset])

    const monthLabel = weekDays[0].full.toLocaleDateString(undefined, { month: "long", year: "numeric" })

    const getWorkoutsForDate = (date: Date) => {
        return logs.filter(log => {
            const logDate = new Date(log.date)
            return logDate.toDateString() === date.toDateString()
        })
    }

    const todayWorkouts = selectedDate ? getWorkoutsForDate(selectedDate) : getWorkoutsForDate(
        weekDays.find(d => d.isToday)?.full || new Date()
    )

    const handleDateClick = (date: Date) => {
        setSelectedDate(date)
    }

    return (
        <div className="p-4 lg:p-6 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Schedule</h1>
                        <p className="text-sm text-muted-foreground">Plan your workouts</p>
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
                        const dayWorkouts = getWorkoutsForDate(wd.full)
                        return (
                            <button
                                key={wd.full.toISOString()}
                                onClick={() => handleDateClick(wd.full)}
                                className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-colors ${
                                    selectedDate?.toDateString() === wd.full.toDateString()
                                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                        : wd.isToday
                                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                            : "bg-card border-border text-muted-foreground hover:bg-muted"
                                }`}
                            >
                                <span className="text-[10px] font-medium uppercase">{wd.day}</span>
                                <span className={`text-base font-bold ${selectedDate?.toDateString() === wd.full.toDateString() || wd.isToday ? "text-blue-400" : "text-foreground"}`}>
                                    {wd.date}
                                </span>
                                {dayWorkouts.length > 0 && (
                                    <span className="text-xs bg-blue-500/50 rounded-full px-1.5 py-0.5 text-blue-400">
                                        {dayWorkouts.length}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Today's / Selected Day's Content */}
                <div className="rounded-2xl bg-card border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">
                            {selectedDate
                                ? selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })
                                : "Today"}
                        </h2>
                        <Button
                            size="sm"
                            onClick={() => navigate("/workout")}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Workout
                        </Button>
                    </div>

                    {todayWorkouts.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                            <p className="text-sm text-muted-foreground mb-1">No activities scheduled</p>
                            <p className="text-xs text-muted-foreground mb-4">
                                Create your first workout to get started
                            </p>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                                onClick={() => navigate("/workout")}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Workout
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {todayWorkouts.map((workout) => (
                                <motion.div
                                    key={workout.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Dumbbell className="h-4 w-4 text-blue-400" />
                                                <h3 className="font-semibold text-foreground">
                                                    {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Duration: {workout.duration} minutes
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Calories burned: {workout.caloriesBurned || 0} kcal
                                            </p>
                                            {workout.notes && (
                                                <p className="text-sm text-muted-foreground mt-2 italic">{workout.notes}</p>
                                            )}
                                        </div>
                                        <Button variant="outline" size="sm">View</Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Summary */}
                <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-500/20 p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-3">This Week</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">{weekDays.reduce((acc, wd) => acc + getWorkoutsForDate(wd.full).length, 0)}</p>
                            <p className="text-[10px] text-muted-foreground">Workouts</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-cyan-400">
                                {weekDays.reduce((acc, wd) => acc + getWorkoutsForDate(wd.full).reduce((a, w) => a + w.duration, 0), 0)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Total minutes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">
                                {weekDays.reduce((acc, wd) => acc + (getWorkoutsForDate(wd.full).reduce((a, w) => a + (w.caloriesBurned || 0), 0)), 0)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">Calories</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
