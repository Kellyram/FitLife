
import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { useGoalStore } from '../store/useGoalStore';
import { useUserStore } from '../store/useUserStore';
import type { UserProfile } from '@fitlife/shared';

export const DataSync = () => {
    const { user } = useAuth();
    const { useUserDocuments: useGoals } = useFirestore('goals');

    // We can't use the hook for goals/logs directly inside useEffect if the hook itself returns data
    // The hook `useUserDocuments` returns `docs`.
    // The hook `useUserDocuments` returns `docs`.
    const goals = useGoals();

    const setGoals = useGoalStore((state) => state.setGoals);
    const setProfile = useUserStore((state) => state.setProfile);

    // Sync Goals
    useEffect(() => {
        if (user && goals.length > 0) {
            setGoals(goals as any);
        }
    }, [user, goals, setGoals]);

    // Sync Profile (Single Document)
    useEffect(() => {
        if (!user) return;

        const unsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
            if (snapshot.exists()) {
                setProfile(snapshot.data() as UserProfile);
            }
        });

        return () => unsub();
    }, [user, setProfile]);

    return null;
};
