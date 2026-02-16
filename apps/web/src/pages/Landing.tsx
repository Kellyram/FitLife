import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, Play, MapPin, Phone, Mail, ChevronRight, Heart, Zap, Target, Brain, Dumbbell, Apple, BarChart3, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState, memo } from 'react';
import { useUserStore } from '@/store/useUserStore';

/* ───────────── Unsplash images ───────────── */
const IMAGES = {
    training: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
    nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    recovery: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    mindset: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    community: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    transform1: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
    transform2: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80',
    framework: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    about1: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
};

/* ───────────── Fade-in animation wrapper ───────────── */
const FadeIn = memo(({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
));

/* ───────────── Animated Theme Toggle ───────────── */
const LandingThemeToggle = () => {
    const { profile, toggleTheme } = useUserStore();
    const isDark = profile.theme === 'dark';
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggle = () => {
        setIsAnimating(true);
        toggleTheme();
        setTimeout(() => setIsAnimating(false), 600);
    };

    return (
        <motion.button
            onClick={handleToggle}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait">
                {isDark ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Sun className="h-4 w-4 text-amber-400" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Moon className="h-4 w-4 text-blue-500" />
                    </motion.div>
                )}
            </AnimatePresence>
            {isAnimating && (
                <motion.div
                    className="absolute inset-0 rounded-xl border-2 border-blue-400/50"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            )}
        </motion.button>
    );
};

