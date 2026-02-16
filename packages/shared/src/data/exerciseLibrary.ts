import type { Exercise, MuscleGroup } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
    // CHEST
    {
        id: 'bench-press',
        name: 'Barbell Bench Press',
        category: 'strength',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
        equipment: 'Barbell',
        difficulty: 'intermediate',
        description: 'Classic chest builder',
    },
    {
        id: 'incline-bench-press',
        name: 'Incline Bench Press',
        category: 'strength',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        equipment: 'Barbell',
        difficulty: 'intermediate',
    },
    {
        id: 'dumbbell-flyes',
        name: 'Dumbbell Flyes',
        category: 'strength',
        muscleGroups: ['chest'],
        equipment: 'Dumbbells',
        difficulty: 'beginner',
    },
    {
        id: 'push-ups',
        name: 'Push-ups',
        category: 'strength',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
        equipment: 'Bodyweight',
        difficulty: 'beginner',
    },

    // BACK
    {
        id: 'deadlift',
        name: 'Deadlift',
        category: 'strength',
        muscleGroups: ['back', 'hamstrings', 'glutes'],
        equipment: 'Barbell',
        difficulty: 'advanced',
        description: 'King of posterior chain exercises',
    },
    {
        id: 'pull-ups',
        name: 'Pull-ups',
        category: 'strength',
        muscleGroups: ['back', 'biceps'],
        equipment: 'Bodyweight',
        difficulty: 'intermediate',
    },
    {
        id: 'barbell-rows',
        name: 'Barbell Rows',
        category: 'strength',
        muscleGroups: ['back', 'biceps'],
        equipment: 'Barbell',
        difficulty: 'intermediate',
    },
    {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        category: 'strength',
        muscleGroups: ['back', 'biceps'],
        equipment: 'Cable Machine',
        difficulty: 'beginner',
    },

    // SHOULDERS
    {
        id: 'overhead-press',
        name: 'Overhead Press',
        category: 'strength',
        muscleGroups: ['shoulders', 'triceps'],
        equipment: 'Barbell',
        difficulty: 'intermediate',
    },
    {
        id: 'lateral-raises',
        name: 'Lateral Raises',
        category: 'strength',
        muscleGroups: ['shoulders'],
        equipment: 'Dumbbells',
        difficulty: 'beginner',
    },
    {
        id: 'face-pulls',
        name: 'Face Pulls',
        category: 'strength',
        muscleGroups: ['shoulders', 'back'],
        equipment: 'Cable Machine',
        difficulty: 'beginner',
    },

    // LEGS
    {
        id: 'squat',
        name: 'Barbell Squat',
        category: 'strength',
        muscleGroups: ['quads', 'glutes', 'hamstrings'],
        equipment: 'Barbell',
        difficulty: 'intermediate',
        description: 'King of leg exercises',
    },
    {
        id: 'leg-press',
        name: 'Leg Press',
        category: 'strength',
        muscleGroups: ['quads', 'glutes'],
        equipment: 'Machine',
        difficulty: 'beginner',
    },
    {
        id: 'lunges',
        name: 'Walking Lunges',
        category: 'strength',
        muscleGroups: ['quads', 'glutes', 'hamstrings'],
        equipment: 'Dumbbells',
        difficulty: 'beginner',
    },
    {
        id: 'leg-curl',
        name: 'Leg Curl',
        category: 'strength',
        muscleGroups: ['hamstrings'],
        equipment: 'Machine',
        difficulty: 'beginner',
    },
    {
        id: 'calf-raises',
        name: 'Calf Raises',
        category: 'strength',
        muscleGroups: ['calves'],
        equipment: 'Machine',
        difficulty: 'beginner',
    },

    // ARMS
    {
        id: 'barbell-curl',
        name: 'Barbell Curl',
        category: 'strength',
        muscleGroups: ['biceps'],
        equipment: 'Barbell',
        difficulty: 'beginner',
    },
    {
        id: 'hammer-curl',
        name: 'Hammer Curl',
        category: 'strength',
        muscleGroups: ['biceps', 'forearms'],
        equipment: 'Dumbbells',
        difficulty: 'beginner',
    },
    {
        id: 'tricep-pushdown',
        name: 'Tricep Pushdown',
        category: 'strength',
        muscleGroups: ['triceps'],
        equipment: 'Cable Machine',
        difficulty: 'beginner',
    },
    {
        id: 'skull-crushers',
        name: 'Skull Crushers',
        category: 'strength',
        muscleGroups: ['triceps'],
        equipment: 'Barbell',
        difficulty: 'intermediate',
    },

    // CORE
    {
        id: 'plank',
        name: 'Plank',
        category: 'strength',
        muscleGroups: ['abs'],
        equipment: 'Bodyweight',
        difficulty: 'beginner',
    },
    {
        id: 'crunches',
        name: 'Crunches',
        category: 'strength',
        muscleGroups: ['abs'],
        equipment: 'Bodyweight',
        difficulty: 'beginner',
    },
    {
        id: 'russian-twists',
        name: 'Russian Twists',
        category: 'strength',
        muscleGroups: ['obliques', 'abs'],
        equipment: 'Bodyweight',
        difficulty: 'beginner',
    },

    // CARDIO
    {
        id: 'running',
        name: 'Running',
        category: 'cardio',
        muscleGroups: ['full-body'],
        equipment: 'None',
        difficulty: 'beginner',
    },
    {
        id: 'cycling',
        name: 'Cycling',
        category: 'cardio',
        muscleGroups: ['quads', 'hamstrings', 'calves'],
        equipment: 'Bike',
        difficulty: 'beginner',
    },
    {
        id: 'rowing',
        name: 'Rowing Machine',
        category: 'cardio',
        muscleGroups: ['back', 'quads', 'hamstrings'],
        equipment: 'Rowing Machine',
        difficulty: 'beginner',
    },
];

// Helper function to get exercise by ID
export const getExerciseById = (id: string): Exercise | undefined => {
    return EXERCISE_LIBRARY.find((ex) => ex.id === id);
};

// Helper function to get exercises by category
export const getExercisesByCategory = (category: Exercise['category']): Exercise[] => {
    return EXERCISE_LIBRARY.filter((ex) => ex.category === category);
};

// Helper function to get exercises by muscle group
export const getExercisesByMuscleGroup = (muscleGroup: MuscleGroup): Exercise[] => {
    return EXERCISE_LIBRARY.filter((ex) => ex.muscleGroups.includes(muscleGroup));
};

// Muscle group display names
export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    forearms: 'Forearms',
    abs: 'Abs',
    obliques: 'Obliques',
    quads: 'Quads',
    hamstrings: 'Hamstrings',
    glutes: 'Glutes',
    calves: 'Calves',
    'full-body': 'Full Body',
};

// Muscle group colors for visualization
export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
    chest: '#ef4444', // red
    back: '#3b82f6', // blue
    shoulders: '#f59e0b', // amber
    biceps: '#8b5cf6', // purple
    triceps: '#ec4899', // pink
    forearms: '#6366f1', // indigo
    abs: '#10b981', // green
    obliques: '#14b8a6', // teal
    quads: '#f97316', // orange
    hamstrings: '#eab308', // yellow
    glutes: '#a855f7', // purple
    calves: '#06b6d4', // cyan
    'full-body': '#6b7280', // gray
};
