/**
 * GIF Management Utilities
 * 
 * This file provides utilities for working with exercise GIFs from the public/gifs folder
 */

import { EXERCISE_GIFS } from './exerciseGifUrls'

/**
 * Get the GIF URL for an exercise
 * @param exerciseName - The exact name of the exercise (must match keys in EXERCISE_GIFS)
 * @returns The URL path to the GIF file or undefined if not found
 */
export function getExerciseGifUrl(exerciseName: string): string | undefined {
  return EXERCISE_GIFS[exerciseName]
}

/**
 * Check if a GIF exists for an exercise
 * @param exerciseName - The exact name of the exercise
 * @returns true if a GIF mapping exists
 */
export function hasGif(exerciseName: string): boolean {
  return !!EXERCISE_GIFS[exerciseName]
}

/**
 * Get all available exercises with GIFs
 * @returns Array of exercise names that have GIF mappings
 */
export function getExercisesWithGifs(): string[] {
  return Object.keys(EXERCISE_GIFS)
}

/**
 * Get the local file name from an exercise name
 * Useful for organizing your GIFs folder
 * 
 * @param exerciseName - The exercise name
 * @returns The expected GIF filename (e.g., "push-up.gif")
 */
export function getGifFilename(exerciseName: string): string {
  return exerciseName.toLowerCase().replace(/\s+/g, '-') + '.gif'
}

/**
 * Guide for adding new GIFs:
 * 
 * 1. Save your GIF file to: apps/web/public/gifs/
 *    Example: push-up.gif, bench-press.gif
 * 
 * 2. Update exerciseGifUrls.ts with the mapping:
 *    "Exercise Name": "/gifs/filename.gif"
 * 
 * 3. The component will automatically pick it up via getExerciseGifUrl()
 * 
 * GIF Naming Convention:
 * - Use lowercase
 * - Replace spaces with hyphens
 * - Keep it short and descriptive
 * - Ensure filename matches the exercise name mapping
 */
