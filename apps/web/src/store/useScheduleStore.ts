
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ScheduledActivity {
    id: string;
    date: string; // ISO string YYYY-MM-DD
    title: string;
    type: 'workout' | 'rest' | 'other';
    completed: boolean;
}

interface ScheduleState {
    schedule: ScheduledActivity[];
    addActivity: (activity: ScheduledActivity) => void;
    toggleCompletion: (id: string) => void;
    deleteActivity: (id: string) => void;
    resetStore: () => void;
}

export const useScheduleStore = create<ScheduleState>()(
    persist(
        (set) => ({
            schedule: [],
            addActivity: (activity) => set((state) => ({ schedule: [...state.schedule, activity] })),
            toggleCompletion: (id) =>
                set((state) => ({
                    schedule: state.schedule.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)),
                })),
            deleteActivity: (id) => set((state) => ({ schedule: state.schedule.filter((s) => s.id !== id) })),
            resetStore: () => set({ schedule: [] }),
        }),
        {
            name: 'schedule-storage',
        }
    )
);
