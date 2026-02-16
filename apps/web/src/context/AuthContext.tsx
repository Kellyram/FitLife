
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    type User,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authError: string | null;
    resetEmailSent: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    clearResetEmailSent: () => void;
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
        case 'auth/popup-closed-by-user':
            return 'Sign-in popup was closed. Please try again.';
        default:
            return 'Something went wrong. Please try again.';
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [resetEmailSent, setResetEmailSent] = useState(false);

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
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
        }
    };

    const signInWithEmail = async (email: string, password: string, rememberMe: boolean) => {
        try {
            setAuthError(null);

            // Set Firebase persistence based on Remember Me checkbox
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence);

            await signInWithEmailAndPassword(auth, email, password);

            // Store user preference in localStorage for checkbox state
            localStorage.setItem('fitlife_remember_me', rememberMe.toString());
        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
        }
    };

    const signUpWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            setAuthError(null);
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(credential.user, { displayName });
        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
        }
    };

    const resetPassword = async (email: string) => {
        try {
            setAuthError(null);
            await sendPasswordResetEmail(auth, email);
            setResetEmailSent(true);
        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
        }
    };

    const clearResetEmailSent = () => setResetEmailSent(false);

    const logout = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            setAuthError(getFirebaseErrorMessage(error.code));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            authError,
            resetEmailSent,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail,
            resetPassword,
            logout,
            clearError,
            clearResetEmailSent
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
