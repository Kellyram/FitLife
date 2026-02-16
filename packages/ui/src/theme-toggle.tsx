import * as React from "react"
import { cn } from "@fitlife/shared"

interface ThemeToggleProps {
    isDark: boolean;
    onToggle: () => void;
    className?: string;
    size?: 'sm' | 'md';
}

export function ThemeToggle({ isDark, onToggle, className, size = 'md' }: ThemeToggleProps) {
    const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';

    return (
        <button
            onClick={onToggle}
            className={cn(
                "inline-flex items-center justify-center rounded-xl transition-colors duration-200",
                isDark
                    ? "text-zinc-400 hover:text-yellow-400 hover:bg-white/10"
                    : "text-zinc-600 hover:text-orange-500 hover:bg-zinc-100",
                btnSize,
                className
            )}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                // Sun icon (switch to light)
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={iconSize}
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                </svg>
            ) : (
                // Moon icon (switch to dark)
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={iconSize}
                >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
            )}
        </button>
    );
}
