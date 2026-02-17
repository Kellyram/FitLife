import type { Workout } from "@/types/workout";

export const WORKOUTS: Workout[] = [
    {
        id: "full-body-fundamentals",
        name: "Full Body Fundamentals",
        description: "A comprehensive routine targeting all major muscle groups for balanced development.",
        difficulty: "Beginner",
        duration: 45,
        targetMuscleGroups: ["Chest", "Back", "Legs", "Core"],
        exercises: [
            {
                id: "fbf-1",
                name: "Barbell Squat",
                gif: "/gifs/Barbell-squat.gif",
                sets: 3,
                reps: "10-12",
                rest: 90,
                cues: [
                    "Keep your chest up and core tight",
                    "Drive through your heels",
                    "Lower until thighs are parallel to floor"
                ]
            },
            {
                id: "fbf-2",
                name: "Improvised Bench Press (Floor Press/Bridge)",
                gif: "/gifs/bench-press.gif", // Using bench press gif as generic press
                sets: 3,
                reps: "10-12",
                rest: 60,
                cues: [
                    "Retract your shoulder blades",
                    "Control the weight down",
                    "Explode up without locking elbows fully"
                ]
            },
            {
                id: "fbf-3",
                name: "Bent Over Row",
                gif: "/gifs/Barbell-bent-over-row.gif",
                sets: 3,
                reps: 12,
                rest: 60,
                cues: [
                    "Hinge at the hips, keeping back flat",
                    "Pull the bar to your lower chest",
                    "Squeeze your shoulder blades together"
                ]
            },
            {
                id: "fbf-4",
                name: "Plank",
                gif: "/gifs/plank.gif",
                sets: 3,
                reps: "30-45s",
                rest: 45,
                cues: [
                    "Keep body in a straight line",
                    "Engage glutes and core",
                    "Don't let hips sag"
                ]
            }
        ]
    },
    {
        id: "upper-body-sculpt",
        name: "Upper Body Sculpt",
        description: "Focus on hypertrophy for chest, back, shoulders, and arms.",
        difficulty: "Intermediate",
        duration: 50,
        targetMuscleGroups: ["Chest", "Back", "Shoulders", "Arms"],
        exercises: [
            {
                id: "ubs-1",
                name: "Push-Ups",
                gif: "/gifs/Push-up.gif",
                sets: 4,
                reps: "AMRAP", // As many reps as possible
                rest: 60,
                cues: [
                    "Hands shoulder-width apart",
                    "Keep elbows at 45-degree angle",
                    "Full range of motion"
                ]
            },
            {
                id: "ubs-2",
                name: "Lat Pulldown (Cable/Band)",
                gif: "/gifs/cable-lat-pulldown.gif",
                sets: 3,
                reps: "12-15",
                rest: 60,
                cues: [
                    "Drive elbows down towards hips",
                    "Keep chest up throughout",
                    "Full stretch at the top"
                ]
            },
            {
                id: "ubs-3",
                name: "Dumbbell Shoulder Press",
                gif: "/gifs/dumbbell-shoulder-press.gif",
                sets: 3,
                reps: 12,
                rest: 60,
                cues: [
                    "Press weights overhead without arching back",
                    "Control the descent",
                    "Keep wrists stacked over elbows"
                ]
            },
            {
                id: "ubs-4",
                name: "Barbell Bicep Curl",
                gif: "/gifs/Barbell-biceps-curl.gif",
                sets: 3,
                reps: 15,
                rest: 45,
                cues: [
                    "Keep elbows tucked by your sides",
                    "Minimize swinging",
                    "Squeeze biceps at the top"
                ]
            },
            {
                id: "ubs-5",
                name: "Triceps Extension",
                gif: "/gifs/dumbbell-triceps-extension.gif",
                sets: 3,
                reps: 15,
                rest: 45,
                cues: [
                    "Keep upper arms stationary",
                    "Only move forearms",
                    "Feel the stretch in triceps"
                ]
            }
        ]
    },
    {
        id: "lower-body-power",
        name: "Lower Body Power",
        description: "Build strength and endurance in legs and glutes.",
        difficulty: "Intermediate",
        duration: 55,
        targetMuscleGroups: ["Quads", "Hamstrings", "Glutes", "Calves"],
        exercises: [
            {
                id: "lbp-1",
                name: "Dumbbell Squat",
                gif: "/gifs/dumbbell-squat.gif",
                sets: 4,
                reps: 10,
                rest: 90,
                cues: [
                    "Hold dumbbells at sides or shoulders",
                    "Sit back into the squat",
                    "Keep knees tracking over toes"
                ]
            },
            {
                id: "lbp-2",
                name: "Leg Press (Machine/Band)",
                gif: "/gifs/leg-press.gif",
                sets: 3,
                reps: 12,
                rest: 90,
                cues: [
                    "Place feet hip-width apart",
                    "Lower weight until knees are near chest",
                    "Don't lock knees at extension"
                ]
            },
            {
                id: "lbp-3",
                name: "Leg Extension",
                gif: "/gifs/leg-extension.gif",
                sets: 3,
                reps: 15,
                rest: 60,
                cues: [
                    "Control both up and down phases",
                    "Squeeze quads hard at the top",
                    "Keep back flat against seat"
                ]
            },
            {
                id: "lbp-4",
                name: "Lying Leg Curl",
                gif: "/gifs/lying-leg-curl.gif",
                sets: 3,
                reps: 15,
                rest: 60,
                cues: [
                    "Curl weight until it touches glutes",
                    "Control the lowering phase",
                    "Keep hips pressed into bench"
                ]
            }
        ]
    },
    {
        id: "core-crusher",
        name: "Core Crusher",
        description: "Quick but intense core routine for stability and definition.",
        difficulty: "Advanced",
        duration: 20,
        targetMuscleGroups: ["Abs", "Obliques", "Lower Back"],
        exercises: [
            {
                id: "cc-1",
                name: "Crunch",
                gif: "/gifs/crunch.gif",
                sets: 3,
                reps: 20,
                rest: 30,
                cues: [
                    "Lift shoulder blades off floor",
                    "Exhale as you crunch up",
                    "Don't pull on your neck"
                ]
            },
            {
                id: "cc-2",
                name: "Cat-Cow Stretch",
                gif: "/gifs/Cat-Cow-pose.gif",
                sets: 2,
                reps: "10 cycles",
                rest: 0,
                cues: [
                    "Move with your breath",
                    "Arch back on inhale",
                    "Round back on exhale"
                ]
            },
            {
                id: "cc-3",
                name: "Plank",
                gif: "/gifs/plank.gif",
                sets: 3,
                reps: "60s",
                rest: 45,
                cues: [
                    "Maintain clear line from head to heels",
                    "Breathe rhythmically",
                    "Resist gravity"
                ]
            }
        ]
    }
];
