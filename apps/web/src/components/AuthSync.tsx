import { useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { useUserStore } from "@/store/useUserStore"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

/**
 * When auth user changes:
 * - If logging out: reset stores
 * - If switching users: reset stores
 * - If the same user persists: Load full profile from Firestore to ensure onboarding state is correct
 */
export function AuthSync() {
    const { user } = useAuth()
    const resetProfile = useUserStore((s) => s.resetProfile)
    const setProfile = useUserStore((s) => s.setProfile)
    const setLogs = useWorkoutStore((s) => s.setLogs)
    const previousUidRef = useRef<string | null>(null)

    useEffect(() => {
        const currentUid = user?.uid ?? null

        if (currentUid === null) {
            // User logged out
            resetProfile()
            setLogs([])
            previousUidRef.current = null
            return
        }

        if (previousUidRef.current !== currentUid) {
            // Different user logged in - reset stores
            resetProfile(user?.displayName ?? undefined)
            setLogs([])
            previousUidRef.current = currentUid

            // Load returning user's profile from Firestore to ensure onboarding state is correct
            const loadUserProfile = async () => {
                try {
                    const docSnap = await getDoc(doc(db, "users", currentUid))
                    if (docSnap.exists()) {
                        const data = docSnap.data()
                        // Only update if profile has onboardingComplete flag set
                        if (data.onboardingComplete === true) {
                            setProfile(data as any)
                        }
                    }
                } catch (error) {
                    console.error("Failed to load user profile from Firestore:", error)
                }
            }

            loadUserProfile()
        }
    }, [user?.uid, user?.displayName, resetProfile, setProfile, setLogs])

    return null
}
