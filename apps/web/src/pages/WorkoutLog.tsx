
import { useState } from 'react';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, Trash2, Dumbbell } from 'lucide-react';
import { Button } from '@fitlife/ui';
import type { WorkoutLog, WorkoutExercise } from '@fitlife/shared';

const WorkoutLogPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { exercises, addLog } = useWorkoutStore();
    const [duration, setDuration] = useState(60);
    const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
    const [notes, setNotes] = useState('');

    const handleAddExercise = () => {
        const defaultExercise = exercises[0];
        if (!defaultExercise) return;

        const newExercise: WorkoutExercise = {
            id: crypto.randomUUID(),
            exerciseId: defaultExercise.id,
            sets: [{ id: crypto.randomUUID(), reps: 10, weight: 0 }]
        };
        setSelectedExercises([...selectedExercises, newExercise]);
    };

    const handleSave = async () => {
        if (!user) {
            alert('You must be logged in to save a workout');
            return;
        }

        const newLog: WorkoutLog = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            duration,
            exercises: selectedExercises,
            caloriesBurned: duration * 5,
            userId: user.uid,
            notes: notes || undefined
        };
        
        await addLog(newLog);
        navigate('/dashboard');
    };

    const removeExercise = (id: string) => {
        setSelectedExercises(selectedExercises.filter(e => e.id !== id));
    };

    const updateExerciseSet = (exerciseIdx: number, setIdx: number, field: 'reps' | 'weight', value: number) => {
        const newExs = [...selectedExercises];
        newExs[exerciseIdx].sets[setIdx][field] = value;
        setSelectedExercises(newExs);
    };

    const addSetToExercise = (exerciseIdx: number) => {
        const newExs = [...selectedExercises];
        newExs[exerciseIdx].sets.push({ id: crypto.randomUUID(), reps: 10, weight: 0 });
        setSelectedExercises(newExs);
    };

    const removeSet = (exerciseIdx: number, setIdx: number) => {
        const newExs = [...selectedExercises];
        newExs[exerciseIdx].sets = newExs[exerciseIdx].sets.filter((_, i) => i !== setIdx);
        setSelectedExercises(newExs);
    };

    return (
        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Log Workout</h1>
                    <p className="text-sm text-muted-foreground">Record your training session</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Duration & Notes */}
                <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                            min="1"
                            className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="How did you feel? Any observations?"
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        />
                    </div>
                </div>

                {/* Exercises */}
                <div className="rounded-2xl bg-card border border-border p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Exercises</h2>
                        <Button 
                            onClick={handleAddExercise}
                            variant="outline"
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Exercise
                        </Button>
                    </div>

                    {selectedExercises.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                            <p className="mb-2">No exercises added yet</p>
                            <p className="text-sm">Add an exercise to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {selectedExercises.map((ex, exerciseIdx) => {
                                const exerciseName = exercises.find(e => e.id === ex.exerciseId)?.name || 'Unknown';
                                return (
                                    <div key={ex.id} className="p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                                        <div className="flex justify-between items-center">
                                            <select
                                                className="bg-transparent text-foreground font-semibold focus:outline-none"
                                                value={ex.exerciseId}
                                                onChange={(e) => {
                                                    const newExs = [...selectedExercises];
                                                    newExs[exerciseIdx].exerciseId = e.target.value;
                                                    setSelectedExercises(newExs);
                                                }}
                                            >
                                                {exercises.map(e => (
                                                    <option key={e.id} value={e.id} className="bg-background">
                                                        {e.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => removeExercise(ex.id)}
                                                className="text-muted-foreground hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Sets */}
                                        <div className="space-y-2 border-t border-border pt-3">
                                            <div className="text-xs font-semibold text-muted-foreground uppercase px-1">Sets</div>
                                            {ex.sets.map((set, setIdx) => (
                                                <div key={set.id} className="flex gap-3 items-center text-sm">
                                                    <span className="w-6 text-muted-foreground text-center font-semibold">#{setIdx + 1}</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-16 px-2 py-1.5 rounded bg-background border border-border text-foreground text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        placeholder="kg"
                                                        value={set.weight || ''}
                                                        onChange={(e) => updateExerciseSet(exerciseIdx, setIdx, 'weight', Number(e.target.value))}
                                                    />
                                                    <span className="text-muted-foreground">kg</span>
                                                    <span className="text-muted-foreground">×</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="w-16 px-2 py-1.5 rounded bg-background border border-border text-foreground text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                        placeholder="reps"
                                                        value={set.reps || ''}
                                                        onChange={(e) => updateExerciseSet(exerciseIdx, setIdx, 'reps', Number(e.target.value))}
                                                    />
                                                    <span className="text-muted-foreground">reps</span>
                                                    {ex.sets.length > 1 && (
                                                        <button
                                                            onClick={() => removeSet(exerciseIdx, setIdx)}
                                                            className="ml-auto text-muted-foreground hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addSetToExercise(exerciseIdx)}
                                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-1 py-1 font-semibold"
                                            >
                                                + Add Set
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                    <Button 
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Workout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutLogPage;
