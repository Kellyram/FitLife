import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/useThemeStore';
import { Avatar, AvatarFallback, AvatarImage } from '@fitlife/ui';
import { ThemeToggle } from '@fitlife/ui';
import {
    Activity,
    LayoutDashboard,
    Users,
    Dumbbell,
    LogOut,
    ChevronRight,
    Settings,
} from 'lucide-react';

interface TrainerLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/templates', label: 'Templates', icon: Dumbbell },
    { path: '/settings', label: 'Settings', icon: Settings },
];

export const TrainerLayout = ({ children }: TrainerLayoutProps) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useThemeStore();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
                {/* Logo */}
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-foreground">FitLife</h1>
                            <p className="text-xs text-muted-foreground">Trainer Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </button>
                        );
                    })}
                </nav>

                {/* Profile */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || undefined} />
                            <AvatarFallback className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-bold">
                                {user?.displayName?.charAt(0).toUpperCase() || 'T'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                                {user?.displayName || 'Trainer'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="sm" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors flex-1"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="flex flex-col flex-1">
                <header className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-foreground">FitLife Trainer</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle isDark={isDark} onToggle={toggleTheme} size="sm" />
                            <button
                                onClick={handleLogout}
                                className="text-zinc-500 dark:text-zinc-400 hover:text-foreground p-2"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Mobile bottom nav */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-50">
                    <div className="flex justify-around py-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`flex flex-col items-center gap-1 px-4 py-1 ${
                                        isActive
                                            ? 'text-orange-500'
                                            : 'text-zinc-500 dark:text-zinc-400'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-auto pb-20 md:pb-0">
                    {children}
                </main>
            </div>
        </div>
    );
};
