import { createContext, useContext, useCallback, useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Timer, X } from "lucide-react"

const PRESETS = [30, 60, 90, 120]

type RestTimerContextValue = {
    startRest: (seconds: number) => void
}

const RestTimerContext = createContext<RestTimerContextValue | null>(null)

export function useRestTimer() {
    return useContext(RestTimerContext)
}

export function RestTimerProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [totalSeconds, setTotalSeconds] = useState(60)
    const [isRunning, setIsRunning] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const startRest = useCallback((secs: number) => {
        setTotalSeconds(secs)
        setSeconds(secs)
        setIsOpen(true)
        setIsRunning(true)
    }, [])

    useEffect(() => {
        if (isRunning && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((s) => {
                    if (s <= 1) {
                        setIsRunning(false)
                        return 0
                    }
                    return s - 1
                })
            }, 1000)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isRunning, seconds])

    const startTimer = useCallback((secs: number) => {
        setTotalSeconds(secs)
        setSeconds(secs)
        setIsRunning(true)
    }, [])

    const progress = totalSeconds > 0 ? seconds / totalSeconds : 0
    const radius = 60
    const stroke = 5
    const normalizedRadius = radius - stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI
    const strokeDashoffset = circumference - progress * circumference

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60)
        const secs = s % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <RestTimerContext.Provider value={{ startRest }}>
            {children}
            {/* FAB */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-600/30 flex items-center justify-center text-white hover:shadow-blue-500/50 transition-shadow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isRunning ? (
                    <span className="text-sm font-bold">{formatTime(seconds)}</span>
                ) : (
                    <Timer className="h-6 w-6" />
                )}
            </motion.button>

            {/* Timer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col items-center gap-6"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-8 right-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Rest Timer</p>

                            <div className="relative flex items-center justify-center">
                                <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                                    <circle
                                        stroke="rgba(59,130,246,0.1)"
                                        fill="transparent"
                                        strokeWidth={stroke}
                                        r={normalizedRadius}
                                        cx={radius}
                                        cy={radius}
                                    />
                                    <circle
                                        stroke="#3B82F6"
                                        fill="transparent"
                                        strokeWidth={stroke}
                                        strokeDasharray={`${circumference} ${circumference}`}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        r={normalizedRadius}
                                        cx={radius}
                                        cy={radius}
                                        className="transition-all duration-1000 ease-linear"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">{formatTime(seconds)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {PRESETS.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => startTimer(preset)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                            totalSeconds === preset && isRunning
                                                ? "bg-blue-500 text-white"
                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                        }`}
                                    >
                                        {preset}s
                                    </button>
                                ))}
                            </div>

                            {isRunning && (
                                <button
                                    onClick={() => {
                                        setIsRunning(false)
                                        setSeconds(0)
                                    }}
                                    className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </RestTimerContext.Provider>
    )
}
