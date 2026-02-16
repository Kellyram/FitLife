// Muscle Groups for detailed tracking
export type MuscleGroup =
    | 'chest'
    | 'back'
    | 'shoulders'
    | 'biceps'
    | 'triceps'
    | 'forearms'
    | 'abs'
    | 'obliques'
    | 'quads'
    | 'hamstrings'
    | 'glutes'
    | 'calves'
    | 'full-body';

export interface Exercise {
    id: string;
    name: string;
    category: 'strength' | 'cardio' | 'stretching' | 'full-body';
    description?: string;
    muscleGroups: MuscleGroup[]; // Now required for muscle tracking
    equipment?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    imageUrl?: string;
    gifUrl?: string;
}

export interface WorkoutSet {
    id: string;
    reps?: number;
    weight?: number;
    duration?: number; // in seconds (for cardio)
    distance?: number; // in meters (for cardio)
    restAfter?: number; // REST TIMER - seconds rested after this set (User Story 1.2)
}

export interface WorkoutExercise {
    id: string;
    exerciseId: string;
    sets: WorkoutSet[];
    notes?: string;
}

export interface WorkoutLog {
    id: string;
    userId: string; // Client who performed the workout
    trainerId?: string; // Assigned trainer (if any)
    date: string; // ISO string
    duration: number; // in minutes
    exercises: WorkoutExercise[];
    notes?: string;
    caloriesBurned?: number;
    // Trainer feedback fields
    trainerReviewed?: boolean;
    trainerRating?: number; // 1-5 stars
    trainerFeedback?: string;
    trainerFeedbackDate?: string;
    // Muscle group volume (auto-calculated)
    muscleGroupVolume?: Record<MuscleGroup, number>; // Total volume per muscle group
}

export interface UserProfile {
    name: string;
    height: number; // in cm
    weight: number; // in kg
    age: number;
    unitSystem: 'metric' | 'imperial';
    theme: 'light' | 'dark' | 'system';
    photoURL?: string;
    weightHistory: { date: string; weight: number }[];
    // Onboarding data
    gender?: 'male' | 'female';
    bodyType?: string;
    goal?: string;
    activityLevel?: number;
    bmr?: number;
    tdee?: number;
    goalCalories?: number;
    onboardingComplete?: boolean;
    trainerId?: string; // Assigned trainer ID (links to trainers collection)
    // Extended onboarding
    ageRange?: string;
    targetBody?: string;
    workoutLocation?: 'home' | 'gym' | 'hybrid';
    targetMuscles?: string[];
}

export interface Goal {
    id: string;
    type: 'weight' | 'consistency' | 'custom';
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline?: string;
    description: string;
}

// ========== B2B TRAINER-CLIENT TYPES (Phase 1) ==========

export interface TrainerProfile {
    id: string; // Firebase Auth UID
    name: string;
    email: string;
    photoURL?: string;
    bio?: string;
    certifications?: string[];
    specialties?: string[];
    createdAt: string;
    clientCount: number;
    // Settings
    defaultMacroFormula?: 'tdee' | 'custom';
    timezone?: string;
}

export interface ClientProfile extends UserProfile {
    id: string; // Firebase Auth UID
    email: string;
    trainerId?: string; // Assigned trainer ID
    invitedBy?: string; // Trainer who invited them
    joinedAt: string;
    status: 'active' | 'inactive' | 'pending';
    // Trainer-set targets
    dailyCalories?: number;
    macroTargets?: {
        protein: number; // grams
        carbs: number;
        fat: number;
    };
    // Adherence tracking
    lastWorkoutDate?: string;
    workoutStreak?: number;
    totalWorkouts?: number;
}

export interface WorkoutTemplate {
    id: string;
    trainerId: string; // Creator
    name: string;
    description?: string;
    exercises: {
        exerciseId: string;
        sets: number;
        targetReps?: string; // e.g., "8-12", "AMRAP"
        targetWeight?: number;
        restSeconds?: number;
        notes?: string;
    }[];
    targetDuration?: number; // minutes
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ClientInvitation {
    id: string;
    trainerId: string;
    trainerName: string;
    email: string;
    status: 'pending' | 'accepted' | 'expired';
    createdAt: string;
    expiresAt: string;
    acceptedAt?: string;
}

export interface HabitCheckbox {
    id: string;
    clientId: string;
    trainerId: string;
    label: string; // e.g., "8 hours sleep", "3L water"
    type?: 'boolean' | 'number';
    targetValue?: number;
    unit?: string;
    frequency: 'daily' | 'weekly';
    createdAt: string;
}

export interface HabitLog {
    id: string;
    habitId: string;
    clientId: string;
    date: string;
    completed: boolean;
    value?: number; // For number-type habits
    notes?: string;
}
