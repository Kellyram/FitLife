import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Star, Users, TrendingUp, ArrowRight, Lightbulb, Droplets, Flame, Apple, Zap, Heart } from "lucide-react"
import { Button } from "@fitlife/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@fitlife/ui"
import { Badge } from "@fitlife/ui"
import { useTrainers } from "@/hooks/useTrainers"
import { useUserStore } from "@/store/useUserStore"
import { useNutritionStore, getToday } from "@/store/useNutritionStore"
import { Loader2 } from "lucide-react"
import { useMemo } from "react"

const MOTIVATIONAL_QUOTES = [
    { text: "The only bad workout is the one that didn't happen.", author: "Kelly musonda" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
    { text: "Your body can stand almost anything. It's your mind that you need to convince.", author: "Andrew Murphy" },
    { text: "Excellence is not a destination; it is a continuous journey that never ends.", author: "Brian Tracy" },
]

export default function Dashboard() {
    const navigate = useNavigate()
    const { trainers, loading } = useTrainers()
    const profile = useUserStore((state) => state.profile)

    const dailyQuote = useMemo(() => {
        const today = new Date().toDateString()
        const hash = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return MOTIVATIONAL_QUOTES[hash % MOTIVATIONAL_QUOTES.length]
    }, [])

    const { getTotalsForDate, getWaterForDate, addWater, removeWater } = useNutritionStore()
    const today = getToday()
    const totals = getTotalsForDate(today)

    const tdee = profile.goalCalories || 2500
    const consumed = totals.calories
    const caloriePercentage = tdee > 0 ? (consumed / tdee) * 100 : 0

    const weight = profile.weight || 70
    const goalCals = profile.goalCalories || profile.tdee || 2500
    const proteinGoal = Math.round(weight * 2)
    const fatGoal = Math.round(weight * 0.8)
    const carbGoal = Math.max(Math.round((goalCals - proteinGoal * 4 - fatGoal * 9) / 4), 0)

    const macroData = {
        protein: { consumed: totals.protein, goal: proteinGoal, unit: "g" },
        carbs: { consumed: totals.carbs, goal: carbGoal, unit: "g" },
        fats: { consumed: totals.fats, goal: fatGoal, unit: "g" },
    }

    const waterConsumed = getWaterForDate(today)
    const waterGoal = 8

    const displayedTrainers = trainers.slice(0, 9)
    const featuredTrainer = trainers[0]

    return (
        <div className="min-h-full bg-gradient-to-b from-slate-900 via-slate-800 to-background">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />

                <div className="relative px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left: Text content */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                Build muscle, get healthy
                            </h1>
                            <p className="text-lg sm:text-xl text-zinc-300 mb-6">
                                Whatever your fitness goals, we have a coach ready to guide you every step of the way. Start your transformation today with personalized training from certified professionals.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={() => navigate("/trainers")}
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl h-auto shadow-lg shadow-blue-600/30"
                                >
                                    Find Your Trainer
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </motion.div>

                        {/* Right: Featured Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop"
                                    alt="Fitness transforming"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                                {/* Featured badge */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl p-3">
                                    <p className="text-xs font-semibold text-slate-600 mb-1">FEATURED PROGRAM</p>
                                    <p className="text-sm font-bold text-slate-900">12-Week Muscle Building Body Transformation</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Featured Trainer Spotlight */}
            {featuredTrainer && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
                >
                    <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/20 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 lg:p-8">
                            {/* Trainer Info */}
                            <div className="lg:col-span-1 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={featuredTrainer.photoURL} alt={featuredTrainer.name} />
                                        <AvatarFallback className="bg-blue-500/20 text-blue-400 text-lg font-bold">
                                            {featuredTrainer.name?.charAt(0) || "C"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">{featuredTrainer.name}</h3>
                                        <p className="text-sm text-zinc-400">{"Fitness Coach"}</p>
                                    </div>
                                </div>
                                <p className="text-zinc-300 text-sm mb-6">{featuredTrainer.bio || "Expert fitness coach dedicated to your success."}</p>
                                <Button
                                    onClick={() => navigate(`/trainers`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl w-full h-10"
                                >
                                    View Profile
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-zinc-400 uppercase">Clients</span>
                                        <Users className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-white">{Math.floor(Math.random() * 500) + 100}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-zinc-400 uppercase">Rating</span>
                                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-white">4.{Math.floor(Math.random() * 9)}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-zinc-400 uppercase">Sessions</span>
                                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-white">{Math.floor(Math.random() * 2000) + 1000}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-zinc-400 uppercase">Specialties</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        <Badge className="bg-blue-500/20 text-blue-300 text-[10px] border-0">Strength</Badge>
                                        <Badge className="bg-purple-500/20 text-purple-300 text-[10px] border-0">Cardio</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Main Content with Sidebar Layout */}
            <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content - Fitness & Wellness Coaching (2/3 width on desktop) */}
                    <div className="lg:col-span-2">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                                    Fitness & Wellness Coaching
                                </h2>
                                <p className="text-lg text-zinc-400 max-w-2xl">
                                    Meet our team of certified trainers and wellness experts dedicated to transforming your fitness journey.
                                </p>
                            </div>

                            {/* Trainers Grid */}
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {displayedTrainers.map((trainer, i) => (
                                            <motion.div
                                                key={trainer.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.05 * i }}
                                                className="group rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                                                onClick={() => navigate("/trainers")}
                                            >
                                                {/* Image */}
                                                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                                                    <img
                                                        src={trainer.photoURL || "https://images.unsplash.com/photo-1570480867382-67b440e33e25?w=400&h=300&fit=crop"}
                                                        alt={trainer.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                                                    {/* Badge overlay */}
                                                    <div className="absolute top-3 right-3">
                                                        <Badge className="bg-blue-600 text-white text-xs border-0">Certified</Badge>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-white mb-1">{trainer.name}</h3>
                                                    <p className="text-sm text-blue-400 mb-4">{"Fitness Coach"}</p>

                                                    <p className="text-sm text-zinc-300 mb-6 line-clamp-2">
                                                        {trainer.bio || "Expert trainer dedicated to helping you achieve your fitness goals."}
                                                    </p>

                                                    {/* Stats */}
                                                    <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-slate-700">
                                                        <div className="text-center">
                                                            <p className="text-lg font-bold text-white">{Math.floor(Math.random() * 300) + 50}</p>
                                                            <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Clients</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-bold text-yellow-400">4.{Math.floor(Math.random() * 9)}</p>
                                                            <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Rating</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-lg font-bold text-white">{Math.floor(Math.random() * 500) + 100}</p>
                                                            <p className="text-[10px] text-zinc-400 uppercase tracking-wide">Sessions</p>
                                                        </div>
                                                    </div>

                                                    {/* CTA */}
                                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-10">
                                                        View Profile
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* View All Button */}
                                    {trainers.length > 9 && (
                                        <div className="flex justify-center">
                                            <Button
                                                onClick={() => navigate("/trainers")}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl h-auto shadow-lg shadow-blue-600/30"
                                            >
                                                View All Trainers
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.section>
                    </div>

                    {/* Right Sidebar - Motivational & Nutrition (1/3 width on desktop) */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Motivational Quote Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="rounded-2xl bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 p-6 sticky top-24"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <Lightbulb className="h-5 w-5 text-amber-400 flex-shrink-0 mt-1" />
                                <h3 className="text-sm font-semibold text-amber-200 uppercase tracking-wider">Daily Motivation</h3>
                            </div>
                            <p className="text-base font-semibold text-white mb-3 leading-relaxed">
                                "{dailyQuote.text}"
                            </p>
                            <p className="text-xs text-amber-200/70">— {dailyQuote.author}</p>
                        </motion.div>

                        {/* Nutrition Tracking Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6"
                        >
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Apple className="h-5 w-5 text-green-400" />
                                Nutrition Tracker
                            </h3>

                            {/* Daily Calories */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Flame className="h-4 w-4 text-orange-400" />
                                        <span className="text-sm font-medium text-zinc-300">Daily Calories</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {consumed} / {tdee}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className={`h-full rounded-full transition-colors ${caloriePercentage < 80
                                            ? "bg-gradient-to-r from-emerald-500 to-green-400"
                                            : caloriePercentage < 100
                                                ? "bg-gradient-to-r from-blue-500 to-blue-400"
                                                : "bg-gradient-to-r from-orange-500 to-red-400"
                                            }`}
                                    />
                                </div>
                                <p className="text-xs text-zinc-400 mt-2">{Math.round(caloriePercentage)}% of daily goal</p>
                            </div>

                            {/* Macronutrients */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
                                {/* Protein */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-zinc-400">Protein</span>
                                        <span className="text-xs font-bold text-purple-400">
                                            {macroData.protein.consumed}g / {macroData.protein.goal}g
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                        <div
                                            style={{
                                                width: `${Math.min((macroData.protein.consumed / macroData.protein.goal) * 100, 100)}%`,
                                            }}
                                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                                        />
                                    </div>
                                </div>

                                {/* Carbs */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-zinc-400">Carbs</span>
                                        <span className="text-xs font-bold text-blue-400">
                                            {macroData.carbs.consumed}g / {macroData.carbs.goal}g
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                        <div
                                            style={{
                                                width: `${Math.min((macroData.carbs.consumed / macroData.carbs.goal) * 100, 100)}%`,
                                            }}
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                        />
                                    </div>
                                </div>

                                {/* Fats */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-zinc-400">Fats</span>
                                        <span className="text-xs font-bold text-yellow-400">
                                            {macroData.fats.consumed}g / {macroData.fats.goal}g
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                        <div
                                            style={{
                                                width: `${Math.min((macroData.fats.consumed / macroData.fats.goal) * 100, 100)}%`,
                                            }}
                                            className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Water Intake */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Droplets className="h-4 w-4 text-cyan-400" />
                                        <span className="text-sm font-medium text-zinc-300">Water Intake</span>
                                    </div>
                                    <span className="text-sm font-bold text-cyan-300">
                                        {waterConsumed} / {waterGoal} cups
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {Array.from({ length: waterGoal }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => {
                                                if (i < waterConsumed) {
                                                    removeWater(today)
                                                } else if (i === waterConsumed) {
                                                    addWater(today)
                                                }
                                            }}
                                            className={`aspect-square rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${i < waterConsumed
                                                ? "bg-cyan-500/30 border-cyan-400"
                                                : "bg-slate-700/30 border-slate-600 hover:border-cyan-400/50"
                                                }`}
                                        >
                                            <div className="w-full h-full flex items-center justify-center">
                                                {i < waterConsumed ? (
                                                    <Droplets className="h-3 w-3 text-cyan-400" />
                                                ) : i === waterConsumed ? (
                                                    <span className="text-[10px] text-zinc-500">+</span>
                                                ) : null}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-2">
                                <Button
                                    onClick={() => navigate("/nutrition")}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-10 text-sm"
                                >
                                    <Heart className="h-4 w-4 mr-2" />
                                    Log Meal
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/nutrition")}
                                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50 rounded-xl h-10 text-sm"
                                >
                                    <Zap className="h-4 w-4 mr-2" />
                                    View All Nutrition
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>


            {/* Footer spacer */}
            <div className="h-12" />
        </div>
    )
}
