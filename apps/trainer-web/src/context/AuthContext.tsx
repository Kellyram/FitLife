import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    type User,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authError: string | null;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getFirebaseErrorMessage = (code: string): string => {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        default:
            return 'Something went wrong. Please try again.';
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const clearError = () => setAuthError(null);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            setAuthError(null);
            const result = await signInWithPopup(auth, provider);

            // Create trainer profile in Firestore if it doesn't exist
            const trainerRef = doc(db, 'trainers', result.user.uid);
            const trainerSnap = await getDoc(trainerRef);
            if (!trainerSnap.exists()) {
                await setDoc(trainerRef, {
                    id: result.user.uid,
                    name: result.user.displayName || '',
                    email: result.user.email || '',
                    photoURL: result.user.photoURL || '',
                    bio: '',
                    certifications: [],
                    specialties: [],
                    createdAt: new Date().toISOString(),
                    clientCount: 0,
                });
            }

        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
            throw error;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            setAuthError(null);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
            throw error;
        }
    };

    const signUpWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            setAuthError(null);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update profile with display name
            await updateProfile(userCredential.user, { displayName });

            // Create trainer profile in Firestore
            await setDoc(doc(db, 'trainers', userCredential.user.uid), {
                id: userCredential.user.uid,
                name: displayName,
                email,
                photoURL: '',
                bio: '',
                certifications: [],
                specialties: [],
                createdAt: new Date().toISOString(),
                clientCount: 0,
            });

        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
            throw error;
        }
    };

    const value = {
        user,
        loading,
        authError,
        signInWithEmail,
        signInWithGoogle,
        signUpWithEmail,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
