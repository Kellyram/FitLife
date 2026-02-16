/**
 * Exercise GIF URLs - Local GIF mapping from public/gifs folder
 * These GIFs are displayed in the workout guides and exercise rows
 */

export const EXERCISE_GIFS: Record<string, string> = {
  // Strength - Chest
  "Push-up": "/gifs/push-up.gif",
  "Bench Press": "/gifs/bench-press.gif",
  
  // Strength - Back & Legs
  "Deadlift": "/gifs/Barbell-bent-over-row.gif",
  "Squat": "/gifs/Barbell-squat.gif",
  "Lunges": "/gifs/dumbbell-squat.gif",
  "Lat Pulldown": "/gifs/cable-lat-pulldown.gif",
  "Dumbbell Row": "/gifs/Barbell-bent-over-row.gif",
  
  // Strength - Arms & Shoulders
  "Shoulder Press": "/gifs/dumbbell-shoulder-press.gif",
  "Bicep Curl": "/gifs/Barbell-biceps-curl.gif",
  "Tricep Dip": "/gifs/dumbbell-triceps-extension.gif",
  "Calf Raise": "/gifs/leg-press.gif",
  
  // Core/Full-body
  "Plank": "/gifs/plank.gif",
  "Leg Raise": "/gifs/leg-extension.gif",
  "Russian Twist": "/gifs/crunch.gif",
  
  // Cardio
  "Running": "/gifs/Jumping-Rope.jpg",
  "High Knees": "/gifs/Cross-Arm-Push-Up.gif",
  "Jumping Jacks": "/gifs/Archer-Push-Up.gif",
  "Burpees": "/gifs/Cross-Arm-Push-Up.gif",
  "Mountain Climbers": "/gifs/Inverted-Row.gif",
  
  // Additional exercises
  "Leg Press": "/gifs/leg-press.gif",
  "Leg Curl": "/gifs/lying-leg-curl.gif",
  "Pull-up": "/gifs/Chin-Up.gif",
  "Inverted Row": "/gifs/Inverted-Row.gif",
}

/**
 * Get GIF URL for an exercise by name
 * Returns undefined if no GIF exists for the exercise
 */
export function getExerciseGifUrl(exerciseName: string): string | undefined {
  return EXERCISE_GIFS[exerciseName]
}

/**
 * Education resources - JPG files for learning different exercise variations
 */
export const EDUCATION_RESOURCES: Array<{ name: string; url: string; category: string }> = [
  { name: "Behind The Neck Pull-Ups", url: "/gifs/Behind-The-Neck-Pull-Ups.jpg", category: "Pull-ups" },
  { name: "Bicycle Crunch", url: "/gifs/Bicycle-Crunch.jpg", category: "Core" },
  { name: "Bodyweight Sumo Squat", url: "/gifs/Bodyweight-Sumo-squat.jpg", category: "Legs" },
  { name: "Chest Dip", url: "/gifs/Chest-Dip.jpg", category: "Chest" },
  { name: "Close Grip Medicine Ball Push-Up", url: "/gifs/Close-Grip-Medicine-Ball-Push-Up.jpg", category: "Chest" },
  { name: "Commando Pull-ups", url: "/gifs/commando-pull-ups.jpg", category: "Pull-ups" },
  { name: "Crunches", url: "/gifs/Crunches.jpg", category: "Core" },
  { name: "Diamond Push-up on Knees", url: "/gifs/Diamond-push-up-on-knees.jpg", category: "Chest" },
  { name: "Diamond Push-up", url: "/gifs/Diamond-push-up.jpg", category: "Chest" },
  { name: "Flat Bench Hyperextension", url: "/gifs/Flat-bench-hyperextension.jpg", category: "Back" },
  { name: "Handstand Push-Up", url: "/gifs/Handstand-Push-Up-1.jpg", category: "Shoulders" },
  { name: "Hip Bridge", url: "/gifs/Hip-Bridge.jpg", category: "Glutes" },
  { name: "Hip Thrust", url: "/gifs/Hip-Thrust.jpg", category: "Glutes" },
  { name: "Jumping Rope", url: "/gifs/Jumping-Rope.jpg", category: "Cardio" },
  { name: "Knee Push-up", url: "/gifs/Knee-push-up.jpg", category: "Chest" },
  { name: "Kneeling Bodyweight Triceps Extension", url: "/gifs/Kneeling-bodyweight-triceps-extension.jpg", category: "Triceps" },
  { name: "Muscle-Up", url: "/gifs/Muscle-Up.jpg", category: "Full-body" },
  { name: "Pistol Squats", url: "/gifs/Pistol-squats.jpg", category: "Legs" },
  { name: "Shoulder Tap Push-Ups", url: "/gifs/Shoulder-Tap-Push-Ups.jpg", category: "Core" },
]
