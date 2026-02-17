export interface Exercise {
    id: string;
    name: string;
    gif: string;
    sets: number;
    reps: number | string; // "12-15" or 10
    rest: number; // in seconds
    cues: string[];
}

export interface Workout {
    id: string;
    name: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: number; // in minutes
    exercises: Exercise[];
    targetMuscleGroups: string[];
}

export interface WorkoutSession {
    id: string;
    workoutId: string;
    date: string; // ISO string
    completedExercises: Record<string, boolean[]>; // exerciseId -> array of booleans for sets
    duration: number; // actual time taken
}
