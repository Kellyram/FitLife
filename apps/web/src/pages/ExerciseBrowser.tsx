
import { useState } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { Search, Dumbbell, Heart, Activity, User } from 'lucide-react';

const ExerciseBrowser = () => {
    const exercises = useWorkoutStore((state) => state.exercises);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredExercises = exercises.filter((ex) => {
        const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { id: 'all', label: 'All', icon: Activity },
        { id: 'strength', label: 'Strength', icon: Dumbbell },
        { id: 'cardio', label: 'Cardio', icon: Heart },
        { id: 'full-body', label: 'Full Body', icon: User },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full p-4 pl-10 text-sm text-white border border-white/10 rounded-lg bg-white/5 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 backdrop-blur-sm"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map((ex) => (
                    <div
                        key={ex.id}
                        className="rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm flex flex-col"
                    >
                        <div className="aspect-square relative bg-muted/30">
                            {(ex.gifUrl || ex.imageUrl) ? (
                                <img
                                    src={ex.gifUrl || ex.imageUrl}
                                    alt={ex.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                    🏋️
                                </div>
                            )}
                            <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium text-white bg-blue-600/90 rounded-md">
                                {ex.category.toUpperCase()}
                            </span>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white">{ex.name}</h3>
                            {ex.description && (
                                <p className="mt-2 text-sm text-gray-400 line-clamp-2">{ex.description}</p>
                            )}
                            {ex.muscleGroups?.length > 0 && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Target: {ex.muscleGroups.join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseBrowser;
