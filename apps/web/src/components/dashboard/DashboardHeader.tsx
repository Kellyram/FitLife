import { useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@fitlife/ui"
import { Button } from "@fitlife/ui"
import { ThemeToggle } from "@fitlife/ui"
import { LogOut, Bell } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "@/store/useUserStore"

export function DashboardHeader() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const { profile, toggleTheme } = useUserStore()
    const isDark = profile.theme === 'dark'

    const handleLogout = useCallback(async () => {
        await logout()
        navigate("/login")
    }, [logout, navigate])

    return (
        <header className="relative z-10 px-4 pt-4 pb-0">
            <div className="flex items-center justify-between max-w-md mx-auto">
                <span className="text-lg font-bold text-white font-display tracking-tight">
                    Fit<span className="text-blue-400">Life</span>
                </span>
                <div className="flex items-center gap-1">
                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="sm" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-white/10 h-9 w-9 rounded-xl"
                    >
                        <Bell className="h-4.5 w-4.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-white/70 hover:text-white hover:bg-white/10 h-9 w-9 rounded-xl"
                        title="Log out"
                    >
                        <LogOut className="h-4.5 w-4.5" />
                    </Button>
                    <div className="ring-2 ring-blue-500/40 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || "https://i.pravatar.cc/150?u=fitlife"} alt={user?.displayName || "User"} />
                            <AvatarFallback className="bg-blue-500/20 text-blue-400 text-sm font-bold">
                                {user?.displayName?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    )
}
