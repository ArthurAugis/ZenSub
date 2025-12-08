"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { AddCategoryForm } from "./add-category-form";

export function AddCategoryButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-9 px-4 py-2"
            >
                <FolderPlus className="mr-2 h-4 w-4" />
                New Category
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create New Category"
            >
                <AddCategoryForm onSuccess={() => setIsOpen(false)} />
            </Modal>
        </>
    );
}
