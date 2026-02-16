import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@fitlife/shared"

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "peer h-5 w-5 shrink-0 rounded-md border-2 bg-white/5 border-white/10",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500/50",
            "data-[state=checked]:shadow-[0_0_10px_rgba(59,130,246,0.3)]",
            "hover:bg-white/10 hover:border-white/20",
            "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            className
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-white")}
        >
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
            >
                <Check className="h-4 w-4" />
            </motion.div>
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
