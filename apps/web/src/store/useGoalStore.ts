
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal } from '@fitlife/shared';

interface GoalState {
    goals: Goal[];
    setGoals: (goals: Goal[]) => void;
    addGoal: (goal: Goal) => void;
    updateGoalProgress: (id: string, value: number) => void;
    deleteGoal: (id: string) => void;
}

export const useGoalStore = create<GoalState>()(
    persist(
        (set) => ({
            goals: [
                { id: '1', type: 'weight', targetValue: 65, currentValue: 70, unit: 'kg', description: 'Reach target weight' },
                { id: '2', type: 'consistency', targetValue: 3, currentValue: 1, unit: 'workouts/week', description: 'Workout 3 times a week' },
            ],
            setGoals: (goals: Goal[]) => set({ goals }),
            addGoal: async (goal) => {
                set((state) => ({ goals: [...state.goals, goal] }));
                const { auth, db } = await import('../lib/firebase');
                const { doc, setDoc } = await import('firebase/firestore');
                if (auth.currentUser) {
                    try {
                        await setDoc(doc(db, 'goals', goal.id), { ...goal, userId: auth.currentUser.uid });
                    } catch (e) {
                        console.error("Failed to save goal to Firestore", e);
                    }
                }
            },
            updateGoalProgress: async (id, value) => {
                set((state) => ({
                    goals: state.goals.map((g) => (g.id === id ? { ...g, currentValue: value } : g)),
                }));
                const { auth, db } = await import('../lib/firebase');
                const { doc, updateDoc } = await import('firebase/firestore');
                if (auth.currentUser) {
                    try {
                        await updateDoc(doc(db, 'goals', id), { currentValue: value });
                    } catch (e) {
                        console.error("Failed to update goal in Firestore", e);
                    }
                }
            },
            deleteGoal: async (id) => {
                set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
                const { auth, db } = await import('../lib/firebase');
                const { doc, deleteDoc } = await import('firebase/firestore');
                if (auth.currentUser) {
                    try {
                        await deleteDoc(doc(db, 'goals', id));
                    } catch (e) {
                        console.error("Failed to delete goal from Firestore", e);
                    }
                }
            },
        }),
        {
            name: 'goal-storage',
        }
    )
);
