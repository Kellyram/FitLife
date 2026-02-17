import { useWorkoutStore } from "@/store/useWorkoutStore";
import { WORKOUTS } from "@/data/workouts";
import { ActiveWorkoutView } from "@/components/workouts/ActiveWorkoutView";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Badge } from "@fitlife/ui";
import { Dumbbell, Clock, PlayCircle } from "lucide-react";

export default function WorkoutsPage() {
    const { activeSession, startWorkout } = useWorkoutStore();

    if (activeSession) {
        return <ActiveWorkoutView />;
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">Workout Library</h1>
                <p className="text-muted-foreground text-lg">
                    Science-based routines designed for maximum efficiency and growth.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WORKOUTS.map((workout) => (
                    <Card key={workout.id} className="group hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={
                                    workout.difficulty === 'Beginner' ? 'secondary' :
                                        workout.difficulty === 'Intermediate' ? 'default' : 'destructive'
                                }>
                                    {workout.difficulty}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {workout.duration} min
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl group-hover:text-blue-400 transition-colors">
                                {workout.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                                {workout.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {workout.targetMuscleGroups.map((muscle) => (
                                        <Badge key={muscle} variant="secondary" className="text-xs bg-secondary/50">
                                            {muscle}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Dumbbell className="w-4 h-4" />
                                    {workout.exercises.length} Exercises
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full gap-2 group-hover:bg-blue-600"
                                onClick={() => startWorkout(workout.id)}
                            >
                                <PlayCircle className="w-4 h-4" /> Start Workout
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
