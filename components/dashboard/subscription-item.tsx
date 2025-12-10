"use client";

import { useState, useRef, useEffect } from "react";
import { deleteSubscription } from "@/actions/subscription";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit, FileText, ExternalLink, Minus, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { EditSubscriptionForm } from "./edit-subscription-form";

interface SubscriptionItemProps {
    subscription: any;
    userCurrency?: string;
}

const getSafeLogoUrl = (url: string | null | undefined): string | undefined => {
    if (url && url.includes('logo.clearbit.com')) {
        const domain = url.split('/').pop();
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    return url || undefined;
};

export function SubscriptionItem({ subscription, userCurrency }: SubscriptionItemProps) {
    const [isSelected, setIsSelected] = useState(false);
    const [menuSide, setMenuSide] = useState<'left' | 'right'>('right');

    const symbol = subscription.currency === 'GDP' ? '£' : subscription.currency === 'EUR' ? '€' : '$';

    const [showSummary, setShowSummary] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const itemRef = useRef<HTMLDivElement>(null);

    const colors = ['bg-[#E50914]', 'bg-[#1DB954]', 'bg-[#00A8E1]', 'bg-primary', 'bg-purple-500', 'bg-orange-500'];
    const colorIndex = subscription.name ? subscription.name.length % colors.length : 0;
    const userInitial = subscription.name ? subscription.name.charAt(0).toUpperCase() : '?';

    const renewalDate = new Date(subscription.nextRenewalDate);
    const month = renewalDate.toLocaleString('default', { month: 'short' });
    const day = renewalDate.getDate();

    const handleClick = (e: React.MouseEvent) => {
        if (!itemRef.current) return;

        const rect = itemRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        if (e.clientX < centerX) {
            setMenuSide('left');
        } else {
            setMenuSide('right');
        }

        setIsSelected(true);
    };

    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
                setIsSelected(false);
            }
        };

        if (isSelected) {
            document.addEventListener('click', handleGlobalClick);
        }
        return () => document.removeEventListener('click', handleGlobalClick);
    }, [isSelected]);

    const handleDelete = async () => {
        await deleteSubscription(subscription.id);
        setShowDelete(false);
    };

    return (
        <div className="relative mb-2">
            {/* Main List Item */}
            <div
                ref={itemRef}
                onClick={handleClick}
                className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg transition-all cursor-pointer border gap-3 sm:gap-0 ${isSelected ? 'bg-muted border-primary/50' : 'border-transparent hover:bg-muted/50 hover:border-border/50'}`}
            >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {subscription.logoUrl ? (
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center p-1 overflow-hidden border border-border flex-shrink-0">
                            <img src={getSafeLogoUrl(subscription.logoUrl)} alt={subscription.name} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className={`w-10 h-10 rounded-full ${colors[colorIndex]} text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0`}>
                            {userInitial}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-semibold text-sm truncate">{subscription.name}</div>
                            {subscription.isShared && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded-sm flex-shrink-0">Shared</span>
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                            {subscription.category || "General"} • Every {subscription.frequencyValue} {subscription.frequencyUnit}
                        </div>
                    </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-1 sm:mt-0 pl-[3.5rem] sm:pl-0">
                    <div className="font-bold text-sm">
                        -{symbol}{parseFloat(subscription.price).toFixed(2)}
                    </div>
                    {subscription.isShared && subscription.sharedCount > 1 && (
                        <div className="text-[10px] text-muted-foreground hidden sm:block">
                            My Share: {symbol}{(subscription.price / subscription.sharedCount).toFixed(2)}
                        </div>
                    )}
                    <div className="text-xs text-muted-foreground sm:mt-1">{month} {day}</div>
                </div>
            </div>

            {/* Side Menu */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0, x: menuSide === 'right' ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`absolute top-0 bottom-0 flex items-center z-50 ${menuSide === 'right' ? '-right-40' : '-left-40'}`}
                    >
                        <div className="relative bg-popover text-popover-foreground border border-border shadow-md rounded-md p-2 min-w-[140px] flex flex-col gap-1">
                            {/* Arrow */}
                            <div
                                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-popover border-t border-r border-border rotate-45 ${menuSide === 'right' ? '-left-[7px] border-t-0 border-r-0 border-b border-l' : '-right-[7px]'}`}
                            />

                            <button onClick={(e) => { e.stopPropagation(); setShowSummary(true); }} className="w-full flex items-center px-3 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors font-medium cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" />
                                Summary
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowEdit(true); }} className="w-full flex items-center px-3 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors font-medium cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowDelete(true); }} className="w-full flex items-center px-3 py-1.5 text-sm rounded-sm hover:bg-destructive/10 hover:text-destructive transition-colors font-medium cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Summary Modal */}
            <Modal isOpen={showSummary} onClose={() => setShowSummary(false)} title={subscription.name}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
                        <div>
                            <div className="text-2xl font-bold">
                                {symbol}{subscription.price.toFixed(2)}
                            </div>
                            {subscription.isShared && subscription.sharedCount > 1 && (
                                <div className="text-sm text-muted-foreground">
                                    Split by {subscription.sharedCount} • My Share: {symbol}{(subscription.price / subscription.sharedCount).toFixed(2)}
                                </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                                Renews every {subscription.frequencyValue} {subscription.frequencyUnit}
                            </div>
                        </div>
                        {subscription.logoUrl ? (
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center p-1 overflow-hidden border border-border">
                                <img src={getSafeLogoUrl(subscription.logoUrl)} alt={subscription.name} className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className={`w-12 h-12 rounded-full ${colors[colorIndex]} text-white flex items-center justify-center font-bold text-xl`}>
                                {userInitial}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border border-border rounded-lg">
                            <label className="text-xs text-muted-foreground font-semibold uppercase">Category</label>
                            <p className="font-medium">{subscription.category || "None"}</p>
                        </div>
                        <div className="p-3 border border-border rounded-lg">
                            <label className="text-xs text-muted-foreground font-semibold uppercase">Next Renewal</label>
                            <p className="font-medium">{renewalDate.toLocaleDateString()}</p>
                        </div>
                    </div>

                    {subscription.website && (
                        <div className="p-3 border border-border rounded-lg flex items-center justify-between">
                            <div>
                                <label className="text-xs text-muted-foreground font-semibold uppercase">Website</label>
                                <p className="font-medium truncate max-w-[200px]">{subscription.website}</p>
                            </div>
                            <a href={subscription.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    )}

                    {subscription.description && (
                        <div className="p-3 border border-border rounded-lg">
                            <label className="text-xs text-muted-foreground font-semibold uppercase">Notes</label>
                            <p className="text-sm mt-1 text-muted-foreground">{subscription.description}</p>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title={`Edit ${subscription.name}`}>
                <EditSubscriptionForm subscription={subscription} onSuccess={() => setShowEdit(false)} />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Confirm Deletion">
                <div className="space-y-4">
                    <p className="text-muted-foreground">
                        Are you sure you want to delete <span className="font-semibold text-foreground">{subscription.name}</span>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowDelete(false)}
                            className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
