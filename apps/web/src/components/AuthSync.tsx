import { useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { useUserStore } from "@/store/useUserStore"
import { useWorkoutStore } from "@/store/useWorkoutStore"
import { useScheduleStore } from "@/store/useScheduleStore"
import { useNutritionStore } from "@/store/useNutritionStore"
import { useGoalStore } from "@/store/useGoalStore"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

/**
 * When auth user changes:
 * - If logging out: reset ALL stores
 * - If switching users: reset ALL stores, then load returning user profile from Firestore
 * - If the same user persists: no-op
 */
export function AuthSync() {
    const { user } = useAuth()
    const resetProfile = useUserStore((s) => s.resetProfile)
    const setProfile = useUserStore((s) => s.setProfile)
    const resetWorkouts = useWorkoutStore((s) => s.resetStore)
    const resetSchedule = useScheduleStore((s) => s.resetStore)
    const resetNutrition = useNutritionStore((s) => s.resetStore)
    const resetGoals = useGoalStore((s) => s.resetStore)
    const previousUidRef = useRef<string | null>(null)

    useEffect(() => {
        const currentUid = user?.uid ?? null

        if (currentUid === null) {
            // User logged out — wipe all stores
            resetProfile()
            resetWorkouts()
            resetSchedule()
            resetNutrition()
            resetGoals()
            previousUidRef.current = null
            return
        }

        if (previousUidRef.current !== currentUid) {
            // Different user logged in — reset everything
            resetProfile(user?.displayName ?? undefined)
            resetWorkouts()
            resetSchedule()
            resetNutrition()
            resetGoals()
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
    }, [user?.uid, user?.displayName, resetProfile, setProfile, resetWorkouts, resetSchedule, resetNutrition, resetGoals])

    return null
}
