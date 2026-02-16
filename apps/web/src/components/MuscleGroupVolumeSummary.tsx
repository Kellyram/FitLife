import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@fitlife/ui';
import {
    type WorkoutLog,
    type MuscleGroup,
    calculateMuscleGroupVolume,
    MUSCLE_GROUP_LABELS,
    MUSCLE_GROUP_COLORS,
} from '@fitlife/shared';

interface MuscleGroupVolumeSummaryProps {
    workout: WorkoutLog;
}

export const MuscleGroupVolumeSummary = ({ workout }: MuscleGroupVolumeSummaryProps) => {
    const volumeMap = useMemo(() => calculateMuscleGroupVolume(workout), [workout]);

    // Get top muscle groups (volume > 0)
    const topMuscleGroups = useMemo(() => {
        return Object.entries(volumeMap)
            .filter(([_, volume]) => volume > 0)
            .map(([muscleGroup, volume]) => ({
                muscleGroup: muscleGroup as MuscleGroup,
                volume,
            }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 6); // Show top 6
    }, [volumeMap]);

    if (topMuscleGroups.length === 0) {
        return null;
    }

    const maxVolume = topMuscleGroups[0]?.volume || 1;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Muscle Group Volume</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {topMuscleGroups.map(({ muscleGroup, volume }) => {
                        const percentage = (volume / maxVolume) * 100;
                        const color = MUSCLE_GROUP_COLORS[muscleGroup];
                        const label = MUSCLE_GROUP_LABELS[muscleGroup];

                        return (
                            <div key={muscleGroup}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{label}</span>
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {Math.round(volume)} kg
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: color,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
