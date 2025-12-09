"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    categories: string[];
}

import { CustomSelect } from "@/components/ui/custom-select";

export function FilterBar({ categories }: FilterBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") || "date_asc";
    const currentCategory = searchParams.get("category") || "all";

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all" || value === "") {
            params.delete(name);
        } else {
            params.set(name, value);
        }
        return params.toString();
    };

    const handleSortChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("sort", value));
    };

    const handleCategoryChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("category", value));
    };

    const categoryOptions = [
        { label: "All Categories", value: "all" },
        ...categories.map(c => ({ label: c, value: c }))
    ];

    const sortOptions = [
        { label: "Oldest Renewal", value: "date_asc" },
        { label: "Newest Renewal", value: "date_desc" },
        { label: "Highest Price", value: "price_desc" },
        { label: "Lowest Price", value: "price_asc" },
        { label: "Name (A-Z)", value: "name_asc" },
        { label: "Name (Z-A)", value: "name_desc" },
    ];

    return (
        <div className="flex bg-muted/30 p-2 rounded-lg gap-4 items-center">
            <div className="flex items-center gap-2">
                <CustomSelect
                    icon={<Filter size={16} />}
                    value={currentCategory}
                    onChange={handleCategoryChange}
                    options={categoryOptions}
                    className="w-auto"
                    triggerClassName="border-none bg-transparent px-0 hover:bg-transparent w-auto"
                />
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-2">
                <CustomSelect
                    icon={<ArrowUpDown size={16} />}
                    value={currentSort}
                    onChange={handleSortChange}
                    options={sortOptions}
                    align="right"
                    className="w-auto"
                    triggerClassName="border-none bg-transparent px-0 hover:bg-transparent w-auto"
                />
            </div>
        </div>
    );
}
