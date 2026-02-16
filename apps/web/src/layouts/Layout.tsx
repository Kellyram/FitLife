import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, NotebookPen, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataSync } from '../components/DataSync';

const Navbar = () => {
    const location = useLocation();

    const links = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/workout', icon: NotebookPen, label: 'Workouts' },
        { to: '/exercises', icon: Activity, label: 'Exercises' },
    ];

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex gap-8 shadow-2xl z-50">
            {links.map(({ to, icon: Icon, label }) => {
                const isActive = location.pathname === to;
                return (
                    <Link key={to} to={to} className="relative flex flex-col items-center group">
                        <span className={`p-2 rounded-full transition-colors duration-300 ${isActive ? 'text-blue-400 bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <Icon size={24} />
                        </span>
                        {isActive && (
                            <motion.span
                                layoutId="nav-pill"
                                className="absolute -bottom-1 w-1 h-1 bg-blue-400 rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="sr-only">{label}</span>
                    </Link>
                )
            })}
        </nav>
    );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 overflow-x-hidden">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/0 to-gray-900/0 pointer-events-none" />
            <main className="container mx-auto px-4 pb-24 pt-8 relative z-10">
                {children}
            </main>
            <Navbar />
            <DataSync />
        </div>
    );
}
