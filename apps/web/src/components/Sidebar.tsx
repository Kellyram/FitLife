import { NavLink, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@fitlife/ui"
import { ThemeToggle } from "@fitlife/ui"
import { useAuth } from "@/context/AuthContext"
import { useUserStore } from "@/store/useUserStore"
import {
    LayoutDashboard,
    Target,
    User,
    Calendar,
    Trophy,
    Settings,
    LogOut,
    GraduationCap,
    ExternalLink,
    Dumbbell,
    Apple,
} from "lucide-react"

const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/workouts", icon: Dumbbell, label: "Workouts" },
    { to: "/nutrition", icon: Apple, label: "Nutrition" },
    { to: "/goals", icon: Target, label: "My Goals" },
    { to: "/profile", icon: User, label: "Profile Settings" },
    { to: "/schedule", icon: Calendar, label: "Schedule" },
    { to: "/achievements", icon: Trophy, label: "Achievements" },
    { to: "/settings", icon: Settings, label: "Settings" },
]

const TRAINER_URL = "http://localhost:3001"

export function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { profile, toggleTheme } = useUserStore()
    const isDark = profile.theme === "dark"
    const firstName = profile.name?.split(" ")[0] || user?.displayName?.split(" ")[0] || "User"

    const handleSignOut = async () => {
        await logout()
        navigate("/login")
    }

    return (
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-card border-r border-border">
            {/* User card */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.photoURL || profile.photoURL || undefined} alt={profile.name} />
                        <AvatarFallback className="bg-primary/20 text-primary text-sm font-bold">
                            {firstName.charAt(0).toLowerCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground truncate">{profile.name || "Guest"}</p>
                        <p className="text-xs text-muted-foreground">{profile.age ? `Age ${profile.age}` : "Age not set"}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-500 dark:text-blue-400">
                        HEIGHT {profile.height ? `${profile.height} cm` : "Not set"}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                        WEIGHT {profile.weight ? `${profile.weight} kg` : "Not set"}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-500 dark:text-amber-400">
                        FITNESS GOAL {profile.goal ? profile.goal : "Not yet set"}
                    </span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`
                        }
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                    </NavLink>
                ))}

                {/* Train with Trainer - links to trainer website */}
                <a
                    href={TRAINER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-2 border border-dashed border-primary/30"
                >
                    <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                    <span className="flex-1">Be a Trainer</span>
                    <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
            </nav>

            {/* Theme + Sign out */}
            <div className="p-3 border-t border-border space-y-1">
                <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs text-muted-foreground">Switch theme</span>
                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="sm" />
                    <span className="text-xs text-muted-foreground">{profile.theme === "dark" ? "Dark" : "Light"}</span>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
