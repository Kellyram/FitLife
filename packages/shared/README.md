# @fitlife/shared

Shared types, utilities, and validation schemas for FitLife applications.

## Installation

This package is part of the FitLife monorepo and uses workspace protocol:

```json
{
  "dependencies": {
    "@fitlife/shared": "workspace:*"
  }
}
```

## Contents

### Types

Domain-specific TypeScript types used across the application.

### Utilities

Common utility functions like the `cn()` helper for Tailwind classes.

### Schemas

Zod validation schemas for form validation and data validation.

## Usage

### Import Everything

```typescript
import { WorkoutLog, cn, workoutSchema } from '@fitlife/shared';
```

### Import Specific Items

```typescript
// Types only
import type { Exercise, WorkoutLog, UserProfile } from '@fitlife/shared';

// Utilities only
import { cn } from '@fitlife/shared';

// Schemas only
import { workoutSchema, exerciseSchema } from '@fitlife/shared';
```

## Types

### Exercise

Represents a single exercise that can be performed.

```typescript
interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'stretching' | 'full-body';
  description?: string;
  muscleGroups?: string[];
}
```

**Usage:**
```typescript
const benchPress: Exercise = {
  id: 'bench-press',
  name: 'Bench Press',
  category: 'strength',
  description: 'Chest exercise with barbell',
  muscleGroups: ['chest', 'triceps', 'shoulders'],
};
```

### WorkoutExercise

Represents an exercise performed in a workout with sets and reps.

```typescript
interface WorkoutExercise {
  exerciseId: string;
  sets: {
    reps: number;
    weight?: number;
    duration?: number;
  }[];
  notes?: string;
}
```

**Usage:**
```typescript
const workoutExercise: WorkoutExercise = {
  exerciseId: 'bench-press',
  sets: [
    { reps: 10, weight: 60 },
    { reps: 8, weight: 65 },
    { reps: 6, weight: 70 },
  ],
  notes: 'Felt strong today',
};
```

### WorkoutLog

Represents a complete workout session.

```typescript
interface WorkoutLog {
  id: string;
  date: string;
  duration: number; // in minutes
  exercises: WorkoutExercise[];
  notes?: string;
  caloriesBurned?: number;
}
```

**Usage:**
```typescript
const workout: WorkoutLog = {
  id: 'workout-123',
  date: '2025-02-14',
  duration: 60,
  exercises: [workoutExercise],
  caloriesBurned: 350,
  notes: 'Great session!',
};
```

### NutritionLog

Represents a nutrition/meal log entry.

```typescript
interface NutritionLog {
  id: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servings: number;
  }[];
  totalCalories: number;
  notes?: string;
}
```

**Usage:**
```typescript
const meal: NutritionLog = {
  id: 'meal-456',
  date: '2025-02-14',
  meal: 'breakfast',
  foods: [
    {
      name: 'Oatmeal',
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
      servings: 1,
    },
  ],
  totalCalories: 150,
};
```

### UserProfile

Represents user profile data.

```typescript
interface UserProfile {
  name: string;
  height: number; // in cm
  weight: number; // in kg
  age: number;
  unitSystem: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'system';
  photoURL?: string;
  weightHistory: { date: string; weight: number }[];
}
```

**Usage:**
```typescript
const profile: UserProfile = {
  name: 'John Doe',
  height: 180,
  weight: 75,
  age: 30,
  unitSystem: 'metric',
  theme: 'dark',
  weightHistory: [
    { date: '2025-01-01', weight: 78 },
    { date: '2025-02-01', weight: 75 },
  ],
};
```

### Goal

Represents a fitness goal.

```typescript
interface Goal {
  id: string;
  type: 'weight' | 'workout' | 'nutrition' | 'custom';
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  completed: boolean;
}
```

**Usage:**
```typescript
const goal: Goal = {
  id: 'goal-789',
  type: 'weight',
  title: 'Lose 5kg',
  target: 70,
  current: 75,
  unit: 'kg',
  deadline: '2025-06-01',
  completed: false,
};
```

