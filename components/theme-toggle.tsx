"use client";

import { useState, useEffect } from "react";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors h-10 w-10 border border-input bg-background",
                className
            )}>
                <span className="sr-only">Toggle theme</span>
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={cn(
                "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 border border-input bg-background",
                className
            )}
        >
            <Sun className={cn(
                "h-[1.2rem] w-[1.2rem] transition-all",
                resolvedTheme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
            )} />
            <Moon className={cn(
                "absolute h-[1.2rem] w-[1.2rem] transition-all",
                resolvedTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
            )} />
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
