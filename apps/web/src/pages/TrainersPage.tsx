// ============= IMPORTS =============
// React hooks for state management and memoization
import { useState, useMemo } from "react"
// Framer Motion for smooth animations and transitions
import { motion } from "framer-motion"
// Lucide React icons for UI elements
import { CheckCircle, Users, Loader2, ArrowRight, Zap } from "lucide-react"
// UI components from shared fitlife package
import { Button } from "@fitlife/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@fitlife/ui"
import { Badge } from "@fitlife/ui"
// Custom hooks for trainer data and authentication
import { useTrainers } from "@/hooks/useTrainers"
import { useAuth } from "@/context/AuthContext"
import { useUserStore } from "@/store/useUserStore"
// Firebase imports for database operations
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
// Type definitions from shared package
import type { TrainerProfile } from "@fitlife/shared"

// ============= DEMO DATA =============
// Fake trainers array - used when no real trainers exist in Firebase
// These are removed once trainers sign up on the trainer portal
// Each trainer has: id, name, email, photo, bio, specialties, certifications, clientCount, createdAt
const FAKE_TRAINERS: TrainerProfile[] = [
    // Trainer 1: Strength Training Specialist
    {
        id: "fake-1",
        name: "Alex Rodriguez",
        email: "alex@fitlife.com",
        photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        bio: "Strength and conditioning specialist with 8+ years of experience.",
        specialties: ["Powerlifting", "Muscle Building", "Strength Coach"],
        certifications: ["NASM-CPT", "USSF"],
        clientCount: 145,
        createdAt: new Date().toISOString(),
    },
    // Trainer 2: Cardio & HIIT Expert
    {
        id: "fake-2",
        name: "Maya Patel",
        email: "maya@fitlife.com",
        photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        bio: "Cardio and HIIT expert dedicated to transforming lives.",
        specialties: ["HIIT", "Cardio", "Endurance"],
        certifications: ["ACE", "ISSN"],
        clientCount: 187,
        createdAt: new Date().toISOString(),
    },
    // Trainer 3: Bodybuilding Coach
    {
        id: "fake-3",
        name: "James Mitchell",
        email: "james@fitlife.com",
        photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        bio: "Bodybuilding coach and nutrition specialist.",
        specialties: ["Hypertrophy", "Nutrition", "Contest Prep"],
        certifications: ["NASM-CPT", "ISSN-SNS"],
        clientCount: 92,
        createdAt: new Date().toISOString(),
    },
    // Trainer 4: Yoga & Core Specialist
    {
        id: "fake-4",
        name: "Sarah Thompson",
        email: "sarah@fitlife.com",
        photoURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        bio: "Yoga and flexibility specialist for core strength.",
        specialties: ["Yoga", "Flexibility", "Core Training"],
        certifications: ["RYT-200", "ACE"],
        clientCount: 203,
        createdAt: new Date().toISOString(),
    },
    // Trainer 5: CrossFit Expert
    {
        id: "fake-5",
        name: "Marcus Johnson",
        email: "marcus@fitlife.com",
        photoURL: "https://images.unsplash.com/photo-1507919591481-b8e97038d4b9?w=400&h=400&fit=crop",
        bio: "CrossFit coach and functional fitness expert.",
        specialties: ["CrossFit", "Functional Fitness", "Olympic Lifting"],
        certifications: ["CrossFit L2", "USAW"],
        clientCount: 156,
        createdAt: new Date().toISOString(),
    },
    // Trainer 6: Rehabilitation & Prevention Specialist
    {
        id: "fake-6",
        name: "Emma Wilson",
        email: "emma@fitlife.com",
        photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        bio: "Rehabilitation and injury prevention specialist.",
        specialties: ["Injury Prevention", "Physical Therapy", "Mobility"],
        certifications: ["NASM-CES", "FMS"],
        clientCount: 128,
        createdAt: new Date().toISOString(),
    },
]

