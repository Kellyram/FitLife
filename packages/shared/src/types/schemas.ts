import { z } from 'zod';

export const WORKOUT_TYPES = ['Strength', 'Cardio', 'Flexibility'] as const;

export const PostSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().optional(),
  }),
  likes: z.number().default(0),
  comments: z.number().default(0),
  createdAt: z.date(),
});

export type Post = z.infer<typeof PostSchema>;

export const ExerciseLogSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number().int().positive(),
  reps: z.number().int().positive(),
  videoUrl: z.string().optional(),
});

export type ExerciseLog = z.infer<typeof ExerciseLogSchema>;
