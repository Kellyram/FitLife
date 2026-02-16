import { useMemo } from 'react';
import type { ClientProfile, WorkoutLog } from '@fitlife/shared';

interface TrainerStats {
    totalClients: number;
    activeClients: number;
    workoutsThisWeek: number;
    averageAdherence: number;
    pendingReviews: number;
    clientsNeedingAttention: ClientProfile[];
}

export const useTrainerStats = (
    clients: ClientProfile[],
    workouts: WorkoutLog[]
): TrainerStats => {
    return useMemo(() => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

        // Total clients
        const totalClients = clients.length;

        // Active clients (worked out in last 7 days)
        const activeClients = clients.filter((client) => {
            if (!client.lastWorkoutDate) return false;
            const lastWorkout = new Date(client.lastWorkoutDate);
            return lastWorkout >= oneWeekAgo;
        }).length;

        // Workouts this week (all clients)
        const workoutsThisWeek = workouts.filter((workout) => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= oneWeekAgo;
        }).length;

        // Average adherence (percentage of clients who worked out this week)
        const averageAdherence =
            totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;

        // Pending reviews (workouts not reviewed by trainer)
        const pendingReviews = workouts.filter(
            (workout) => !workout.trainerReviewed
        ).length;

        // Clients needing attention (no workout in 2+ days)
        const clientsNeedingAttention = clients.filter((client) => {
            if (!client.lastWorkoutDate) return true; // Never worked out
            const lastWorkout = new Date(client.lastWorkoutDate);
            return lastWorkout < twoDaysAgo;
        });

        return {
            totalClients,
            activeClients,
            workoutsThisWeek,
            averageAdherence,
            pendingReviews,
            clientsNeedingAttention,
        };
    }, [clients, workouts]);
};