### CommunityPost

Represents a community post.

```typescript
interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  content: string;
  imageURL?: string;
  likes: number;
  comments: number;
  createdAt: string;
}
```

## Utilities

### cn()

Utility for merging Tailwind CSS classes with proper precedence.

```typescript
function cn(...inputs: ClassValue[]): string;
```

**Usage:**
```typescript
import { cn } from '@fitlife/shared';

// Basic usage
<div className={cn("px-4 py-2", "bg-blue-500")} />

// Conditional classes
<div className={cn(
  "rounded-lg",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />

// Override classes (later classes override earlier ones)
<div className={cn("text-red-500", "text-blue-500")} />
// Result: "text-blue-500"

// Arrays and objects
<div className={cn(
  ["px-4", "py-2"],
  { "bg-blue-500": isActive, "bg-gray-500": !isActive }
)} />
```

**Why use cn()?**
- Properly merges Tailwind classes
- Handles conditional classes elegantly
- Resolves conflicting classes (last one wins)
- Type-safe with TypeScript

## Schemas

Zod validation schemas for runtime type checking and form validation.

### workoutSchema

```typescript
import { workoutSchema } from '@fitlife/shared';
import { z } from 'zod';

type WorkoutFormData = z.infer<typeof workoutSchema>;

const result = workoutSchema.safeParse(data);
if (result.success) {
  // data is valid
  const workout: WorkoutFormData = result.data;
}
```

### exerciseSchema

```typescript
import { exerciseSchema } from '@fitlife/shared';

const result = exerciseSchema.safeParse({
  id: 'squat',
  name: 'Squat',
  category: 'strength',
});
```

### nutritionSchema

```typescript
import { nutritionSchema } from '@fitlife/shared';

const result = nutritionSchema.safeParse(mealData);
```

### userProfileSchema

```typescript
import { userProfileSchema } from '@fitlife/shared';

const result = userProfileSchema.safeParse(profileData);
```

## Adding New Types

To add new shared types:

1. **Add type definition** in `src/types/index.ts`:
   ```typescript
   export interface NewType {
     id: string;
     name: string;
   }
   ```

2. **Export from main** in `src/index.ts`:
   ```typescript
   export type { NewType } from './types/index';
   ```

3. **Rebuild package**:
   ```bash
   pnpm build
   ```

## Adding New Utilities

To add new utility functions:

1. **Create utility file** in `src/utils/`:
   ```typescript
   // src/utils/format-date.ts
   export const formatDate = (date: string): string => {
     return new Date(date).toLocaleDateString();
   };
   ```

2. **Export from main** in `src/index.ts`:
   ```typescript
   export { formatDate } from './utils/format-date';
   ```

3. **Rebuild package**:
   ```bash
   pnpm build
   ```

## Adding New Schemas

To add new Zod schemas:

1. **Add schema** in `src/types/schemas.ts`:
   ```typescript
   import { z } from 'zod';

   export const newSchema = z.object({
     id: z.string(),
     name: z.string().min(1),
   });
   ```

2. **Export from main** in `src/index.ts`:
   ```typescript
   export { newSchema } from './types/schemas';
   ```

3. **Rebuild package**:
   ```bash
   pnpm build
   ```

## TypeScript Configuration

This package uses `@fitlife/typescript-config/base.json` for consistent TypeScript settings across the monorepo.

## Dependencies

- **clsx** - Class name utility
- **tailwind-merge** - Tailwind class merging
- **zod** - Schema validation (peer dependency)

## Examples

See usage examples throughout the FitLife app:

- **Types**: `apps/web/src/components/dashboard/WorkoutCard.tsx`
- **cn utility**: `apps/web/src/components/ui/*` (all UI components)
- **Schemas**: `apps/web/src/pages/LoginPage.tsx` (form validation)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on adding new types, utilities, or schemas.
