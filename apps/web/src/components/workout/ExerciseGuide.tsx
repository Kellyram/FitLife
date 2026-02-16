import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { getExerciseGifUrl } from "@/lib/exerciseGifUrls"
import { WorkoutTimerModal } from "./WorkoutTimerModal"

interface ExerciseGuideProps {
    name: string
    gifUrl?: string
    muscleGroup: string
    reps: string
    equipment?: string
    muscleGradient?: string
}

export function ExerciseGuide({
    name,
    gifUrl,
    muscleGroup,
    reps,
    equipment,
    muscleGradient = "from-blue-500/20 to-cyan-500/20",
}: ExerciseGuideProps) {
    const [isTimerOpen, setIsTimerOpen] = useState(false)
    
    // Use provided gifUrl first, fall back to mapped GIF URL
    const displayGifUrl = gifUrl || getExerciseGifUrl(name)
    const hasGif = !!displayGifUrl

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all duration-300"
            >
                {/* GIF Display Area - Clickable */}
                <button
                    onClick={() => hasGif && setIsTimerOpen(true)}
                    disabled={!hasGif}
                    className={`relative w-full aspect-square overflow-hidden bg-gradient-to-br ${muscleGradient} ${
                        hasGif ? "cursor-pointer hover:scale-102" : ""
                    } transition-transform duration-300`}
                >
                    {hasGif ? (
                        <>
                            <img
                                src={displayGifUrl!}
                                alt={`${name} exercise demo`}
                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Overlay badge */}
                            <div className="absolute top-3 right-3 bg-blue-500/90 backdrop-blur-sm rounded-full p-2 group-hover:scale-110 transition-transform">
                                <Play className="h-4 w-4 text-white fill-white" />
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="text-5xl mb-3">🏋️</div>
                            <p className="text-xs text-zinc-500 font-medium text-center px-4">
                                GIF not yet added
                            </p>
                        </div>
                    )}
                </button>

                {/* Exercise Info */}
                <div className="p-4">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-2 line-clamp-2">
                        {name}
                    </h3>

                    <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 dark:text-zinc-400">Muscle Group</span>
                            <span className="font-semibold text-zinc-900 dark:text-white">{muscleGroup}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 dark:text-zinc-400">Target Reps</span>
                            <span className="font-semibold text-blue-500 dark:text-blue-400">{reps}</span>
                        </div>
                        {equipment && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 dark:text-zinc-400">Equipment</span>
                                <span className="font-semibold text-zinc-900 dark:text-white">{equipment}</span>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    {!hasGif && (
                        <div className="pt-3 border-t border-zinc-200 dark:border-white/5">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                <strong>To add a GIF:</strong> Update the exercise's
                                <code className="bg-zinc-900 dark:bg-white/5 px-1.5 py-0.5 rounded text-[10px] font-mono ml-1">
                                    gifUrl
                                </code>
                                property in Firebase
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Workout Timer Modal */}
            <WorkoutTimerModal
                isOpen={isTimerOpen}
                exerciseName={name}
                gifUrl={displayGifUrl}
                onClose={() => setIsTimerOpen(false)}
            />
        </>
    )
}
