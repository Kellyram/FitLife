import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUserStore } from '../store/useUserStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const profile = useUserStore((state) => state.profile)
    const setProfile = useUserStore((state) => state.setProfile)

    // If Zustand store already has onboardingComplete, use it immediately (no loading)
    const zustandOnboarded = profile.onboardingComplete === true

    const [status, setStatus] = useState<'loading' | 'onboarded' | 'needs-onboarding'>(
        zustandOnboarded ? 'onboarded' : 'loading'
    )

    useEffect(() => {
        // If Zustand already knows onboarding is done, skip Firestore
        if (zustandOnboarded) {
            setStatus('onboarded')
            return
        }

        if (!user) {
            setStatus('needs-onboarding')
            return
        }

        const check = async () => {
            try {
                const snap = await getDoc(doc(db, 'users', user.uid))
                if (snap.exists()) {
                    const data = snap.data()
                    if (data.onboardingComplete === true) {
                        // Sync full Firestore data into Zustand so future checks are instant
                        setProfile(data as any)
                        setStatus('onboarded')
                    } else {
                        setStatus('needs-onboarding')
                    }
                } else {
                    // No user document means new user or incomplete signup
                    setStatus('needs-onboarding')
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error)
                // Allow access on error to avoid blocking returning users
                setStatus('onboarded')
            }
        }

        check()
    }, [user, zustandOnboarded, setProfile])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
        )
    }

    if (status === 'needs-onboarding') {
        return <Navigate to="/onboarding" replace />
    }

    return <>{children}</>
}
