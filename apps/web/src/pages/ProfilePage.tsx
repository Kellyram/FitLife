import { motion } from "framer-motion"
import { User, Ruler, Weight, Cake, Target, Activity } from "lucide-react"
import { Button } from "@fitlife/ui"
import { useUserStore } from "@/store/useUserStore"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { useNavigate } from "react-router-dom"

export default function ProfilePage() {
    const navigate = useNavigate()
    const profile = useUserStore((state) => state.profile)
    const logs = useWorkoutStore((state) => state.logs)

    const totalWorkouts = logs.length
    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0)
    const totalCalories = logs.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0)

    const goalText = profile.goal === "lose"
        ? `Lose weight (Target: ~${Math.round((profile.weight || 70) * 0.9)} kg)`
        : profile.goal === "gain"
            ? `Gain weight (Target: ~${Math.round((profile.weight || 70) * 1.1)} kg)`
            : "Maintain weight"

    return (
        <div className="p-4 lg:p-6 max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Profile</h1>
                        <p className="text-sm text-muted-foreground">Your fitness profile</p>
                    </div>
                </div>

                {/* Profile Header */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20 p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{profile.name || "User"}</h2>
                            <p className="text-sm text-muted-foreground mt-1">Member since onboarding</p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <User className="h-6 w-6 text-blue-400" />
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => navigate("/settings")} variant="outline">
                            Edit Profile
                        </Button>
                    </div>
                </div>

                {/* Body Metrics */}
                <div className="rounded-2xl bg-card border border-border p-6 mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Body Metrics</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-2">
                                <Ruler className="h-4 w-4" />
                                <span className="text-xs">Height</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">{profile.height || 0}</p>
                            <p className="text-xs text-muted-foreground">cm</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-2">
                                <Weight className="h-4 w-4" />
                                <span className="text-xs">Weight</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">{profile.weight || 0}</p>
                            <p className="text-xs text-muted-foreground">kg</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-2">
                                <Cake className="h-4 w-4" />
                                <span className="text-xs">Age</span>
                            </div>
                            <p className="text-lg font-bold text-foreground">{profile.age || 0}</p>
                            <p className="text-xs text-muted-foreground">years</p>
                        </div>
                    </div>
                </div>

                {/* Fitness Goal */}
                <div className="rounded-2xl bg-card border border-border p-6 mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-400" />
                        Fitness Goal
                    </h3>
                    <p className="text-foreground capitalize">{goalText}</p>
                </div>

                {/* Activity Stats */}
                <div className="rounded-2xl bg-card border border-border p-6 mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-400" />
                        Activity Stats
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{totalWorkouts}</p>
                            <p className="text-xs text-muted-foreground">Total Workouts</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{totalDuration}</p>
                            <p className="text-xs text-muted-foreground">Total Minutes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{totalCalories}</p>
                            <p className="text-xs text-muted-foreground">Calories Burned</p>
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="rounded-2xl bg-card border border-border p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Preferences</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Unit System</span>
                            <span className="text-sm font-semibold text-foreground capitalize">{profile.unitSystem || "metric"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Theme</span>
                            <span className="text-sm font-semibold text-foreground capitalize">{profile.theme || "system"}</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => navigate("/settings")}
                    >
                        Edit Preferences
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
