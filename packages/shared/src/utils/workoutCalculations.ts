import type { WorkoutLog, WorkoutExercise, MuscleGroup } from '../types';
import { getExerciseById } from '../data/exerciseLibrary';

/**
 * Calculate total volume (sets × reps × weight) for a single exercise
 */
export const calculateExerciseVolume = (exercise: WorkoutExercise): number => {
    return exercise.sets.reduce((total, set) => {
        const reps = set.reps || 0;
        const weight = set.weight || 0;
        return total + (reps * weight);
    }, 0);
};

/**
 * Calculate muscle group volume distribution for a workout
 * Returns a record of muscle group -> total volume
 */
export const calculateMuscleGroupVolume = (
    workout: WorkoutLog
): Record<MuscleGroup, number> => {
    const volumeMap: Partial<Record<MuscleGroup, number>> = {};

    // Initialize all muscle groups to 0
    const allMuscleGroups: MuscleGroup[] = [
        'chest',
        'back',
        'shoulders',
        'biceps',
        'triceps',
        'forearms',
        'abs',
        'obliques',
        'quads',
        'hamstrings',
        'glutes',
        'calves',
        'full-body',
    ];

    allMuscleGroups.forEach((mg) => {
        volumeMap[mg] = 0;
    });

    // Calculate volume for each exercise
    workout.exercises.forEach((workoutExercise) => {
        const exercise = getExerciseById(workoutExercise.exerciseId);
        if (!exercise) return;

        const exerciseVolume = calculateExerciseVolume(workoutExercise);

        // Distribute volume across muscle groups
        const muscleGroupCount = exercise.muscleGroups.length;
        const volumePerMuscleGroup = exerciseVolume / muscleGroupCount;

        exercise.muscleGroups.forEach((muscleGroup) => {
            volumeMap[muscleGroup] = (volumeMap[muscleGroup] || 0) + volumePerMuscleGroup;
        });
    });

    return volumeMap as Record<MuscleGroup, number>;
};

/**
 * Calculate muscle group volume for multiple workouts (e.g., weekly)
 */
export const calculateWeeklyMuscleGroupVolume = (
    workouts: WorkoutLog[]
): Record<MuscleGroup, number> => {
    const totalVolume: Partial<Record<MuscleGroup, number>> = {};

    const allMuscleGroups: MuscleGroup[] = [
        'chest',
        'back',
        'shoulders',
        'biceps',
        'triceps',
        'forearms',
        'abs',
        'obliques',
        'quads',
        'hamstrings',
        'glutes',
        'calves',
        'full-body',
    ];

    allMuscleGroups.forEach((mg) => {
        totalVolume[mg] = 0;
    });

    workouts.forEach((workout) => {
        const workoutVolume = calculateMuscleGroupVolume(workout);
        Object.entries(workoutVolume).forEach(([muscleGroup, volume]) => {
            const mg = muscleGroup as MuscleGroup;
            totalVolume[mg] = (totalVolume[mg] || 0) + volume;
        });
    });

    return totalVolume as Record<MuscleGroup, number>;
};

/**
 * Get top N muscle groups by volume
 */
export const getTopMuscleGroups = (
    volumeMap: Record<MuscleGroup, number>,
    topN: number = 5
): Array<{ muscleGroup: MuscleGroup; volume: number }> => {
    return Object.entries(volumeMap)
        .filter(([_, volume]) => volume > 0)
        .map(([muscleGroup, volume]) => ({
            muscleGroup: muscleGroup as MuscleGroup,
            volume,
        }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, topN);
};

/**
 * Calculate average rest time for a workout
 */
export const calculateAverageRestTime = (workout: WorkoutLog): number => {
    let totalRest = 0;
    let setCount = 0;

    workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
            if (set.restAfter) {
                totalRest += set.restAfter;
                setCount++;
            }
        });
    });

    return setCount > 0 ? totalRest / setCount : 0;
};
