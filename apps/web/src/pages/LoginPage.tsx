import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '@fitlife/ui';
import { Input } from '@fitlife/ui';
import { Label } from '@fitlife/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@fitlife/ui';
import { Checkbox } from '@fitlife/ui';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@fitlife/ui';
import { Activity, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const LoginPage = () => {
    const {
        signInWithEmail,
        signInWithGoogle,
        authError,
        clearError,
        user,
        resetPassword,
        resetEmailSent,
        clearResetEmailSent,
    } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(
        localStorage.getItem('fitlife_remember_me') === 'true'
    );
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    useEffect(() => {
        if (user) navigate('/dashboard', { replace: true });
    }, [user, navigate]);

    useEffect(() => {
        clearError();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await signInWithEmail(email, password, rememberMe);
        setIsLoading(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.15,
            }
        }
    };

    const fieldVariants = {
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        await signInWithGoogle();
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#060810] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Blue gradient backgrounds */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Activity className="h-7 w-7 text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        FitLife
                    </span>
                </div>

                <Card className="bg-zinc-900/60 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl text-white">Welcome back</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Error Alert */}
                        {authError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                            >
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {authError}
                            </motion.div>
                        )}

                        {/* Google Sign-In */}
                        <Button
                            variant="outline"
                            className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-11 rounded-xl"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </Button>

                        {/* Apple Sign-In */}
                        <Button
                            variant="outline"
                            className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-11 rounded-xl"
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.62-2.2.44-3.06-.4C3.65 16.18 4.38 9.35 9 9.08c1.2.06 2.04.7 2.75.73.98-.2 1.92-.77 2.97-.7 1.27.1 2.22.6 2.83 1.5-2.59 1.55-1.97 4.96.5 5.92-.58 1.55-1.35 3.08-2.96 3.76-1.12.48-1.97.32-3.04-.01zM12.03 9c-.12-2.14 1.55-3.92 3.63-4.08.27 2.42-2.17 4.25-3.63 4.08z" />
                            </svg>
                            Continue with Apple
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-zinc-900/80 px-2 text-zinc-500">or</span>
                            </div>
                        </div>

                        {/* Email/Password Form */}
                        <motion.form
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300 text-sm">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/50 h-11 rounded-xl transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/10"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={fieldVariants} className="space-y-2">
                                <Label htmlFor="password" className="text-zinc-300 text-sm">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/50 h-11 rounded-xl transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={fieldVariants}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberMe}
                                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="text-sm text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors"
                                        >
                                            Remember me
                                        </Label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResetEmail(email);
                                            setResetDialogOpen(true);
                                        }}
                                        className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline underline-offset-2"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={fieldVariants}>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white h-11 font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                        >
                                            <Activity className="h-5 w-5" />
                                        </motion.div>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </motion.div>
                        </motion.form>
                    </CardContent>
                    <CardFooter className="justify-center pb-6">
                        <p className="text-sm text-zinc-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                {/* Password Reset Dialog */}
                <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <DialogContent className="bg-zinc-900/90 backdrop-blur-2xl border-white/10 text-white rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Reset Password</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                {resetEmailSent
                                    ? "Check your email for password reset instructions."
                                    : "Enter your email address and we'll send you a reset link."
                                }
                            </DialogDescription>
                        </DialogHeader>

                        {!resetEmailSent ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reset-email" className="text-zinc-300">Email</Label>
                                    <Input
                                        id="reset-email"
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
                                    />
                                </div>
                                <Button
                                    onClick={() => resetPassword(resetEmail)}
                                    disabled={!resetEmail}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl"
                                >
                                    Send Reset Link
                                </Button>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="flex flex-col items-center justify-center py-8 space-y-4"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                                    className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center"
                                >
                                    <CheckCircle className="w-8 h-8 text-blue-400" />
                                </motion.div>
                                <p className="text-center text-zinc-300">
                                    Password reset email sent! Check your inbox.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setResetDialogOpen(false);
                                        clearResetEmailSent();
                                    }}
                                    className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl"
                                >
                                    Close
                                </Button>
                            </motion.div>
                        )}
                    </DialogContent>
                </Dialog>
            </motion.div>
        </div>
    );
};

export default LoginPage;
