import { useNavigate } from "react-router-dom"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { Button } from "@fitlife/ui"
import { Dumbbell } from "lucide-react"

export function LatestWorkoutCard() {
    const logs = useWorkoutStore((state) => state.logs)
    const navigate = useNavigate()
    const latest = logs.length > 0 ? logs[0] : null

    return (
        <div className="rounded-2xl bg-card border border-border p-4 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-foreground">Latest Workout</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Your most recent session</p>
            {latest ? (
                <div className="mt-3 flex-1">
                    <p className="text-sm text-foreground">
                        {new Date(latest.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                        })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {latest.duration} min · {latest.exercises?.length ?? 0} exercises
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => navigate("/workout")}
                    >
                        Repeat workout
                    </Button>
                </div>
            ) : (
                <div className="mt-3 flex-1 flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground">No workouts yet</p>
                    <Button
                        className="mt-3 bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => navigate("/workout")}
                    >
                        <Dumbbell className="h-4 w-4 mr-2" />
                        Start Your First Workout
                    </Button>
                </div>
            )}
        </div>
    )
}
