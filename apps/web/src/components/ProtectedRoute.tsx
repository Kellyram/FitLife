import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const LoadingSpinner = () => (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center transition-colors duration-300">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        >
            <Activity className="h-10 w-10 text-blue-500 dark:text-blue-400" />
        </motion.div>
    </div>
);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
};
