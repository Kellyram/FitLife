
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@fitlife/shared';

/** Default profile for new users or after logout (no previous user data) */
export const DEFAULT_PROFILE: UserProfile = {
    name: 'Guest User',
    height: 175,
    weight: 70,
    age: 25,
    unitSystem: 'metric',
    theme: 'dark',
    weightHistory: [],
};

interface UserState {
    profile: UserProfile;
    setProfile: (profile: UserProfile) => void;
    resetProfile: (displayName?: string) => void;
    updateProfile: (updates: Partial<UserProfile>, skipFirestore?: boolean) => void;
    toggleTheme: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: {
                ...DEFAULT_PROFILE,
                weightHistory: [
                    { date: '2024-01-01', weight: 72 },
                    { date: '2024-02-01', weight: 71 },
                    { date: '2024-03-01', weight: 70 },
                ],
            },
            setProfile: (profile) => set({ profile }),
            resetProfile: (displayName) =>
                set({
                    profile: {
                        ...DEFAULT_PROFILE,
                        name: displayName || DEFAULT_PROFILE.name,
                        weightHistory: [],
                    },
                }),
            updateProfile: async (updates, skipFirestore) => {
                set((state) => {
                    const newProfile = { ...state.profile, ...updates };
                    // If weight changed, add to history
                    if (updates.weight && updates.weight !== state.profile.weight) {
                        newProfile.weightHistory = [
                            ...state.profile.weightHistory,
                            { date: new Date().toISOString().split('T')[0], weight: updates.weight as number }
                        ];
                    }
                    return { profile: newProfile };
                });

                // Skip Firestore write when caller already wrote directly (e.g. onboarding)
                if (skipFirestore) return;

                const { auth, db } = await import('../lib/firebase');
                const { doc, setDoc } = await import('firebase/firestore');
                if (auth.currentUser) {
                    try {
                        const state = (useUserStore.getState() as any);
                        await setDoc(doc(db, 'users', auth.currentUser.uid), {
                            ...state.profile
                        }, { merge: true });
                    } catch (e) {
                        console.error("Failed to save profile to Firestore", e);
                    }
                }
            },
            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.profile.theme === 'dark' ? 'light' : 'dark';
                    // Apply theme deeply
                    if (newTheme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return { profile: { ...state.profile, theme: newTheme } };
                }),
        }),
        {
            name: 'user-storage',
        }
    )
);
