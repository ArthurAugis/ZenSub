"use client";

import { LogOut, Calendar, Bell, Settings, PieChart, Menu, X, Plus, FolderPlus } from "lucide-react";
import { AddSubscriptionForm } from "@/components/dashboard/add-subscription-form";
import { AddCategoryForm } from "@/components/dashboard/add-category-form";
import { Modal } from "@/components/ui/modal";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
    user: any;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [isAddSubscriptionOpen, setIsAddSubscriptionOpen] = useState(false);
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <>
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Logo and Mobile Menu Toggle */}
                    <div className="flex items-center gap-3">
                        <button onClick={toggleMenu} className="md:hidden p-2 text-muted-foreground hover:text-foreground cursor-pointer">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform">Z</div>
                            <span className="text-xl font-bold tracking-tight">ZenSub</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <nav className="flex items-center gap-1 mr-4">
                            <Link href="/dashboard/analytics" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Analytics">
                                <PieChart size={18} />
                                <span className="hidden lg:inline">Analytics</span>
                            </Link>
                            <Link href="/dashboard/calendar" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Calendar">
                                <Calendar size={18} />
                                <span className="hidden lg:inline">Calendar</span>
                            </Link>

                        </nav>

                        <div className="h-6 w-px bg-border mx-2" />

                        {/* Add Button Dropdown */}
                        <div id="dashboard-add-btn" className="relative">
                            <button
                                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                                onBlur={() => setTimeout(() => setIsAddMenuOpen(false), 200)}
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                                title="Add New..."
                            >
                                <Plus size={20} />
                            </button>

                            {isAddMenuOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-background border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => { setIsAddSubscriptionOpen(true); setIsAddMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <Plus size={16} className="text-muted-foreground" />
                                        <span>Add Subscription</span>
                                    </button>
                                    <button
                                        onClick={() => { setIsAddCategoryOpen(true); setIsAddMenuOpen(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <FolderPlus size={16} className="text-muted-foreground" />
                                        <span>Add Category</span>
                                    </button>
                                    <div className="h-px bg-border/50 mx-2 my-1" />
                                    <Link
                                        href="/dashboard/notifications"
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
                                        onClick={() => setIsAddMenuOpen(false)}
                                    >
                                        <Bell size={16} className="text-muted-foreground" />
                                        <span>Notifications</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative ml-2">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors border border-border overflow-hidden cursor-pointer"
                            >
                                {user?.image ? (
                                    <img src={user.image} alt="User" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-sm">{userInitial}</span>
                                )}
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-background border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 border-b border-border bg-muted/30">
                                        <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard/settings"
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
                                    >
                                        <Settings size={16} className="text-muted-foreground" />
                                        <span>Settings</span>
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-colors cursor-pointer"
                                    >
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Actions (Visible when menu closed) */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setIsAddSubscriptionOpen(true)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-border bg-card absolute w-full left-0 top-16 shadow-lg animate-in slide-in-from-top-2">
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-lg border border-border/50">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm overflow-hidden">
                                    {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : userInitial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/dashboard/analytics" className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                    <PieChart size={24} className="mb-2 text-primary" />
                                    <span className="text-sm font-medium">Analytics</span>
                                </Link>
                                <Link href="/dashboard/calendar" className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                    <Calendar size={24} className="mb-2 text-primary" />
                                    <span className="text-sm font-medium">Calendar</span>
                                </Link>

                            </div>

                            <div className="space-y-2">
                                <Link href="/dashboard/notifications" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-md transition-colors">
                                    <Bell size={20} />
                                    <span className="font-medium">Notifications</span>
                                </Link>
                                <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-muted rounded-md transition-colors">
                                    <Settings size={20} />
                                    <span className="font-medium">Settings</span>
                                </Link>
                            </div>

                            <div className="space-y-2 pt-4 border-t border-border">
                                <button onClick={() => { setIsAddSubscriptionOpen(true); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-primary cursor-pointer">
                                    <Plus size={20} />
                                    <span className="font-medium">Add Subscription</span>
                                </button>
                                <button onClick={() => { setIsAddCategoryOpen(true); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors cursor-pointer">
                                    <FolderPlus size={20} />
                                    <span className="font-medium">Add Category</span>
                                </button>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Modals */}
            <Modal
                isOpen={isAddSubscriptionOpen}
                onClose={() => setIsAddSubscriptionOpen(false)}
                title="Add New Subscription"
            >
                <AddSubscriptionForm onSuccess={() => setIsAddSubscriptionOpen(false)} />
            </Modal>

            <Modal
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                title="Create New Category"
            >
                <AddCategoryForm onSuccess={() => setIsAddCategoryOpen(false)} />
            </Modal>
        </>
    );
}
