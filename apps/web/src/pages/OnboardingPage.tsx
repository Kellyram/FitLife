import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@fitlife/ui"
import { Input } from "@fitlife/ui"
import { Label } from "@fitlife/ui"
import { ChevronLeft, Sparkles, Check } from "lucide-react"
import { useUserStore } from "../store/useUserStore"
import { useAuth } from "../context/AuthContext"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../lib/firebase"

// ─── Step Config ───────────────────────────────────────────
const STEP_LABELS = [
    "Gender",
    "Age",
    "Goal",
    "Body Type",
    "Target Body",
    "Workout Location",
    "Target Muscles",
    "Body Metrics",
    "Activity Level",
]

// ─── Gender ─────────────────────────────────────────────────
const GENDERS = [
    {
        value: "male" as const,
        label: "Male",
        image: "/images/man.jpg",
    },
    {
        value: "female" as const,
        label: "Female",
        image: "/images/woman.jpg",
    },
]

// ─── Age Ranges ─────────────────────────────────────────────
const AGE_RANGES = [
    { value: "18-29", label: "Age: 18-29", age: 24, image: "/images/youngest.jpg" },
    { value: "30-39", label: "Age: 30-39", age: 35, image: "/images/young.jpg" },
    { value: "40-49", label: "Age: 40-49", age: 45, image: "/images/old.jpg" },
    { value: "50+", label: "Age: 50+", age: 55, image: "/images/oldest.jpg" },
]

// ─── Goals ──────────────────────────────────────────────────
const GOALS = [
    { value: "gain", label: "Build muscle", emoji: "💪" },
    { value: "lose", label: "Lose weight & shed fat", emoji: "🔥" },
    { value: "maintain", label: "Stay fit & healthy", emoji: "✨" },
]

// ─── Body Type (current) ────────────────────────────────────
const BODY_TYPES = [
    { value: "slim", label: "Slender", image: "/images/smallll.jpg" },
    { value: "average", label: "Average", image: "/images/average2.jpg" },
    { value: "heavy", label: "Heavy", image: "/images/huge.jpg" },
    { value: "very-heavy", label: "Very heavy", image: "/images/very-huge.jpg" },
]

// ─── Target Body ────────────────────────────────────────────
const TARGET_BODIES = [
    { value: "slim", label: "Slim", image: "/images/Slender.jpg" },
    { value: "fit", label: "Fit", image: "/images/average.jpg" },
    { value: "muscular", label: "Muscular", image: "/images/heavy.jpg" },
    { value: "bodybuilding", label: "Bodybuilding", image: "/images/very-heavy.jpg" },
]

// ─── Workout Location ───────────────────────────────────────
const WORKOUT_LOCATIONS = [
    { value: "home" as const, label: "At Home", desc: "Training with minimal or no equipment", image: "/images/home.jpg" },
    { value: "gym" as const, label: "Gym", desc: "Training with machines, cables, and free weights", image: "/images/at-gym.jpg" },
    { value: "hybrid" as const, label: "Hybrid", desc: "Combination of gym and home workouts", image: "/images/hybrid.jpg" },
]

// ─── Target Muscles ─────────────────────────────────────────
const MUSCLE_GROUPS = [
    { value: "chest", label: "Chest", image: "/images/chest.jpg" },
    { value: "shoulders", label: "Shoulders", image: "/images/shoulders.jpg" },
    { value: "arms", label: "Arms", image: "/images/arms.jpg" },
    { value: "abs", label: "Abs", image: "/images/abs.png" },
    { value: "back", label: "Back", image: "/images/back.jpg" },
    { value: "legs", label: "Legs", image: "/images/legs.png" },
]

