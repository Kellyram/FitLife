
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { Calendar } from 'lucide-react';

export const RecentActivity = () => {
    const logs = useWorkoutStore((state) => state.logs);
    const recentLogs = logs.slice(0, 5); // Show last 5

    return (
        <div className="rounded-xl bg-white/5 border border-white/5 overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/5">
                <h3 className="text-lg font-medium leading-6 text-white">Recent Activity</h3>
            </div>
            <ul role="list" className="divide-y divide-white/5">
                {recentLogs.length === 0 ? (
                    <li className="px-6 py-8 text-center text-gray-500">
                        No recent workouts. Time to start training!
                    </li>
                ) : (
                    recentLogs.map((log) => (
                        <li key={log.id} className="px-6 py-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-400" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        Workout on {new Date(log.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-400 truncate">
                                        {log.duration} mins • {log.caloriesBurned || 0} kcal
                                    </p>
                                </div>
                                <div className="inline-flex items-center text-sm font-semibold text-gray-300">
                                    View
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
