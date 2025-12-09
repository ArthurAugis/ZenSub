"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
    icon?: React.ReactNode;
    placeholder?: string;
    align?: "left" | "right";
    name?: string;
    className?: string;
    triggerClassName?: string;
}

export function CustomSelect({
    value,
    onChange,
    options,
    icon,
    placeholder,
    align = "left",
    name,
    className,
    triggerClassName
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(o => o.value === value)?.label || placeholder || value;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            {name && <input type="hidden" name={name} value={value} />}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors border border-input rounded-md px-3 py-2 bg-background hover:bg-muted/50 cursor-pointer w-full justify-between",
                    isOpen ? "text-foreground ring-2 ring-ring ring-offset-2 ring-offset-background" : "text-muted-foreground",
                    triggerClassName
                )}
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className={cn(!icon && "text-foreground")}>{selectedLabel}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={cn(
                            "absolute top-full mt-2 z-50 min-w-[180px] bg-background rounded-md border border-border shadow-xl p-1 min-w-full",
                            align === "left" ? "left-0" : "right-0"
                        )}
                    >
                        {options.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left cursor-pointer",
                                    option.value === value && "bg-accent/50 text-accent-foreground font-medium"
                                )}
                            >
                                {option.label}
                                {option.value === value && <Check className="h-3 w-3 ml-2 opacity-100" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
