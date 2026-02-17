import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutSession } from '@/types/workout';

interface WorkoutState {
    // Current active session
    activeSession: WorkoutSession | null;

    // History
    history: WorkoutSession[];

    // Actions
    startWorkout: (workoutId: string) => void;
    completeSet: (exerciseId: string, setIndex: number, completed: boolean) => void;
    finishWorkout: () => void;
    cancelWorkout: () => void;
    resetStore: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
    persist(
        (set) => ({
            activeSession: null,
            history: [],

            startWorkout: (workoutId) => {
                set({
                    activeSession: {
                        id: crypto.randomUUID(),
                        workoutId,
                        date: new Date().toISOString(),
                        completedExercises: {},
                        duration: 0,
                    },
                });
            },

            completeSet: (exerciseId, setIndex, completed) => {
                set((state) => {
                    if (!state.activeSession) return state;

                    const currentCompleted = state.activeSession.completedExercises[exerciseId] || [];
                    const newCompleted = [...currentCompleted];
                    newCompleted[setIndex] = completed;

                    return {
                        activeSession: {
                            ...state.activeSession,
                            completedExercises: {
                                ...state.activeSession.completedExercises,
                                [exerciseId]: newCompleted,
                            },
                        },
                    };
                });
            },

            finishWorkout: () => {
                set((state) => {
                    if (!state.activeSession) return state;

                    const completedSession = {
                        ...state.activeSession,
                        duration: Date.now() - new Date(state.activeSession.date).getTime(), // Simple duration calc
                    };

                    return {
                        history: [completedSession, ...state.history],
                        activeSession: null,
                    };
                });
            },

            cancelWorkout: () => {
                set({ activeSession: null });
            },

            resetStore: () => {
                set({ activeSession: null, history: [] });
            },
        }),
        {
            name: 'fitlife-workout-storage',
        }
    )
);
