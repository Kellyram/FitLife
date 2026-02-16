
import { Activity, Clock, Flame } from 'lucide-react';
import { useWorkoutStore } from '../../store/useWorkoutStore';

export const StatsOverview = () => {
    const logs = useWorkoutStore((state: any) => state.logs);

    const totalWorkouts = logs.length;
    const totalDuration = logs.reduce((acc: number, log: any) => acc + log.duration, 0);
    const totalCalories = logs.reduce((acc: number, log: any) => acc + (log.caloriesBurned || 0), 0);

    const stats = [
        {
            name: 'Total Workouts',
            value: totalWorkouts,
            icon: Activity,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
        },
        {
            name: 'Total Minutes',
            value: totalDuration,
            icon: Clock,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-400/10',
        },
        {
            name: 'Calories Burned',
            value: totalCalories,
            icon: Flame,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((item) => (
                <div
                    key={item.name}
                    className="relative overflow-hidden rounded-xl bg-white/5 border border-white/5 px-4 py-5 shadow sm:p-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                    <dt>
                        <div className={`absolute rounded-md p-3 ${item.bgColor}`}>
                            <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                        </div>
                        <p className="ml-16 truncate text-sm font-medium text-gray-400">{item.name}</p>
                    </dt>
                    <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
                        <p className="text-2xl font-semibold text-white">{item.value}</p>
                    </dd>
                </div>
            ))}
        </div>
    );
};
