import { memo, useMemo } from "react"
import { motion } from "framer-motion"
import { Clock, Flame, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/store/useUserStore"

interface WorkoutCardProps {
    title: string
    duration: string
    calories: string
    level: string
    image: string
    index: number
}

const WorkoutCard = memo(function WorkoutCard({ title, duration, calories, level, image, index }: WorkoutCardProps) {
    const navigate = useNavigate()

    return (
        <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/workout")}
            className="relative flex-shrink-0 w-44 h-56 rounded-2xl overflow-hidden group"
        >
            {/* HD Background */}
            <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Badge */}
            <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-500/90 text-white backdrop-blur-sm">
                    {level}
                </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-sm font-bold text-white text-left leading-tight">{title}</h4>
                <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-zinc-400" />
                        <span className="text-[10px] text-zinc-300">{duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span className="text-[10px] text-zinc-300">{calories}</span>
                    </div>
                </div>
            </div>
        </motion.button>
    )
})

const ALL_WORKOUTS = [
    {
        title: "Upper Body Power",
        duration: "45 min",
        level: "Intermediate",
        calories: "320 kcal",
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
        muscles: ["chest", "shoulders", "triceps", "biceps"],
    },
    {
        title: "HIIT Cardio Blast",
        duration: "30 min",
        level: "Advanced",
        calories: "400 kcal",
        image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80",
        muscles: ["full-body"],
    },
    {
        title: "Core Strength",
        duration: "25 min",
        level: "Beginner",
        calories: "180 kcal",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
        muscles: ["abs", "obliques"],
    },
    {
        title: "Leg Day",
        duration: "50 min",
        level: "Intermediate",
        calories: "380 kcal",
        image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80",
        muscles: ["quads", "hamstrings", "glutes", "calves"],
    },
    {
        title: "Back & Biceps",
        duration: "40 min",
        level: "Intermediate",
        calories: "290 kcal",
        image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&q=80",
        muscles: ["back", "biceps"],
    },
    {
        title: "Yoga Flow",
        duration: "35 min",
        level: "Beginner",
        calories: "150 kcal",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
        muscles: ["full-body"],
    },
]

export function WorkoutSuggestions() {
    const profile = useUserStore((state) => state.profile)

    // Prioritize workouts matching user's target muscles
    const workouts = useMemo(() => {
        const targets = profile.targetMuscles || []
        if (targets.length === 0) return ALL_WORKOUTS

        return [...ALL_WORKOUTS].sort((a, b) => {
            const aMatch = a.muscles.some((m) => targets.includes(m))
            const bMatch = b.muscles.some((m) => targets.includes(m))
            if (aMatch && !bMatch) return -1
            if (!aMatch && bMatch) return 1
            return 0
        })
    }, [profile.targetMuscles])

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-400">Suggested Workouts</h3>
                <button
                    className="flex items-center gap-0.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={() => {}}
                >
                    See all <ChevronRight className="h-3.5 w-3.5" />
                </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {workouts.map((w, i) => (
                    <WorkoutCard
                        key={w.title}
                        title={w.title}
                        duration={w.duration}
                        calories={w.calories}
                        level={w.level}
                        image={w.image}
                        index={i}
                    />
                ))}
            </div>
        </motion.div>
    )
}