// ============= MAIN COMPONENT =============
export default function TrainersPage() {
    // ========= STATE & HOOKS =========
    // Get current authenticated user from Firebase Auth
    const { user } = useAuth()
    
    // Fetch trainers from Firestore (returns loading, error, and trainers data)
    const { trainers: firebaseTrainers, loading, error } = useTrainers()
    
    // Get user profile and update function from Zustand store
    const profile = useUserStore((state) => state.profile)
    const updateProfile = useUserStore((state) => state.updateProfile)
    
    // Track which trainer is being selected (for loading state)
    const [selecting, setSelecting] = useState<string | null>(null)

    // ========= MEMOIZED DATA ==========
    // Combine real Firebase trainers with fake demo trainers
    // This shows both real trainers created on the trainer portal + 6 demo trainers
    // Real trainers appear first (ordered by createdAt from Firestore)
    const trainers = useMemo(() => {
        return [...firebaseTrainers, ...FAKE_TRAINERS]
    }, [firebaseTrainers])

    // Get the current trainer ID from user profile
    const currentTrainerId = profile.trainerId
    // Find the full trainer object for the currently selected trainer
    const currentTrainer = trainers.find((t) => t.id === currentTrainerId)

    // ========= EVENT HANDLERS =========
    /**
     * Handle trainer selection
     * - Updates Firestore with new trainer ID
     * - Updates local Zustand store
     * - Sets user status to "active"
     * - Tracks loading state with selecting state
     */
    const handleSelectTrainer = async (trainer: TrainerProfile) => {
        if (!user) return
        setSelecting(trainer.id)
        try {
            // Update user document in Firestore
            await updateDoc(doc(db, "users", user.uid), {
                trainerId: trainer.id,
                status: "active",
                joinedAt: new Date().toISOString(),
            })
            // Update local store for instant UI feedback
            updateProfile({ trainerId: trainer.id })
        } catch (e) {
            console.error("Failed to select trainer:", e)
        } finally {
            // Clear loading state
            setSelecting(null)
        }
    }

    /**
     * Handle trainer removal
     * - Clears trainer ID from Firestore
     * - Updates user status to "inactive"
     * - Called when user clicks "Change Trainer" button
     */
    const handleRemoveTrainer = async () => {
        if (!user) return
        setSelecting("removing")
        try {
            // Clear trainer ID from Firestore
            await updateDoc(doc(db, "users", user.uid), {
                trainerId: "",
                status: "inactive",
            })
            // Update local store
            updateProfile({ trainerId: "" })
        } catch (e) {
            console.error("Failed to remove trainer:", e)
        } finally {
            // Clear loading state
            setSelecting(null)
        }
    }

    // ========= RENDER ==========
    return (
        <div className="min-h-full bg-gradient-to-b from-slate-900 via-slate-800 to-background">
            {/* ===== HERO SECTION ===== */}
            {/* Large eye-catching header with value proposition and statistics */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden"
            >
                {/* Background gradient overlay for visual depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />

                <div className="relative px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* LEFT COLUMN: Headline and value proposition */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                Find Your Perfect Trainer
                            </h1>
                            <p className="text-lg sm:text-xl text-zinc-300 mb-6">
                                Connect with certified fitness professionals who specialize in your goals. From strength training to cardio, recovery to peak performance—find the expertise you need.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Zap className="h-4 w-4" />
                                    <span className="text-sm font-medium">Expert certified trainers</span>
                                </div>
                                <div className="flex items-center gap-2 text-purple-400">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm font-medium">Personalized coaching</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                                <p className="text-3xl font-bold text-white mb-1">{trainers.length}</p>
                                <p className="text-sm text-zinc-400">Expert Trainers</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                                <p className="text-3xl font-bold text-white mb-1">4.8+</p>
                                <p className="text-sm text-zinc-400">Avg Rating</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                                <p className="text-3xl font-bold text-white mb-1">1000+</p>
                                <p className="text-sm text-zinc-400">Happy Clients</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
                                <p className="text-3xl font-bold text-white mb-1">8+</p>
                                <p className="text-sm text-zinc-400">Specialties</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* ===== MAIN CONTENT ===== */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* ===== CURRENT TRAINER BANNER ===== */}
                {/* Show this section only if user has already selected a trainer */}
                {/* Display selected trainer info with option to change */}
                {currentTrainer && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 overflow-hidden mb-12"
                    >
                        <div className="p-6 flex items-center gap-6">
                            {/* Trainer avatar with checkmark badge */}
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={currentTrainer.photoURL} alt={currentTrainer.name} />
                                    <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-lg font-bold">
                                        {currentTrainer.name?.charAt(0) || "T"}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Green checkmark indicating selected trainer */}
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-2">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            {/* Trainer details: name, bio, and specialties */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Currently Training With</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{currentTrainer.name}</h2>
                                <p className="text-zinc-400 mb-3">{currentTrainer.bio}</p>
                                {/* Display first 3 specialties as badges */}
                                <div className="flex flex-wrap gap-2">
                                    {currentTrainer.specialties?.slice(0, 3).map((s) => (
                                        <Badge key={s} className="bg-emerald-500/20 text-emerald-300 border-0">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            {/* Button to change/remove current trainer */}
                            <Button
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-10"
                                onClick={handleRemoveTrainer}
                                disabled={selecting === "removing"}
                            >
                                {selecting === "removing" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Trainer"}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* ===== PAGE HEADER ===== */}
                {/* Section title - changes based on whether user has a trainer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="mb-12"
                >
                    {/* Display different headlines based on selection status */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                        {currentTrainer ? "Explore Other Trainers" : "Meet Our Trainers"}
                    </h2>
                    <p className="text-lg text-zinc-400">
                        Choose from our diverse team of certified professionals
                    </p>
                </motion.div>

                {/* ===== LOADING STATE ===== */}
                {/* Shows spinner while fetching trainers from Firestore */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 text-blue-400 animate-spin mb-3" />
                        <p className="text-zinc-300">Loading trainers...</p>
                    </div>
                )}

                {/* ===== ERROR STATE ===== */}
                {/* Shows error message if trainers failed to load */}
                {error && (
                    <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center">
                        <p className="text-red-400">Failed to load trainers. Please try again.</p>
                    </div>
                )}

                {/* ===== TRAINERS GRID ===== */}
                {/* Only show grid if not loading and trainers exist */}
                {!loading && trainers.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Map through trainers and create a card for each */}
                        {trainers.map((trainer, i) => {
                            // Check if this trainer is currently selected
                            const isCurrentTrainer = trainer.id === currentTrainerId
                            // Check if this trainer is currently being selected (loading)
                            const isSelecting = selecting === trainer.id

                            return (
                                // Individual trainer card with animation
                                <motion.div
                                    key={trainer.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    // Apply different styling if trainer is currently selected
                                    className={`group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                                        isCurrentTrainer
                                            ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                                            : "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                                    }`}
                                >
                                    {/* ===== IMAGE SECTION ===== */}
                                    {/* Trainer photo with hover zoom effect */}
                                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                                        <img
                                            src={trainer.photoURL || "https://images.unsplash.com/photo-1570480867382-67b440e33e25?w=400&h=300&fit=crop"}
                                            alt={trainer.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Dark gradient overlay at bottom for text readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                                        {/* ===== BADGE SECTION ===== */}
                                        {/* Show "Selected" badge if this is the current trainer */}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            {isCurrentTrainer && (
                                                <Badge className="bg-emerald-600 text-white border-0 flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Selected
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* ===== CARD CONTENT ===== */}
                                    <div className="p-6">
                                        {/* Trainer name and main certification */}
                                        <h3 className="text-xl font-bold text-white mb-1">{trainer.name}</h3>
                                        <p className="text-sm text-zinc-400 mb-3">{trainer.certifications?.[0] || "Certified Coach"}</p>

                                        {/* Trainer bio/description */}
                                        <p className="text-sm text-zinc-300 mb-4 line-clamp-2">
                                            {trainer.bio}
                                        </p>

                                        {/* ===== SPECIALTIES SECTION ===== */}
                                        {/* Show first 2 specialties + "+X more" if more exist */}
                                        {trainer.specialties && trainer.specialties.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {trainer.specialties.slice(0, 2).map((s) => (
                                                    <span
                                                        key={s}
                                                        className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-400"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                                {/* Show "+X more" badge if trainer has more than 2 specialties */}
                                                {trainer.specialties.length > 2 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-zinc-700/30 text-zinc-400">
                                                        +{trainer.specialties.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* ===== STATS SECTION ===== */}
                                        {/* Display trainer statistics: client count and number of certifications */}
                                        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-700">
                                            {/* Total clients trained by this trainer */}
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-white">{trainer.clientCount || 0}</p>
                                                <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Clients</p>
                                            </div>
                                            {/* Number of certifications/credentials */}
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-white">{trainer.certifications?.length || 0}</p>
                                                <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Certs</p>
                                            </div>
                                        </div>

                                        {/* ===== SELECT BUTTON ===== */}
                                        {/* Button to select trainer or show it's already selected */}
                                        <Button
                                            // Apply different styling if trainer is selected
                                            className={`w-full font-semibold h-10 rounded-xl ${
                                                isCurrentTrainer
                                                    ? "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                            disabled={isCurrentTrainer || isSelecting}
                                            onClick={() => handleSelectTrainer(trainer)}
                                        >
                                            {/* Show loading spinner while selecting */}
                                            {isSelecting ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : isCurrentTrainer ? null : (
                                                <ArrowRight className="h-4 w-4 mr-2" />
                                            )}
                                            {/* Button text changes based on selection state */}
                                            {isCurrentTrainer ? "Selected" : isSelecting ? "Selecting..." : "Select Trainer"}
                                        </Button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ===== FOOTER SPACER ===== */}
            {/* Empty div for visual spacing at page bottom */}
            <div className="h-12" />
        </div>
    )
}