// ─── Activity Levels ────────────────────────────────────────
const ACTIVITY_LEVELS = [
    { value: 1.2, label: "Sedentary", desc: "Little or no exercise" },
    { value: 1.375, label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
    { value: 1.55, label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
    { value: 1.725, label: "Very Active", desc: "Hard exercise 6-7 days/week" },
    { value: 1.9, label: "Extra Active", desc: "Intense exercise + physical job" },
]

// ─── Component ──────────────────────────────────────────────
export default function OnboardingPage() {
    const navigate = useNavigate()
    const { updateProfile } = useUserStore()
    const { user } = useAuth()
    const [step, setStep] = useState(0)
    const [direction, setDirection] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    // Form state
    const [gender, setGender] = useState<"male" | "female">("male")
    const [ageRange, setAgeRange] = useState("18-29")
    const [age, setAge] = useState(24)
    const [goal, setGoal] = useState("gain")
    const [bodyType, setBodyType] = useState("average")
    const [targetBody, setTargetBody] = useState("fit")
    const [workoutLocation, setWorkoutLocation] = useState<"home" | "gym" | "hybrid">("gym")
    const [targetMuscles, setTargetMuscles] = useState<string[]>([])
    const [height, setHeight] = useState("")
    const [weight, setWeight] = useState("")
    const [activityLevel, setActivityLevel] = useState(1.55)

    // Derived
    const heightNum = parseFloat(height) || 0
    const weightNum = parseFloat(weight) || 0

    const calculateBMR = () => {
        if (!heightNum || !weightNum || !age) return 0
        return gender === "male"
            ? 10 * weightNum + 6.25 * heightNum - 5 * age + 5
            : 10 * weightNum + 6.25 * heightNum - 5 * age - 161
    }

    const bmr = calculateBMR()
    const tdee = Math.round(bmr * activityLevel)
    let goalCalories = tdee
    if (goal === "lose") goalCalories = Math.round(tdee * 0.85)
    else if (goal === "gain") goalCalories = Math.round(tdee * 1.1)

    const totalSteps = STEP_LABELS.length
    const isResults = step === totalSteps

    // Navigation
    const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, totalSteps)) }
    const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)) }

    const canContinue = () => {
        switch (step) {
            case 0: return gender
            case 1: return ageRange
            case 2: return goal
            case 3: return bodyType
            case 4: return targetBody
            case 5: return workoutLocation
            case 6: return targetMuscles.length > 0
            case 7: return height && weight
            case 8: return activityLevel
            default: return true
        }
    }

    const toggleMuscle = (m: string) => {
        setTargetMuscles(prev =>
            prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
        )
    }

    const handleComplete = async () => {
        if (!user) return
        setIsLoading(true)
        try {
            const profileData = {
                name: user.displayName || "FitLife User",
                photoURL: user.photoURL || null,
                age,
                gender,
                ageRange,
                bodyType,
                targetBody,
                goal,
                workoutLocation,
                targetMuscles,
                activityLevel,
                height: heightNum,
                weight: weightNum,
                bmr: Math.round(bmr),
                tdee,
                goalCalories,
                onboardingComplete: true,
                unitSystem: "metric" as const,
                theme: "dark" as const,
                weightHistory: [{ date: new Date().toISOString().split("T")[0], weight: weightNum }],
            }

            // Write directly to Firestore — guaranteed to complete before navigation
            await setDoc(doc(db, "users", user.uid), profileData, { merge: true })

            // Sync local Zustand store (skip Firestore — already written above)
            updateProfile(profileData, true)

            navigate("/dashboard", { replace: true })
        } catch (error) {
            console.error("Error completing onboarding:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Slide animation
    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
            {/* Header: back + progress + counter */}
            <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-sm px-4 pt-4 pb-3">
                <div className="max-w-lg mx-auto flex items-center gap-3">
                    {step > 0 && (
                        <button onClick={goBack} className="text-zinc-400 hover:text-white transition-colors">
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}
                    <div className="flex-1 flex items-center gap-2">
                        {/* Progress bar */}
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-xs text-zinc-500 font-medium tabular-nums whitespace-nowrap">
                            {step + 1}/{totalSteps + 1}
                        </span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-lg mx-auto w-full px-4 pb-8">
                <AnimatePresence mode="wait" custom={direction}>
                    {/* ── Step 0: Gender ────────────────────────── */}
                    {step === 0 && (
                        <motion.div key="gender" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="text-center pt-2">
                                <h1 className="text-3xl font-bold">Train with a Plan</h1>
                                <p className="text-zinc-400 text-sm mt-1">1-minute Quiz</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {GENDERS.map(g => (
                                    <button
                                        key={g.value}
                                        onClick={() => { setGender(g.value); setTimeout(goNext, 300) }}
                                        className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                            gender === g.value
                                                ? "border-cyan-400 shadow-lg shadow-cyan-400/20"
                                                : "border-zinc-700 hover:border-zinc-500"
                                        }`}
                                    >
                                        <div className="aspect-[3/4] relative">
                                            <img src={g.image} alt={g.label} className="w-full h-full object-cover" loading="eager" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                            <p className="text-lg font-bold">{g.label}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-xs text-zinc-500">
                                By continuing, you agree to our Privacy Policy and Terms of Service
                            </p>
                        </motion.div>
                    )}

                    {/* ── Step 1: Age Range ─────────────────────── */}
                    {step === 1 && (
                        <motion.div key="age" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-5"
                        >
                            <h1 className="text-3xl font-bold">Choose your age</h1>
                            <div className="grid grid-cols-2 gap-3">
                                {AGE_RANGES.map(a => (
                                    <button
                                        key={a.value}
                                        onClick={() => { setAgeRange(a.value); setAge(a.age); setTimeout(goNext, 300) }}
                                        className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                            ageRange === a.value
                                                ? "border-cyan-400 shadow-lg shadow-cyan-400/20"
                                                : "border-zinc-700 hover:border-zinc-500"
                                        }`}
                                    >
                                        <div className="aspect-square relative">
                                            <img src={a.image} alt={a.label} className="w-full h-full object-cover" loading="eager" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                                            <p className="text-sm font-bold">{a.label}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 2: Goal ──────────────────────────── */}
                    {step === 2 && (
                        <motion.div key="goal" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-5"
                        >
                            <h1 className="text-3xl font-bold">What is your main goal?</h1>
                            <div className="space-y-3">
                                {GOALS.map(g => (
                                    <button
                                        key={g.value}
                                        onClick={() => { setGoal(g.value); setTimeout(goNext, 300) }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                                            goal === g.value
                                                ? "bg-zinc-800 border-cyan-400"
                                                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
                                        }`}
                                    >
                                        <span className="text-base font-semibold">{g.label}</span>
                                        <span className="text-2xl">{g.emoji}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 3: Current Body Shape ───────────── */}
                    {step === 3 && (
                        <motion.div key="body" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-5"
                        >
                            <h1 className="text-3xl font-bold">Choose your current body shape</h1>
                            <div className="grid grid-cols-2 gap-3">
                                {BODY_TYPES.map(b => (
                                    <button
                                        key={b.value}
                                        onClick={() => { setBodyType(b.value); setTimeout(goNext, 300) }}
                                        className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                            bodyType === b.value
                                                ? "border-cyan-400 shadow-lg shadow-cyan-400/20"
                                                : "border-zinc-700 hover:border-zinc-500"
                                        }`}
                                    >
                                        <div className="aspect-[3/4] relative">
                                            <img src={b.image} alt={b.label} className="w-full h-full object-cover" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                                            <p className="text-sm font-bold">{b.label}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 4: Target Body ──────────────────── */}
                    {step === 4 && (
                        <motion.div key="target" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-5"
                        >
                            <h1 className="text-3xl font-bold">Choose the body you want</h1>
                            <div className="grid grid-cols-2 gap-3">
                                {TARGET_BODIES.map(b => (
                                    <button
                                        key={b.value}
                                        onClick={() => { setTargetBody(b.value); setTimeout(goNext, 300) }}
                                        className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                            targetBody === b.value
                                                ? "border-cyan-400 shadow-lg shadow-cyan-400/20"
                                                : "border-zinc-700 hover:border-zinc-500"
                                        }`}
                                    >
                                        <div className="aspect-[3/4] relative">
                                            <img src={b.image} alt={b.label} className="w-full h-full object-cover" loading="lazy" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                                            <p className="text-sm font-bold">{b.label}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 5: Workout Location ─────────────── */}
                    {step === 5 && (
                        <motion.div key="location" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-5"
                        >
                            <h1 className="text-3xl font-bold">Where do you want to work out?</h1>
                            <div className="space-y-3">
                                {WORKOUT_LOCATIONS.map(loc => (
                                    <button
                                        key={loc.value}
                                        onClick={() => { setWorkoutLocation(loc.value); setTimeout(goNext, 300) }}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                                            workoutLocation === loc.value
                                                ? "bg-zinc-800 border-cyan-400"
                                                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
                                        }`}
                                    >
                                        <div className="flex-1 text-left">
                                            <p className="font-bold text-base">{loc.label}</p>
                                            <p className="text-sm text-zinc-400 mt-0.5">{loc.desc}</p>
                                        </div>
                                        <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0">
                                            <img src={loc.image} alt={loc.label} className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Step 6: Target Muscles (multi-select) ── */}
                    {step === 6 && (
                        <motion.div key="muscles" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div>
                                <h1 className="text-3xl font-bold">Which muscles are most important to you?</h1>
                                <p className="text-zinc-400 text-sm mt-1">Choose all that apply</p>
                            </div>
                            <div className="space-y-2">
                                {MUSCLE_GROUPS.map(m => {
                                    const selected = targetMuscles.includes(m.value)
                                    return (
                                        <button
                                            key={m.value}
                                            onClick={() => toggleMuscle(m.value)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                                                selected
                                                    ? "bg-cyan-500/10 border-cyan-400"
                                                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
                                            }`}
                                        >
                                            <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
                                                <img src={m.image} alt={m.label} className="w-full h-full object-cover" loading="lazy" />
                                            </div>
                                            <span className="flex-1 text-left font-semibold">{m.label}</span>
                                            {selected && (
                                                <div className="h-6 w-6 rounded-full bg-cyan-400 flex items-center justify-center">
                                                    <Check className="h-3.5 w-3.5 text-black" />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <Button
                                onClick={goNext}
                                disabled={targetMuscles.length === 0}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold h-12 rounded-xl text-base disabled:opacity-40 transition-all"
                            >
                                Continue
                            </Button>
                        </motion.div>
                    )}

                    {/* ── Step 7: Body Metrics ─────────────────── */}
                    {step === 7 && (
                        <motion.div key="metrics" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <h1 className="text-3xl font-bold">Your body metrics</h1>

                            {/* User avatar */}
                            {user && (
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full border-2 border-cyan-400/40" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-lg">
                                            {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold">{user.displayName || user.email?.split("@")[0]}</p>
                                        <p className="text-xs text-zinc-500">{user.email}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300 text-sm">Height (cm)</Label>
                                    <Input
                                        type="number"
                                        placeholder="175"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 rounded-xl text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300 text-sm">Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        placeholder="72"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 rounded-xl text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300 text-sm">Age (fine-tune)</Label>
                                    <Input
                                        type="number"
                                        placeholder="25"
                                        value={age}
                                        onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                                        className="h-12 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 rounded-xl text-base"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={goNext}
                                disabled={!height || !weight}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold h-12 rounded-xl text-base disabled:opacity-40 transition-all"
                            >
                                Continue
                            </Button>
                        </motion.div>
                    )}

                    {/* ── Step 8: Activity Level ───────────────── */}
                    {step === 8 && (
                        <motion.div key="activity" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-5"
                        >
                            <h1 className="text-3xl font-bold">How active are you?</h1>
                            <div className="space-y-2">
                                {ACTIVITY_LEVELS.map(level => (
                                    <button
                                        key={level.value}
                                        onClick={() => { setActivityLevel(level.value); setTimeout(goNext, 300) }}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                                            activityLevel === level.value
                                                ? "bg-zinc-800 border-cyan-400"
                                                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
                                        }`}
                                    >
                                        <div className="text-left">
                                            <p className="font-semibold">{level.label}</p>
                                            <p className="text-xs text-zinc-400">{level.desc}</p>
                                        </div>
                                        {activityLevel === level.value && (
                                            <div className="w-3 h-3 rounded-full bg-cyan-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Results ───────────────────────────────── */}
                    {isResults && (
                        <motion.div key="results" custom={direction} variants={slideVariants}
                            initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="text-center pt-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-4"
                                >
                                    <Sparkles className="h-8 w-8 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-bold">Your Personalized Plan</h1>
                                <p className="text-zinc-400 mt-1">Based on your profile, here are your daily targets</p>
                            </div>

                            {/* Calorie target */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 p-6 text-center"
                            >
                                <p className="text-5xl font-bold">{goalCalories}</p>
                                <p className="text-sm text-zinc-400 mt-1">kcal / day target</p>
                            </motion.div>

                            {/* Stats grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-2 gap-3"
                            >
                                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-center">
                                    <p className="text-xs text-zinc-500">BMR</p>
                                    <p className="text-xl font-bold">{Math.round(bmr)}</p>
                                </div>
                                <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4 text-center">
                                    <p className="text-xs text-zinc-500">TDEE</p>
                                    <p className="text-xl font-bold">{tdee}</p>
                                </div>
                            </motion.div>

                            {/* Macros */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="grid grid-cols-3 gap-3"
                            >
                                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-center">
                                    <p className="text-xs text-blue-400">Protein</p>
                                    <p className="text-lg font-bold text-blue-400">{Math.round(weightNum * 2)}g</p>
                                </div>
                                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center">
                                    <p className="text-xs text-amber-400">Carbs</p>
                                    <p className="text-lg font-bold text-amber-400">
                                        {Math.round((goalCalories - weightNum * 2 * 4 - weightNum * 0.8 * 9) / 4)}g
                                    </p>
                                </div>
                                <div className="rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-3 text-center">
                                    <p className="text-xs text-cyan-400">Fat</p>
                                    <p className="text-lg font-bold text-cyan-400">{Math.round(weightNum * 0.8)}g</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button
                                    onClick={handleComplete}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold h-14 rounded-xl text-base transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5" />
                                            Start Your Journey
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
