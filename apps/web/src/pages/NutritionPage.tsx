import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Apple, Plus, Trash2, Droplets, Flame, Search, UtensilsCrossed,
    Coffee, Sun, Moon, Cookie, ChevronDown
} from "lucide-react"
import { Button, Badge } from "@fitlife/ui"
import { useNutritionStore, COMMON_FOODS, getToday } from "@/store/useNutritionStore"
import type { FoodItem, MealEntry } from "@/store/useNutritionStore"
import { useUserStore } from "@/store/useUserStore"

const MEAL_TYPES = [
    { value: "breakfast" as const, label: "Breakfast", icon: Coffee, color: "text-amber-400" },
    { value: "lunch" as const, label: "Lunch", icon: Sun, color: "text-orange-400" },
    { value: "dinner" as const, label: "Dinner", icon: Moon, color: "text-blue-400" },
    { value: "snack" as const, label: "Snack", icon: Cookie, color: "text-pink-400" },
]

export default function NutritionPage() {
    const profile = useUserStore((state) => state.profile)
    const {
        meals, addMeal, removeMeal,
        getTotalsForDate, getWaterForDate, addWater, removeWater
    } = useNutritionStore()

    const today = getToday()
    const totals = getTotalsForDate(today)
    const waterConsumed = getWaterForDate(today)
    const waterGoal = 8

    // Macro goals
    const weight = profile.weight || 70
    const goalCals = profile.goalCalories || profile.tdee || 2500
    const proteinGoal = Math.round(weight * 2)
    const fatGoal = Math.round(weight * 0.8)
    const carbGoal = Math.max(Math.round((goalCals - proteinGoal * 4 - fatGoal * 9) / 4), 0)

    // State for adding meals
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedMealType, setSelectedMealType] = useState<MealEntry["mealType"]>("breakfast")
    const [searchQuery, setSearchQuery] = useState("")
    const [servings, setServings] = useState(1)
    const [expandedMealType, setExpandedMealType] = useState<string | null>(null)

    // Custom food form
    const [showCustom, setShowCustom] = useState(false)
    const [customFood, setCustomFood] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "" })

    const filteredFoods = COMMON_FOODS.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const todayMeals = meals.filter(m => m.date === today)
    const mealsByType = MEAL_TYPES.map(type => ({
        ...type,
        meals: todayMeals.filter(m => m.mealType === type.value),
    }))

    const handleAddMeal = (food: FoodItem) => {
        const now = new Date()
        const entry: MealEntry = {
            id: crypto.randomUUID(),
            foodItem: food,
            servings,
            mealType: selectedMealType,
            date: today,
            time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
        }
        addMeal(entry)
        setServings(1)
        setSearchQuery("")
    }

    const handleAddCustom = () => {
        if (!customFood.name || !customFood.calories) return
        const food: FoodItem = {
            id: `custom-${Date.now()}`,
            name: customFood.name,
            calories: Number(customFood.calories),
            protein: Number(customFood.protein) || 0,
            carbs: Number(customFood.carbs) || 0,
            fats: Number(customFood.fats) || 0,
        }
        handleAddMeal(food)
        setCustomFood({ name: "", calories: "", protein: "", carbs: "", fats: "" })
        setShowCustom(false)
    }

    const caloriePercentage = goalCals > 0 ? (totals.calories / goalCals) * 100 : 0

    return (
        <div className="p-4 lg:p-6 max-w-3xl mx-auto pb-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Apple className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">Nutrition</h1>
                            <p className="text-sm text-muted-foreground">Track your daily meals</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-3 w-3" /> Log Food
                    </Button>
                </div>

                {/* Calorie Summary */}
                <div className="rounded-2xl bg-card border border-border p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Calories Today</p>
                            <p className="text-3xl font-bold text-foreground">{totals.calories}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Goal</p>
                            <p className="text-lg font-semibold text-foreground">{goalCals}</p>
                        </div>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden mb-2">
                        <motion.div
                            className={`h-full rounded-full ${caloriePercentage <= 100
                                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                : "bg-gradient-to-r from-orange-500 to-red-500"
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {goalCals - totals.calories > 0
                            ? `${goalCals - totals.calories} kcal remaining`
                            : `${totals.calories - goalCals} kcal over goal`}
                    </p>
                </div>

                {/* Macros Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                        { label: "Protein", value: totals.protein, goal: proteinGoal, color: "bg-blue-500", textColor: "text-blue-400" },
                        { label: "Carbs", value: totals.carbs, goal: carbGoal, color: "bg-cyan-500", textColor: "text-cyan-400" },
                        { label: "Fats", value: totals.fats, goal: fatGoal, color: "bg-teal-500", textColor: "text-teal-400" },
                    ].map((macro) => (
                        <div key={macro.label} className="rounded-xl bg-card border border-border p-3">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{macro.label}</p>
                            <p className={`text-lg font-bold ${macro.textColor}`}>
                                {macro.value}g <span className="text-xs text-muted-foreground font-normal">/ {macro.goal}g</span>
                            </p>
                            <div className="h-1.5 w-full bg-muted rounded-full mt-1.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${macro.color}`}
                                    style={{ width: `${Math.min((macro.value / macro.goal) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Water Intake */}
                <div className="rounded-2xl bg-card border border-border p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm font-semibold text-foreground">Water Intake</span>
                        </div>
                        <span className="text-sm font-bold text-cyan-400">
                            {waterConsumed} / {waterGoal} cups
                        </span>
                    </div>
                    <div className="grid grid-cols-8 gap-2">
                        {Array.from({ length: waterGoal }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    if (i < waterConsumed) removeWater(today)
                                    else if (i === waterConsumed) addWater(today)
                                }}
                                className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${i < waterConsumed
                                    ? "bg-cyan-500/30 border-cyan-400"
                                    : "bg-muted/50 border-border hover:border-cyan-400/50"
                                    }`}
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    {i < waterConsumed ? (
                                        <Droplets className="h-3 w-3 text-cyan-400" />
                                    ) : i === waterConsumed ? (
                                        <Plus className="h-3 w-3 text-muted-foreground" />
                                    ) : null}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add Food Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <div className="rounded-2xl bg-card border border-green-500/20 p-5">
                                <h3 className="text-sm font-semibold text-foreground mb-4">Log Food</h3>

                                {/* Meal Type Selector */}
                                <div className="flex gap-2 mb-4">
                                    {MEAL_TYPES.map(type => (
                                        <button
                                            key={type.value}
                                            onClick={() => setSelectedMealType(type.value)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedMealType === type.value
                                                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                                                : "bg-muted text-muted-foreground border border-border hover:text-foreground"
                                                }`}
                                        >
                                            <type.icon className={`h-3 w-3 ${selectedMealType === type.value ? type.color : ""}`} />
                                            {type.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Search */}
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search foods..."
                                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>

                                {/* Servings */}
                                <div className="flex items-center gap-3 mb-3">
                                    <label className="text-xs text-muted-foreground">Servings:</label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                                            className="h-7 w-7 rounded-md bg-muted text-foreground text-sm hover:bg-muted/80"
                                        >−</button>
                                        <span className="text-sm font-bold text-foreground w-8 text-center">{servings}</span>
                                        <button
                                            onClick={() => setServings(servings + 0.5)}
                                            className="h-7 w-7 rounded-md bg-muted text-foreground text-sm hover:bg-muted/80"
                                        >+</button>
                                    </div>
                                </div>

                                {/* Food List */}
                                <div className="max-h-56 overflow-y-auto space-y-1 mb-3 pr-1">
                                    {filteredFoods.map(food => (
                                        <button
                                            key={food.id}
                                            onClick={() => handleAddMeal(food)}
                                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{food.name}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    P: {food.protein}g • C: {food.carbs}g • F: {food.fats}g
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-foreground">
                                                    {Math.round(food.calories * servings)} kcal
                                                </span>
                                                <Plus className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Food Toggle */}
                                <div className="border-t border-border pt-3">
                                    <button
                                        onClick={() => setShowCustom(!showCustom)}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showCustom ? "Hide" : "+"} Add custom food
                                    </button>
                                    {showCustom && (
                                        <div className="mt-3 space-y-2">
                                            <input
                                                value={customFood.name}
                                                onChange={(e) => setCustomFood(c => ({ ...c, name: e.target.value }))}
                                                placeholder="Food name"
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
                                            />
                                            <div className="grid grid-cols-4 gap-2">
                                                <input
                                                    value={customFood.calories}
                                                    onChange={(e) => setCustomFood(c => ({ ...c, calories: e.target.value }))}
                                                    placeholder="Cal"
                                                    type="number"
                                                    className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground"
                                                />
                                                <input
                                                    value={customFood.protein}
                                                    onChange={(e) => setCustomFood(c => ({ ...c, protein: e.target.value }))}
                                                    placeholder="Prot (g)"
                                                    type="number"
                                                    className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground"
                                                />
                                                <input
                                                    value={customFood.carbs}
                                                    onChange={(e) => setCustomFood(c => ({ ...c, carbs: e.target.value }))}
                                                    placeholder="Carbs (g)"
                                                    type="number"
                                                    className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground"
                                                />
                                                <input
                                                    value={customFood.fats}
                                                    onChange={(e) => setCustomFood(c => ({ ...c, fats: e.target.value }))}
                                                    placeholder="Fat (g)"
                                                    type="number"
                                                    className="px-2 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground"
                                                />
                                            </div>
                                            <Button
                                                onClick={handleAddCustom}
                                                size="sm"
                                                disabled={!customFood.name || !customFood.calories}
                                                className="w-full bg-green-600 hover:bg-green-700"
                                            >
                                                Add Custom Food
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Today's Meals by Type */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">Today's Meals</h3>
                    {mealsByType.map(({ value, label, icon: Icon, color, meals: typeMeals }) => {
                        const typeCalories = typeMeals.reduce((acc, m) => acc + Math.round(m.foodItem.calories * m.servings), 0)
                        const isExpanded = expandedMealType === value

                        return (
                            <div
                                key={value}
                                className="rounded-xl bg-card border border-border overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedMealType(isExpanded ? null : value)}
                                    className="w-full flex items-center justify-between p-3.5 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-lg bg-muted flex items-center justify-center`}>
                                            <Icon className={`h-4 w-4 ${color}`} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-foreground">{label}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {typeMeals.length} item{typeMeals.length !== 1 ? "s" : ""} • {typeCalories} kcal
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px]">{typeCalories} kcal</Badge>
                                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-3.5 pb-3">
                                                {typeMeals.length === 0 ? (
                                                    <div className="text-center py-4">
                                                        <UtensilsCrossed className="h-6 w-6 text-muted-foreground mx-auto mb-1 opacity-40" />
                                                        <p className="text-xs text-muted-foreground">Nothing logged yet</p>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-2 text-xs"
                                                            onClick={() => {
                                                                setSelectedMealType(value)
                                                                setShowAddForm(true)
                                                            }}
                                                        >
                                                            <Plus className="h-3 w-3 mr-1" /> Add {label}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5">
                                                        {typeMeals.map(meal => (
                                                            <div
                                                                key={meal.id}
                                                                className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-foreground">{meal.foodItem.name}</p>
                                                                    <p className="text-[10px] text-muted-foreground">
                                                                        {meal.servings > 1 ? `${meal.servings}x • ` : ""}
                                                                        {Math.round(meal.foodItem.calories * meal.servings)} kcal •
                                                                        P: {Math.round(meal.foodItem.protein * meal.servings)}g •
                                                                        C: {Math.round(meal.foodItem.carbs * meal.servings)}g •
                                                                        F: {Math.round(meal.foodItem.fats * meal.servings)}g
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => removeMeal(meal.id)}
                                                                    className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>

                {/* Daily Summary */}
                {todayMeals.length > 0 && (
                    <div className="mt-6 rounded-2xl bg-gradient-to-br from-green-600/10 to-emerald-500/10 border border-green-500/20 p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Flame className="h-4 w-4 text-orange-400" />
                            Daily Summary
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="text-center">
                                <p className="text-xl font-bold text-green-400">{totals.calories}</p>
                                <p className="text-[10px] text-muted-foreground">Calories</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-blue-400">{totals.protein}g</p>
                                <p className="text-[10px] text-muted-foreground">Protein</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-cyan-400">{totals.carbs}g</p>
                                <p className="text-[10px] text-muted-foreground">Carbs</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-teal-400">{totals.fats}g</p>
                                <p className="text-[10px] text-muted-foreground">Fats</p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
