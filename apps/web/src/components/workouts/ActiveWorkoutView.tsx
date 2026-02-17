import { useState, useEffect } from "react";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { WORKOUTS } from "@/data/workouts";
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Progress, Badge } from "@fitlife/ui";
import { ChevronLeft, ChevronRight, Timer, AlertCircle } from "lucide-react";

export function ActiveWorkoutView() {
    const { activeSession, completeSet, finishWorkout, cancelWorkout } = useWorkoutStore();
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timer, setTimer] = useState<number | null>(null);

    // ── Hooks MUST be called before any early returns ──
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (timer !== null && timer > 0) {
            interval = setInterval(() => setTimer((t) => (t ? t - 1 : 0)), 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

    // ── Early returns AFTER all hooks ──
    if (!activeSession) return null;

    const workout = WORKOUTS.find((w) => w.id === activeSession.workoutId);

    if (!workout) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <p className="text-red-500 font-bold">Error: Workout data not found for ID: {activeSession.workoutId}</p>
                <Button onClick={cancelWorkout} variant="destructive">Reset Workout State</Button>
            </div>
        );
    }

    const currentExercise = workout.exercises[currentExerciseIndex];
    const completedSets = activeSession.completedExercises[currentExercise.id] || [];

    const handleSetToggle = (setIndex: number) => {
        const isCompleted = !completedSets[setIndex];
        completeSet(currentExercise.id, setIndex, isCompleted);

        // Auto-start rest timer if completing a set
        if (isCompleted && currentExercise.rest > 0) {
            setTimer(currentExercise.rest);
        }
    };

    const nextExercise = () => {
        if (currentExerciseIndex < workout.exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setTimer(null);
        }
    };

    const prevExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(currentExerciseIndex - 1);
            setTimer(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        {workout.name}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={cancelWorkout}>Cancel</Button>
                    <Button onClick={finishWorkout} className="bg-green-600 hover:bg-green-700">Finish Workout</Button>
                </div>
            </div>

            <Progress value={((currentExerciseIndex + 1) / workout.exercises.length) * 100} className="h-2" />

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column: Visuals & Cues */}
                <div className="space-y-4">
                    <Card className="overflow-hidden border-blue-500/20 bg-black/40 backdrop-blur">
                        <div className="aspect-video relative flex items-center justify-center bg-zinc-900">
                            <img
                                src={currentExercise.gif}
                                alt={currentExercise.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </Card>

                    <Card className="border-blue-500/20 bg-black/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-blue-400" />
                                Form Cues
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                {currentExercise.cues.map((cue, i) => (
                                    <li key={i}>{cue}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Tracking */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">{currentExercise.name}</h2>
                        {timer !== null && timer > 0 && (
                            <Badge variant="outline" className="text-lg py-1 px-3 border-yellow-500/50 text-yellow-500 animate-pulse">
                                <Timer className="w-4 h-4 mr-2" />
                                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} Rest
                            </Badge>
                        )}
                    </div>

                    <div className="grid gap-4">
                        {Array.from({ length: currentExercise.sets }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${completedSets[i]
                                    ? 'bg-blue-500/10 border-blue-500/50'
                                    : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-muted-foreground">Set {i + 1}</span>
                                    <span className="font-bold text-lg">{currentExercise.reps} Reps</span>
                                </div>
                                <Checkbox
                                    checked={!!completedSets[i]}
                                    onCheckedChange={() => handleSetToggle(i)}
                                    className="w-6 h-6 border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={prevExercise}
                            disabled={currentExerciseIndex === 0}
                            className="flex-1"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                        </Button>
                        <Button
                            onClick={nextExercise}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={currentExerciseIndex === workout.exercises.length - 1}
                        >
                            Next Exercise <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
