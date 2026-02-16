import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { WorkoutLog } from '@fitlife/shared';

interface UseClientWorkoutsOptions {
    clientId?: string;
    trainerId?: string;
    startDate?: Date;
    endDate?: Date;
}

export const useClientWorkouts = (options: UseClientWorkoutsOptions) => {
    const { clientId, trainerId, startDate, endDate } = options;
    const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!clientId && !trainerId) {
            setWorkouts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Build query constraints
            const constraints: any[] = [];

            if (clientId) {
                constraints.push(where('userId', '==', clientId));
            }

            if (trainerId) {
                constraints.push(where('trainerId', '==', trainerId));
            }

            if (startDate) {
                constraints.push(where('date', '>=', startDate.toISOString()));
            }

            if (endDate) {
                constraints.push(where('date', '<=', endDate.toISOString()));
            }

            constraints.push(orderBy('date', 'desc'));

            const q = query(collection(db, 'workout_logs'), ...constraints);

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const workoutsData: WorkoutLog[] = [];
                    snapshot.forEach((doc) => {
                        workoutsData.push({
                            id: doc.id,
                            ...doc.data(),
                        } as WorkoutLog);
                    });
                    setWorkouts(workoutsData);
                    setLoading(false);
                },
                (err) => {
                    console.error('Error fetching workouts:', err);
                    setError(err.message);
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err: any) {
            console.error('Error setting up workouts listener:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [clientId, trainerId, startDate, endDate]);

    return { workouts, loading, error };
};
