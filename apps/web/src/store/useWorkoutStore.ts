
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Exercise, WorkoutLog } from '@fitlife/shared';

interface WorkoutState {
    exercises: Exercise[];
    logs: WorkoutLog[];
    addLog: (log: WorkoutLog) => void;
    setLogs: (logs: WorkoutLog[]) => void;
    deleteLog: (id: string) => void;
    addExercise: (exercise: Exercise) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
    persist(
        (set) => ({
            exercises: [
                // ── Strength ──
                { id: '1', name: 'Push-up', category: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'], equipment: 'Bodyweight', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1598971639058-00066e5dd9e0?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/push-ups.gif' },
                { id: '2', name: 'Squat', category: 'strength', muscleGroups: ['quads', 'glutes'], equipment: 'Bodyweight', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/Barbell-squat.gif' },
                { id: '3', name: 'Bench Press', category: 'strength', muscleGroups: ['chest', 'triceps'], equipment: 'Barbell', difficulty: 'intermediate', imageUrl: 'https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/Barbell-bench-press.gif' },
                { id: '4', name: 'Deadlift', category: 'strength', muscleGroups: ['back', 'hamstrings', 'glutes'], equipment: 'Barbell', difficulty: 'intermediate', imageUrl: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/03/barbell-romanian-deadlift.gif' },
                { id: '5', name: 'Shoulder Press', category: 'strength', muscleGroups: ['shoulders', 'triceps'], equipment: 'Dumbbell', difficulty: 'intermediate', imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop' },
                { id: '6', name: 'Bicep Curl', category: 'strength', muscleGroups: ['biceps'], equipment: 'Dumbbell', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=400&fit=crop' },
                { id: '7', name: 'Tricep Dip', category: 'strength', muscleGroups: ['triceps', 'chest'], equipment: 'Bodyweight', difficulty: 'intermediate', imageUrl: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&h=400&fit=crop' },
                { id: '8', name: 'Lat Pulldown', category: 'strength', muscleGroups: ['back', 'biceps'], equipment: 'Cable Machine', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/lat-pulldown.gif' },
                { id: '9', name: 'Lunges', category: 'strength', muscleGroups: ['quads', 'hamstrings', 'glutes'], equipment: 'Bodyweight', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/walking-lunges.gif' },
                { id: '10', name: 'Dumbbell Row', category: 'strength', muscleGroups: ['back', 'biceps'], equipment: 'Dumbbell', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/Barbell-bent-over-row.gif' },
                { id: '11', name: 'Calf Raise', category: 'strength', muscleGroups: ['calves'], equipment: 'Bodyweight', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/calf-raise.gif' },
                // ── Cardio ──
                { id: '12', name: 'Running', category: 'cardio', muscleGroups: ['full-body'], description: 'Outdoor or treadmill running', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/running.gif' },
                { id: '13', name: 'Jumping Jacks', category: 'cardio', muscleGroups: ['full-body'], equipment: 'Bodyweight', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/jumping-jacks.gif' },
                { id: '14', name: 'Burpees', category: 'cardio', muscleGroups: ['full-body'], equipment: 'Bodyweight', difficulty: 'advanced', imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/burpees.gif' },
                { id: '15', name: 'Mountain Climbers', category: 'cardio', muscleGroups: ['abs', 'full-body'], equipment: 'Bodyweight', difficulty: 'intermediate', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/mountain-climbers.gif' },
                { id: '16', name: 'High Knees', category: 'cardio', muscleGroups: ['full-body'], equipment: 'Bodyweight', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/high-knees.gif' },
                // ── Full-body / Core ──
                { id: '17', name: 'Plank', category: 'full-body', muscleGroups: ['abs'], description: 'Core stabilization', equipment: 'Bodyweight', difficulty: 'beginner', imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/plank.gif' },
                { id: '18', name: 'Russian Twist', category: 'full-body', muscleGroups: ['abs', 'obliques'], equipment: 'Bodyweight', difficulty: 'intermediate', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/russian-twist.gif' },
                { id: '19', name: 'Leg Raise', category: 'full-body', muscleGroups: ['abs'], equipment: 'Bodyweight', difficulty: 'intermediate', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=400&fit=crop', gifUrl: 'https://menspower.nl/wp-content/uploads/2018/02/leg-raise.gif' },
            ],
            logs: [],
            setLogs: (logs: WorkoutLog[]) => set({ logs }),
            addLog: async (log) => {
                set((state) => ({ logs: [log, ...state.logs] }));
                const { auth, db } = await import('../lib/firebase');
                const { doc, setDoc } = await import('firebase/firestore');
                if (auth.currentUser) {
                    try {
                        await setDoc(doc(db, 'workout_logs', log.id), { ...log, userId: auth.currentUser.uid });
                    } catch (e) {
                        console.error("Failed to save log to Firestore", e);
                    }
                }
            },
            deleteLog: async (id) => {
                set((state) => ({ logs: state.logs.filter((l) => l.id !== id) }));
                const { auth, db } = await import('../lib/firebase');
                const { doc, deleteDoc } = await import('firebase/firestore');
                if (auth.currentUser) {
                    try {
                        await deleteDoc(doc(db, 'workout_logs', id));
                    } catch (e) {
                        console.error("Failed to delete log from Firestore", e);
                    }
                }
            },
            addExercise: (exercise) => set((state) => ({ exercises: [...state.exercises, exercise] })),
        }),
        {
            name: 'workout-storage',
        }
    )
);
