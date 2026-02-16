import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, Ruler, Weight, Palette, Bell, Shield, LogOut } from "lucide-react"
import { Button } from "@fitlife/ui"
import { Input } from "@fitlife/ui"
import { useUserStore } from "@/store/useUserStore"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function SettingsPage() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const { profile, updateProfile, toggleTheme } = useUserStore()
    const [name, setName] = useState(profile.name || "")
    const [height, setHeight] = useState(String(profile.height || ""))
    const [weight, setWeight] = useState(String(profile.weight || ""))
    const [age, setAge] = useState(String(profile.age || ""))
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        updateProfile({
            name: name || profile.name,
            height: Number(height) || profile.height,
            weight: Number(weight) || profile.weight,
            age: Number(age) || profile.age,
        })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleSignOut = async () => {
        await logout()
        navigate("/login")
    }

    return (
        <div className="p-4 lg:p-6 max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Settings</h1>
                        <p className="text-sm text-muted-foreground">Manage your account</p>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="rounded-2xl bg-card border border-border p-4 mb-4">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Profile
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                                className="bg-muted border-border"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                            <Input
                                value={user?.email || ""}
                                disabled
                                className="bg-muted border-border opacity-60"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Ruler className="h-3 w-3" /> Height (cm)
                                </label>
                                <Input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="175"
                                    className="bg-muted border-border"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                    <Weight className="h-3 w-3" /> Weight (kg)
                                </label>
                                <Input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="70"
                                    className="bg-muted border-border"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                                <Input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="25"
                                    className="bg-muted border-border"
                                />
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleSave} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white">
                        {saved ? "Saved!" : "Save Changes"}
                    </Button>
                </div>

                {/* Preferences */}
                <div className="rounded-2xl bg-card border border-border p-4 mb-4">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        Preferences
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm text-foreground">Dark Mode</p>
                                <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative h-7 w-12 rounded-full transition-colors ${
                                    profile.theme === "dark" ? "bg-blue-500" : "bg-muted"
                                }`}
                            >
                                <div
                                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                                        profile.theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                                    }`}
                                />
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm text-foreground">Unit System</p>
                                <p className="text-xs text-muted-foreground">{profile.unitSystem === "metric" ? "Metric (kg, cm)" : "Imperial (lbs, in)"}</p>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground capitalize">{profile.unitSystem}</span>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="rounded-2xl bg-card border border-border p-4 mb-4">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        Notifications
                    </h3>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm text-foreground">Workout Reminders</p>
                            <p className="text-xs text-muted-foreground">Get reminded to work out</p>
                        </div>
                        <span className="text-xs text-muted-foreground">Coming soon</span>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-2xl bg-card border border-red-500/20 p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-400" />
                        Account
                    </h3>
                    <Button
                        variant="outline"
                        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}
