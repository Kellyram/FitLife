import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FoodItem {
    id: string;
    name: string;
    calories: number;
    protein: number;  // grams
    carbs: number;    // grams
    fats: number;     // grams
}

export interface MealEntry {
    id: string;
    foodItem: FoodItem;
    servings: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    date: string;  // YYYY-MM-DD
    time: string;  // HH:MM
}

interface NutritionState {
    meals: MealEntry[];
    waterCups: Record<string, number>; // date -> cups consumed

    // Actions
    addMeal: (meal: MealEntry) => void;
    removeMeal: (mealId: string) => void;
    addWater: (date: string) => void;
    removeWater: (date: string) => void;

    // Selectors
    getMealsForDate: (date: string) => MealEntry[];
    getTotalsForDate: (date: string) => { calories: number; protein: number; carbs: number; fats: number };
    getWaterForDate: (date: string) => number;

    resetStore: () => void;
}

// Common foods database for quick logging
export const COMMON_FOODS: FoodItem[] = [
    { id: "chicken-breast", name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    { id: "brown-rice", name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fats: 1.8 },
    { id: "broccoli", name: "Broccoli (1 cup)", calories: 55, protein: 3.7, carbs: 11, fats: 0.6 },
    { id: "salmon", name: "Salmon (100g)", calories: 208, protein: 20, carbs: 0, fats: 13 },
    { id: "eggs", name: "Eggs (2 large)", calories: 143, protein: 13, carbs: 1, fats: 10 },
    { id: "oatmeal", name: "Oatmeal (1 cup)", calories: 154, protein: 5, carbs: 27, fats: 2.6 },
    { id: "banana", name: "Banana (1 medium)", calories: 105, protein: 1.3, carbs: 27, fats: 0.4 },
    { id: "greek-yogurt", name: "Greek Yogurt (170g)", calories: 100, protein: 17, carbs: 6, fats: 0.7 },
    { id: "sweet-potato", name: "Sweet Potato (1 medium)", calories: 103, protein: 2, carbs: 24, fats: 0.1 },
    { id: "avocado", name: "Avocado (½)", calories: 160, protein: 2, carbs: 8.5, fats: 15 },
    { id: "almonds", name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fats: 14 },
    { id: "whey-protein", name: "Whey Protein Shake", calories: 120, protein: 24, carbs: 3, fats: 1 },
    { id: "white-rice", name: "White Rice (1 cup)", calories: 206, protein: 4.3, carbs: 45, fats: 0.4 },
    { id: "steak", name: "Steak (100g)", calories: 271, protein: 26, carbs: 0, fats: 18 },
    { id: "pasta", name: "Pasta (1 cup cooked)", calories: 220, protein: 8, carbs: 43, fats: 1.3 },
    { id: "apple", name: "Apple (1 medium)", calories: 95, protein: 0.5, carbs: 25, fats: 0.3 },
    { id: "peanut-butter", name: "Peanut Butter (2 tbsp)", calories: 188, protein: 8, carbs: 6, fats: 16 },
    { id: "milk", name: "Whole Milk (1 cup)", calories: 149, protein: 8, carbs: 12, fats: 8 },
    { id: "bread", name: "Whole Wheat Bread (2 slices)", calories: 138, protein: 7, carbs: 23, fats: 2.5 },
    { id: "tuna", name: "Tuna (1 can, drained)", calories: 116, protein: 26, carbs: 0, fats: 0.8 },
];

const getToday = () => new Date().toISOString().split('T')[0];

export const useNutritionStore = create<NutritionState>()(
    persist(
        (set, get) => ({
            meals: [],
            waterCups: {},

            addMeal: (meal) =>
                set((state) => ({ meals: [...state.meals, meal] })),

            removeMeal: (mealId) =>
                set((state) => ({ meals: state.meals.filter((m) => m.id !== mealId) })),

            addWater: (date) =>
                set((state) => ({
                    waterCups: {
                        ...state.waterCups,
                        [date]: (state.waterCups[date] || 0) + 1,
                    },
                })),

            removeWater: (date) =>
                set((state) => ({
                    waterCups: {
                        ...state.waterCups,
                        [date]: Math.max((state.waterCups[date] || 0) - 1, 0),
                    },
                })),

            getMealsForDate: (date) => {
                return get().meals.filter((m) => m.date === date);
            },

            getTotalsForDate: (date) => {
                const meals = get().meals.filter((m) => m.date === date);
                return meals.reduce(
                    (acc, m) => ({
                        calories: acc.calories + Math.round(m.foodItem.calories * m.servings),
                        protein: acc.protein + Math.round(m.foodItem.protein * m.servings),
                        carbs: acc.carbs + Math.round(m.foodItem.carbs * m.servings),
                        fats: acc.fats + Math.round(m.foodItem.fats * m.servings),
                    }),
                    { calories: 0, protein: 0, carbs: 0, fats: 0 }
                );
            },

            getWaterForDate: (date) => {
                return get().waterCups[date] || 0;
            },

            resetStore: () => set({ meals: [], waterCups: {} }),
        }),
        {
            name: 'fitlife-nutrition-storage',
        }
    )
);

// Helper to get today's date string
export { getToday };
