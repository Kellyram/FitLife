import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@fitlife/ui';
import { Input } from '@fitlife/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@fitlife/ui';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface TrainerProfile {
    id: string;
    name: string;
    email: string;
    photoURL: string;
    bio: string;
    certifications: string[];
    specialties: string[];
    createdAt: string;
    clientCount: number;
}

export default function SettingsPage() {
    // ========= STATE =========
    const { user } = useAuth();
    const [profile, setProfile] = useState<TrainerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    // Form state for editable fields
    const [formData, setFormData] = useState({
        bio: '',
        certifications: '',
        specialties: '',
    });

    // ========= EFFECTS =========
    // Load trainer profile from Firestore when component mounts
    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const trainerRef = doc(db, 'trainers', user.uid);
                const trainerSnap = await getDoc(trainerRef);
                
                if (trainerSnap.exists()) {
                    const data = trainerSnap.data() as TrainerProfile;
                    setProfile(data);
                    // Populate form with existing data
                    setFormData({
                        bio: data.bio || '',
                        certifications: data.certifications?.join(', ') || '',
                        specialties: data.specialties?.join(', ') || '',
                    });
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]);

    // ========= HANDLERS =========
    /**
     * Handle form input changes
     * Updates the formData state as trainer edits fields
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
        setSuccess(false);
    };

    /**
     * Save trainer profile to Firestore
     * - Converts comma-separated strings to arrays for certifications and specialties
     * - Updates the trainer document in Firestore
     * - Shows success/error message
     */
    const handleSave = async () => {
        if (!user) return;
        
        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            // Convert comma-separated strings to arrays
            const certifications = formData.certifications
                .split(',')
                .map(s => s.trim())
                .filter(s => s);
            
            const specialties = formData.specialties
                .split(',')
                .map(s => s.trim())
                .filter(s => s);

            // Update trainer document in Firestore
            const trainerRef = doc(db, 'trainers', user.uid);
            await updateDoc(trainerRef, {
                bio: formData.bio,
                certifications,
                specialties,
            });

            setSuccess(true);
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save profile:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // ========= RENDER =========
    if (loading) {
        return (
            <div className="p-6 md:p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-center py-12">
                    <div className="text-lg text-muted-foreground">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto">
            {/* ===== PAGE HEADER ===== */}
            <div className="mb-8 flex items-center gap-3">
                <Settings className="h-8 w-8 text-blue-500" />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
                    <p className="text-muted-foreground">Update your trainer profile information</p>
                </div>
            </div>

            {/* ===== SUCCESS MESSAGE ===== */}
            {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-600 font-medium">Profile updated successfully!</p>
                </div>
            )}

            {/* ===== ERROR MESSAGE ===== */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            )}

            {/* ===== PROFILE CARD ===== */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Your trainer profile details that appear on the client app</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Full Name
                        </label>
                        <Input
                            type="text"
                            value={profile?.name || ''}
                            disabled
                            className="bg-muted"
                            placeholder="Your name"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            This is set from your account and cannot be changed here
                        </p>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={profile?.email || ''}
                            disabled
                            className="bg-muted"
                            placeholder="Your email"
                        />
                    </div>

                    {/* Bio (Editable) */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                            Professional Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-border bg-background rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell clients about your experience and expertise..."
                            rows={4}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {formData.bio.length} characters
                        </p>
                    </div>

                    {/* Certifications (Editable) */}
                    <div>
                        <label htmlFor="certifications" className="block text-sm font-medium text-foreground mb-2">
                            Certifications
                        </label>
                        <Input
                            id="certifications"
                            type="text"
                            name="certifications"
                            value={formData.certifications}
                            onChange={handleInputChange}
                            placeholder="e.g., NASM-CPT, ACE, ISSA (separate with commas)"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter multiple certifications separated by commas
                        </p>
                    </div>

                    {/* Specialties (Editable) */}
                    <div>
                        <label htmlFor="specialties" className="block text-sm font-medium text-foreground mb-2">
                            Specialties
                        </label>
                        <Input
                            id="specialties"
                            type="text"
                            name="specialties"
                            value={formData.specialties}
                            onChange={handleInputChange}
                            placeholder="e.g., Strength Training, HIIT, Yoga (separate with commas)"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter your training specialties separated by commas
                        </p>
                    </div>

                    {/* ===== STATS (Read-only) ===== */}
                    <div className="pt-4 border-t border-border space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Clients</span>
                            <span className="text-lg font-bold text-foreground">{profile?.clientCount || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Member Since</span>
                            <span className="text-sm text-foreground">
                                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* ===== SAVE BUTTON ===== */}
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10"
                    >
                        {saving ? (
                            <>
                                <span className="animate-spin mr-2">⌛</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Profile
                            </>
                        )}
                    </Button>

                    {/* ===== INFO BOX ===== */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium mb-2">
                            💡 Tip: Your profile will appear on the client trainers page once you update your information.
                        </p>
                        <p className="text-xs text-blue-600">
                            Clients can see your name, photo, bio, certifications, and specialties to decide if you're a good fit for them.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