/* ═══════════════════════════ LANDING PAGE ═══════════════════════════ */
const Landing = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#060810] text-zinc-900 dark:text-white overflow-x-hidden">
            {/* ─── NAVBAR ─── */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <span className="text-xl font-bold font-display text-gradient-blue">FitLife</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500 dark:text-zinc-400">
                        <a href="#services" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Services</a>
                        <a href="#results" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Results</a>
                        <a href="#framework" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Framework</a>
                        <a href="#tracking" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Tracking</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <LandingThemeToggle />
                        <Link to="/login" className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors hidden sm:block">
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── HERO SECTION ─── */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-screen flex items-center justify-center pt-20"
            >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 dark:from-blue-900/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-blue-200/30 dark:bg-blue-600/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-200/30 dark:bg-cyan-500/5 blur-[100px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-xs text-zinc-500 dark:text-zinc-400 mb-8">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
                            Trusted by 7,500+ athletes worldwide
                        </div>

                        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-display tracking-tight leading-[0.9] mb-6">
                            <span className="text-gradient-white">Fit</span>
                            <span className="mx-3 sm:mx-5 inline-block">
                                <Activity className="h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16 text-blue-500 dark:text-blue-400 inline-block" />
                            </span>
                            <span className="text-gradient-blue">Life</span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10">
                            Our journey is more about reshaping lifestyles,
                            discovering what's possible, and experiencing a
                            <span className="text-zinc-900 dark:text-white font-medium"> health transformation</span> like never before.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/signup"
                                className="group px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 flex items-center gap-2"
                            >
                                Start Your Journey
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#services"
                                className="px-8 py-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-base font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
                            >
                                Explore Services
                            </a>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                >
                    <div className="w-6 h-10 rounded-full border border-zinc-300 dark:border-white/20 flex items-start justify-center p-2">
                        <div className="w-1 h-2 bg-blue-500 dark:bg-blue-400 rounded-full" />
                    </div>
                </motion.div>
            </motion.section>

            {/* ─── STATS BAR ─── */}
            <section className="py-12 border-y border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '7,500+', label: 'Lives Transformed' },
                            { value: '10+', label: 'Years of Excellence' },
                            { value: '4.9', label: 'Average Rating' },
                            { value: '98%', label: 'Client Retention' },
                        ].map((stat, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="text-center">
                                    <p className="text-3xl sm:text-4xl font-bold font-display text-gradient-blue">{stat.value}</p>
                                    <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── BENTO GRID SERVICES ─── */}
            <section id="services" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-3">What We Offer</p>
                            <h2 className="text-3xl sm:text-5xl font-bold font-display text-gradient-white">
                                A decade of helping<br />
                                <span className="text-gradient-blue">people improve health</span>
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { img: IMAGES.training, icon: Dumbbell, iconColor: 'text-blue-500 dark:text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20', title: 'Training & Nutrition', desc: 'Personalized training programs paired with scientific nutrition plans designed for your body and goals.', tall: true },
                            { img: IMAGES.mindset, icon: Target, iconColor: 'text-cyan-600 dark:text-cyan-400', iconBg: 'bg-cyan-500/10 border-cyan-500/20', title: 'SMART Goals', desc: 'Set specific, measurable, achievable milestones for every phase.' },
                            { img: IMAGES.recovery, icon: Heart, iconColor: 'text-teal-600 dark:text-teal-400', iconBg: 'bg-teal-500/10 border-teal-500/20', title: 'Recovery & Wellness', desc: 'Optimize rest, manage stress, and prevent injury with guided recovery.' },
                            { img: IMAGES.nutrition, icon: Apple, iconColor: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20', title: 'Meal Planning', desc: 'Balanced, delicious meal plans tailored to your macros and taste.' },
                            { img: IMAGES.community, icon: Brain, iconColor: 'text-blue-500 dark:text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20', title: 'AI-Powered Insights', desc: 'Smart analytics that adapt your plan based on real-time progress.' },
                        ].map((card, i) => (
                            <FadeIn key={i} delay={0.1 + i * 0.05} className={card.tall ? 'lg:row-span-2' : ''}>
                                <div className={`group relative ${card.tall ? 'h-full min-h-[400px]' : 'min-h-[240px]'} rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#0c0e14] hover:border-blue-300 dark:hover:border-blue-500/30 transition-all duration-500`}>
                                    <img src={card.img} alt={card.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#060810] dark:via-[#060810]/60 dark:to-transparent" />
                                    <div className="relative h-full flex flex-col justify-end p-6">
                                        <div className={`p-2.5 w-fit rounded-xl ${card.iconBg} border mb-3`}>
                                            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                                        </div>
                                        <h3 className={`${card.tall ? 'text-xl' : 'text-lg'} font-bold font-display mb-1`}>{card.title}</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{card.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PARTNERS ─── */}
            <section className="py-16 border-y border-zinc-200 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn>
                        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-30 dark:opacity-40">
                            {['SENSE', 'SMART', 'HART', 'FITTECH', 'VITALIX'].map((name, i) => (
                                <span key={i} className="text-lg sm:text-xl font-bold font-display tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{name}</span>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ─── LIVES TRANSFORMED ─── */}
            <section id="results" className="py-24 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 dark:from-blue-900/10 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <FadeIn>
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 text-center lg:text-left">
                                <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-3">Proven Results</p>
                                <h2 className="text-4xl sm:text-6xl font-bold font-display leading-tight mb-6">
                                    <span className="text-gradient-blue">400+</span> Lives<br />
                                    <span className="text-gradient-white">Transformed</span>
                                </h2>
                                <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-lg mb-8">
                                    Real people, real results. Our community has achieved incredible transformations through discipline, science, and unwavering support.
                                </p>
                                <Link
                                    to="/signup"
                                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    See all stories <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5 shadow-lg dark:shadow-none">
                                    <img src={IMAGES.transform1} alt="Transformation" loading="lazy" className="h-64 w-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5 shadow-lg dark:shadow-none mt-8">
                                    <img src={IMAGES.transform2} alt="Transformation" loading="lazy" className="h-64 w-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ─── FUTURE READY FRAMEWORK ─── */}
            <section id="framework" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn>
                        <div className="relative rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/5 min-h-[500px] flex items-center shadow-2xl dark:shadow-none">
                            <img src={IMAGES.framework} alt="Framework" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-[#060810] dark:via-[#060810]/80 dark:to-transparent" />
                            <div className="relative z-10 p-8 sm:p-16 max-w-2xl">
                                <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-4">Built Different</p>
                                <h2 className="text-4xl sm:text-6xl font-bold font-display leading-tight mb-6">
                                    <span className="text-gradient-white">Future-ready</span><br />
                                    <span className="text-gradient-blue">Framework</span>
                                </h2>
                                <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-8">
                                    A data-driven, AI-enhanced fitness framework that evolves with you. Combining cutting-edge science with real-world coaching to build habits that last.
                                </p>
                                <Link
                                    to="/signup"
                                    className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40"
                                >
                                    Learn More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ─── WHY CHOOSE US + VIDEO ─── */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/40 dark:from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">Why FitLife</p>
                            <h2 className="text-3xl sm:text-5xl font-bold font-display">
                                <span className="text-gradient-white">This is </span>
                                <span className="text-gradient-blue">why we stand out</span>
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {[
                                { icon: Zap, title: 'Personalized AI Coaching', desc: 'Every recommendation adapts to your progress, injuries, and goals in real-time.' },
                                { icon: BarChart3, title: 'Quantified Progress', desc: 'Track every macro, every rep, every milestone with our precision dashboard.' },
                                { icon: Heart, title: 'Holistic Wellness', desc: 'We don\'t just build muscles — we optimize sleep, stress, and mental clarity.' },
                            ].map((feature, i) => (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.04] hover:border-blue-300 dark:hover:border-blue-500/20 transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                                                <feature.icon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold font-display mb-1">{feature.title}</h3>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>

                        <FadeIn delay={0.2}>
                            <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5 h-full min-h-[400px] group cursor-pointer shadow-xl dark:shadow-none">
                                <img src={IMAGES.about1} alt="About us" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-50 group-hover:opacity-70 dark:group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#060810] via-transparent to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-20 h-20 rounded-full bg-blue-600/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-blue-600/30"
                                    >
                                        <Play className="h-8 w-8 text-white ml-1" />
                                    </motion.div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Watch our story</p>
                                    <h3 className="text-xl font-bold font-display">Behind the transformation</h3>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ─── FIND US / CONTACT ─── */}
            <section className="py-24 border-t border-zinc-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-3">Get In Touch</p>
                            <h2 className="text-3xl sm:text-5xl font-bold font-display text-gradient-white">
                                Find us and<br />Interventions
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: MapPin, title: 'Visit Us', info: 'Quadrant Park, 1st Floor Building 5, Off Great East Rd, Lusaka 10101', sub: 'Mon - Sat: 6AM - 10PM' },
                            { icon: Phone, title: 'Call Us', info: '+260977107573', sub: '24/7 Support Available' },
                            { icon: Mail, title: 'Email Us', info: 'hello@fitlife.app', sub: 'Response within 2 hours' },
                        ].map((contact, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="p-8 rounded-3xl border border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] hover:bg-zinc-100 dark:hover:bg-white/[0.04] hover:border-blue-300 dark:hover:border-blue-500/20 transition-all duration-300 text-center">
                                    <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
                                        <contact.icon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold font-display mb-2">{contact.title}</h3>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{contact.info}</p>
                                    <p className="text-xs text-zinc-500 mt-1">{contact.sub}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── TRACKING RING / CTA ─── */}
            <section id="tracking" className="py-24 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/50 dark:from-blue-900/15 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <FadeIn>
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 flex justify-center">
                                <div className="relative">
                                    <svg width="280" height="280" viewBox="0 0 280 280">
                                        <circle cx="140" cy="140" r="120" stroke="rgba(59,130,246,0.1)" strokeWidth="8" fill="transparent" />
                                        <motion.circle cx="140" cy="140" r="120" stroke="url(#blueGradient)" strokeWidth="8" fill="transparent" strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 120} initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                                            whileInView={{ strokeDashoffset: 2 * Math.PI * 120 * 0.22 }} viewport={{ once: true }}
                                            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} transform="rotate(-90 140 140)" />
                                        <circle cx="140" cy="140" r="100" stroke="rgba(34,211,238,0.1)" strokeWidth="6" fill="transparent" />
                                        <motion.circle cx="140" cy="140" r="100" stroke="url(#cyanGradient)" strokeWidth="6" fill="transparent" strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 100} initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                                            whileInView={{ strokeDashoffset: 2 * Math.PI * 100 * 0.35 }} viewport={{ once: true }}
                                            transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} transform="rotate(-90 140 140)" />
                                        <circle cx="140" cy="140" r="80" stroke="rgba(20,184,166,0.1)" strokeWidth="5" fill="transparent" />
                                        <motion.circle cx="140" cy="140" r="80" stroke="url(#tealGradient)" strokeWidth="5" fill="transparent" strokeLinecap="round"
                                            strokeDasharray={2 * Math.PI * 80} initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                                            whileInView={{ strokeDashoffset: 2 * Math.PI * 80 * 0.18 }} viewport={{ once: true }}
                                            transition={{ duration: 2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }} transform="rotate(-90 140 140)" />
                                        <defs>
                                            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#60A5FA" /></linearGradient>
                                            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#67E8F9" /></linearGradient>
                                            <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#14B8A6" /><stop offset="100%" stopColor="#5EEAD4" /></linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold font-display">78%</span>
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Goal Progress</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 text-center lg:text-left">
                                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">Smart Tracking</p>
                                <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight mb-6">
                                    <span className="text-gradient-white">Track</span>{' '}
                                    <span className="text-gradient-blue">everything</span>
                                </h2>
                                <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-8 max-w-lg">
                                    Monitor calories, macros, workouts, sleep, and body metrics — all in one beautiful dashboard. Let the data guide your journey.
                                </p>
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {[
                                        { label: 'Calories', value: '1,850' },
                                        { label: 'Steps', value: '8,400' },
                                        { label: 'Sleep', value: '7.5h' },
                                    ].map((metric, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/5 text-center">
                                            <p className="text-xl font-bold font-display">{metric.value}</p>
                                            <p className="text-xs text-zinc-500">{metric.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    to="/signup"
                                    className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25"
                                >
                                    Start Tracking <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="py-16 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#040608]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                        <div>
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <Activity className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                </div>
                                <span className="text-lg font-bold font-display text-gradient-blue">FitLife</span>
                            </div>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Transforming lives through science-backed fitness and nutrition since 2016.
                            </p>
                        </div>
                        {[
                            { title: 'Product', links: ['Dashboard', 'Workouts', 'Nutrition', 'Community'] },
                            { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
                            { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy', 'GDPR'] },
                        ].map((col, i) => (
                            <div key={i}>
                                <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
                                <ul className="space-y-2.5">
                                    {col.links.map((link, j) => (
                                        <li key={j}>
                                            <a href="#" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 border-t border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">&copy; 2026 FitLife. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            {['Twitter', 'Instagram', 'YouTube', 'LinkedIn'].map((social, i) => (
                                <a key={i} href="#" className="text-xs text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">{social}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
