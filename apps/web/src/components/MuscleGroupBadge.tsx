import { Badge } from '@fitlife/ui';
import { MUSCLE_GROUP_LABELS, MUSCLE_GROUP_COLORS, type MuscleGroup } from '@fitlife/shared';

interface MuscleGroupBadgeProps {
    muscleGroup: MuscleGroup;
    className?: string;
}

export const MuscleGroupBadge = ({ muscleGroup, className }: MuscleGroupBadgeProps) => {
    const color = MUSCLE_GROUP_COLORS[muscleGroup];
    const label = MUSCLE_GROUP_LABELS[muscleGroup];

    return (
        <Badge
            variant="outline"
            className={className}
            style={{
                borderColor: color,
                color: color,
                backgroundColor: `${color}15`, // 15 is ~10% opacity in hex
            }}
        >
            {label}
        </Badge>
    );
};

interface MuscleGroupListProps {
    muscleGroups: MuscleGroup[];
    className?: string;
}

export const MuscleGroupList = ({ muscleGroups, className }: MuscleGroupListProps) => {
    return (
        <div className={`flex flex-wrap gap-1 ${className}`}>
            {muscleGroups.map((mg) => (
                <MuscleGroupBadge key={mg} muscleGroup={mg} />
            ))}
        </div>
    );
};
