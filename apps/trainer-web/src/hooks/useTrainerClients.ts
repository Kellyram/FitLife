import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ClientProfile } from '@fitlife/shared';

export const useTrainerClients = (trainerId: string | null | undefined) => {
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!trainerId) {
            setClients([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Query users collection where trainerId matches
            const q = query(
                collection(db, 'users'),
                where('trainerId', '==', trainerId),
                orderBy('joinedAt', 'desc')
            );

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const clientsData: ClientProfile[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        clientsData.push({
                            id: doc.id,
                            ...data,
                        } as ClientProfile);
                    });
                    setClients(clientsData);
                    setLoading(false);
                },
                (err) => {
                    console.error('Error fetching clients:', err);
                    setError(err.message);
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err: any) {
            console.error('Error setting up clients listener:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [trainerId]);

    return { clients, loading, error };
};
