import { memo } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { LayoutDashboard, User, Dumbbell, Apple } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/workouts", icon: Dumbbell, label: "Workouts" },
    { to: "/nutrition", icon: Apple, label: "Nutrition" },
    { to: "/profile", icon: User, label: "Profile" },
]

export const BottomNav = memo(function BottomNav() {
    const location = useLocation()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 lg:hidden">
            <div className="mx-auto max-w-md flex items-center justify-around py-2 px-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-blue-500"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <item.icon
                                className={`h-5 w-5 transition-colors duration-200 ${isActive ? "text-blue-500" : "text-muted-foreground"
                                    }`}
                            />
                            <span
                                className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? "text-blue-500" : "text-muted-foreground"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </NavLink>
                    )
                })}
            </div>
        </nav>
    )
})
