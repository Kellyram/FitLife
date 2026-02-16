
import { useState, useEffect } from 'react';
import {
    doc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    type DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export const useFirestore = (collectionName: string) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to get collection reference, potentially user-specific
    const getCollectionRef = () => collection(db, collectionName);

    const add = async (data: DocumentData) => {
        if (!user) return;
        setLoading(true);
        try {
            const docRef = await addDoc(getCollectionRef(), {
                ...data,
                userId: user.uid,
                createdAt: new Date().toISOString()
            });
            setLoading(false);
            return docRef.id;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const update = async (id: string, data: Partial<DocumentData>) => {
        if (!user) return;
        setLoading(true);
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    const remove = async (id: string) => {
        if (!user) return;
        setLoading(true);
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };

    // Real-time subscription for user's documents
    const useUserDocuments = () => {
        const [docs, setDocs] = useState<any[]>([]);

        useEffect(() => {
            if (!user) {
                setDocs([]);
                return;
            }

            const q = query(getCollectionRef(), where("userId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const results: any[] = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() });
                });
                setDocs(results);
            });

            return () => unsubscribe();
        }, [user, collectionName]);

        return docs;
    };

    return { add, update, remove, useUserDocuments, loading, error };
};
