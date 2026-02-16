import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { TrainerProfile } from '@fitlife/shared';

export const useTrainers = () => {
    const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'trainers'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data: TrainerProfile[] = [];
                snapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() } as TrainerProfile);
                });
                setTrainers(data);
                setLoading(false);
            },
            (err) => {
                console.error('Error fetching trainers:', err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { trainers, loading, error };
};
