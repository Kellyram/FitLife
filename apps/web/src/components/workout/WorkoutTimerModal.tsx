import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@fitlife/ui"
import { X, Play, Pause, RotateCcw, Plus, Minus, CheckCircle2 } from "lucide-react"

interface WorkoutTimerModalProps {
  isOpen: boolean
  exerciseName: string
  gifUrl?: string
  onClose: () => void
  onComplete?: () => void
}

export function WorkoutTimerModal({
  isOpen,
  exerciseName,
  gifUrl,
  onClose,
  onComplete,
}: WorkoutTimerModalProps) {
  const [timerSeconds, setTimerSeconds] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [displayTime, setDisplayTime] = useState(60)
  const [completed, setCompleted] = useState(false)

  // Timer countdown logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRunning && displayTime > 0) {
      interval = setInterval(() => {
        setDisplayTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, displayTime])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (!isRunning && displayTime > 0) {
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setDisplayTime(timerSeconds)
    setIsRunning(false)
    setCompleted(false)
  }

  const handleSetTime = (seconds: number) => {
    setTimerSeconds(seconds)
    setDisplayTime(seconds)
    setIsRunning(false)
    setCompleted(false)
  }

  const handleClose = () => {
    setIsRunning(false)
    setDisplayTime(timerSeconds)
    setCompleted(false)
    onClose()
  }

  const handleComplete = () => {
    setIsRunning(false)
    if (onComplete) onComplete()
    handleClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-gradient-to-br from-zinc-900 to-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* GIF Preview */}
            {gifUrl && (
              <div className="relative w-full aspect-video bg-black/50 overflow-hidden">
                <img
                  src={gifUrl}
                  alt={exerciseName}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Exercise Name */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{exerciseName}</h2>
                <p className="text-sm text-zinc-400">Complete your set with this timer</p>
              </div>

              {/* Timer Display */}
              <div className="text-center space-y-4">
                <div
                  className={`text-7xl font-mono font-bold tracking-wider transition-all ${
                    completed
                      ? "text-emerald-400"
                      : isRunning
                        ? "text-blue-400"
                        : "text-zinc-300"
                  }`}
                >
                  {formatTime(displayTime)}
                </div>

                {/* Status Message */}
                {completed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 text-emerald-400 font-semibold"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Workout Complete!
                  </motion.div>
                )}
                {isRunning && (
                  <p className="text-sm text-blue-400 font-medium animate-pulse">
                    ⏱️ Timer Running
                  </p>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {[30, 45, 60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleSetTime(sec)}
                    disabled={isRunning}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      timerSeconds === sec
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20 disabled:opacity-50"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              {/* Adjustment Buttons */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    const newTime = Math.max(0, displayTime - 15)
                    setDisplayTime(newTime)
                  }}
                  disabled={isRunning || displayTime === 0}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-50 p-2 rounded-lg text-white transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const newTime = Math.min(600, displayTime + 15)
                    setDisplayTime(newTime)
                  }}
                  disabled={isRunning}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {!isRunning && !completed && (
                  <Button
                    onClick={handleStart}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                )}
                {isRunning && (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                )}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                {completed && (
                  <Button
                    onClick={handleComplete}
                    className="col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
              </div>

              {/* Additional Info */}
              <div className="text-xs text-zinc-500 text-center">
                <p>Adjust timer as needed • Click preset times to change duration</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
