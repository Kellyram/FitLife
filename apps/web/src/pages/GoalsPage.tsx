import { motion } from "framer-motion"
import { Target, TrendingDown, TrendingUp, Minus, Flame, Scale, Edit2, Dumbbell } from "lucide-react"
import { useUserStore } from "@/store/useUserStore"
import { Button } from "@fitlife/ui"
import { Dialog } from "@fitlife/ui"
import { Input } from "@fitlife/ui"
import { useState } from "react"

export default function GoalsPage() {
    const profile = useUserStore((state) => state.profile)
    const updateProfile = useUserStore((state) => state.updateProfile)
    const logs: any[] = []
    const [editingGoal, setEditingGoal] = useState<string | null>(null)
    const [editValues, setEditValues] = useState({ weight: profile.weight || 70, dailyCalories: profile.goalCalories || 2500 })

    const currentWeight = profile.weight || 70
    const goalWeight = profile.goal === "lose"
        ? Math.round(currentWeight * 0.9)
        : profile.goal === "gain"
            ? Math.round(currentWeight * 1.1)
            : currentWeight
    const weightDiff = Math.abs(currentWeight - goalWeight)
    const tdee = profile.goalCalories || profile.tdee || 2500
    const totalWorkouts = logs.length

    const GoalIcon = profile.goal === "lose" ? TrendingDown : profile.goal === "gain" ? TrendingUp : Minus

    const goals = [
        {
            title: "Weight Goal",
            icon: Scale,
            current: `${currentWeight} kg`,
            target: `${goalWeight} kg`,
            progress: profile.goal === "lose"
                ? Math.min(100, Math.round(((currentWeight - goalWeight) / (currentWeight * 0.1)) * 100))
                : profile.goal === "gain"
                    ? Math.min(100, Math.round(((currentWeight) / goalWeight) * 100))
                    : 100,
            color: "emerald",
            description: profile.goal === "lose" ? `${weightDiff} kg to lose` : profile.goal === "gain" ? `${weightDiff} kg to gain` : "Maintain current weight",
            id: "weight"
        },
        {
            title: "Daily Calories",
            icon: Flame,
            current: "0 kcal",
            target: `${tdee} kcal`,
            progress: 0,
            color: "orange",
            description: "Track your meals to see progress",
            id: "calories"
        },
        {
            title: "Weekly Workouts",
            icon: Dumbbell,
            current: `${totalWorkouts}`,
            target: "5 sessions",
            progress: Math.min(100, Math.round((totalWorkouts / 5) * 100)),
            color: "blue",
            description: "Aim for 5 workouts per week",
            id: "workouts"
        },
    ]

    const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
        emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", bar: "bg-emerald-500" },
        orange: { bg: "bg-orange-500/10", text: "text-orange-400", bar: "bg-orange-500" },
        blue: { bg: "bg-blue-500/10", text: "text-blue-400", bar: "bg-blue-500" },
    }

    const handleEditGoal = (goalId: string) => {
        setEditingGoal(goalId)
        if (goalId === "weight") {
            setEditValues({ weight: currentWeight, dailyCalories: tdee })
        } else if (goalId === "calories") {
            setEditValues({ weight: currentWeight, dailyCalories: tdee })
        }
    }

    const handleSaveGoal = (goalId: string) => {
        if (goalId === "weight") {
            updateProfile({ weight: editValues.weight })
        } else if (goalId === "calories") {
            updateProfile({ goalCalories: editValues.dailyCalories })
        }
        setEditingGoal(null)
    }

    return (
        <div className="p-4 lg:p-6 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">My Goals</h1>
                        <p className="text-sm text-muted-foreground">Track your fitness progress</p>
                    </div>
                </div>

                {/* Fitness Goal Banner */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20 p-5 mb-6">
                    <div className="flex items-center gap-3">
                        <GoalIcon className="h-6 w-6 text-blue-400" />
                        <div>
                            <p className="text-sm font-semibold text-foreground capitalize">
                                {profile.goal || "Maintain"} Weight
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {currentWeight} kg → {goalWeight} kg
                            </p>
                        </div>
                    </div>
                </div>

                {/* Goal Cards */}
                <div className="space-y-4">
                    {goals.map((goal, i) => {
                        const colors = colorMap[goal.color]
                        return (
                            <motion.div
                                key={goal.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="rounded-2xl bg-card border border-border p-4"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`h-9 w-9 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                                            <goal.icon className={`h-4 w-4 ${colors.text}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{goal.title}</p>
                                            <p className="text-xs text-muted-foreground">{goal.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-muted-foreground">{goal.progress}%</span>
                                        <button
                                            onClick={() => handleEditGoal(goal.id)}
                                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                    <span>{goal.current}</span>
                                    <span>{goal.target}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${colors.bar}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${goal.progress}%` }}
                                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Edit Goal Dialogs */}
                <Dialog open={editingGoal === "weight"} onOpenChange={(open) => setEditingGoal(open ? "weight" : null)}>
                    <div className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Edit Weight Goal</h2>
                        <div>
                            <label className="text-sm text-muted-foreground mb-2 block">Current Weight (kg)</label>
                            <Input
                                type="number"
                                value={editValues.weight}
                                onChange={(e) => setEditValues({ ...editValues, weight: Number(e.target.value) })}
                                className="bg-muted border-border"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setEditingGoal(null)}>Cancel</Button>
                            <Button onClick={() => handleSaveGoal("weight")} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">Save</Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog open={editingGoal === "calories"} onOpenChange={(open) => setEditingGoal(open ? "calories" : null)}>
                    <div className="p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-foreground">Edit Daily Calorie Goal</h2>
                        <div>
                            <label className="text-sm text-muted-foreground mb-2 block">Daily Calorie Target</label>
                            <Input
                                type="number"
                                value={editValues.dailyCalories}
                                onChange={(e) => setEditValues({ ...editValues, dailyCalories: Number(e.target.value) })}
                                className="bg-muted border-border"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setEditingGoal(null)}>Cancel</Button>
                            <Button onClick={() => handleSaveGoal("calories")} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">Save</Button>
                        </div>
                    </div>
                </Dialog>


            </motion.div>
        </div>
    )
}
