
import { useUserStore } from '../../store/useUserStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const WeightChart = () => {
    const weightHistory = useUserStore((state) => state.profile.weightHistory) || [];

    // Format data for chart
    const data = weightHistory.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        weight: entry.weight
    }));

    if (data.length === 0) {
        return (
            <div className="rounded-xl bg-white/5 border border-white/5 p-6 h-80 flex items-center justify-center text-gray-500">
                No weight data available. Update your profile to track progress.
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white/5 border border-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium leading-6 text-white mb-4">Weight Progress</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                            domain={['auto', 'auto']}
                            unit="kg"
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#E5E7EB' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#60A5FA' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
