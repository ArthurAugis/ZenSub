"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { completeTutorial } from "@/actions/settings";

interface DashboardTutorialProps {
    hasSeenTutorial: boolean;
}

export function DashboardTutorial({ hasSeenTutorial }: DashboardTutorialProps) {
    useEffect(() => {
        if (!hasSeenTutorial) {
            const driverObj = driver({
                showProgress: true,
                animate: true,
                allowClose: true,
                doneBtnText: "Done",
                nextBtnText: "Next",
                prevBtnText: "Previous",
                progressText: "{{current}} of {{total}}",
                popoverClass: 'zensub-theme',
                steps: [
                    {
                        element: '#dashboard-stats',
                        popover: {
                            title: '<div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> Overview</div>',
                            description: 'Here you can see your total monthly spend, active subscriptions count, and days until next payment.'
                        }
                    },
                    {
                        element: '#dashboard-add-btn',
                        popover: {
                            title: '<div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Quick Add</div>',
                            description: 'Use this button to add a new subscription or create a new category.'
                        }
                    },
                    {
                        element: '#dashboard-filters',
                        popover: {
                            title: '<div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filters & Sort</div>',
                            description: 'Filter by category or sort your subscriptions by price, date, or name to find what you need.'
                        }
                    },
                    {
                        element: '#dashboard-subscription-list',
                        popover: {
                            title: '<div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> Subscription List</div>',
                            description: 'All your subscriptions are listed here. Click on an item to view details, edit, or share.'
                        }
                    },
                ],
                onDestroyStarted: async () => {
                    await completeTutorial().catch(console.error);
                    driverObj.destroy();
                },
            },
            );

            const timer = setTimeout(() => {
                driverObj.drive();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [hasSeenTutorial]);

    return (
        <style jsx global>{`
            .driver-overlay {
                opacity: 0.7 !important;
            }

            /* Main Popover Container */
            .driver-popover.zensub-theme {
                background-color: var(--card);
                color: var(--card-foreground);
                border: 1px solid var(--border);
                border-radius: calc(var(--radius) + 4px);
                padding: 1.5rem;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 1px var(--border);
                font-family: var(--font-sans);
                max-width: 350px;
            }

            /* Explicit Dark Mode Overrides ensure variables are picked up */
            html.dark .driver-popover.zensub-theme {
                background-color: #09090b;
                background-color: var(--card);
                color: #fafafa;
                color: var(--card-foreground);
                border-color: #27272a;
                border-color: var(--border);
            }
            
            .driver-popover.zensub-theme .driver-popover-title {
                color: var(--foreground);
                font-weight: 700;
                font-size: 1.125rem;
                letter-spacing: -0.025em;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .driver-popover.zensub-theme .driver-popover-description {
                color: var(--muted-foreground);
                font-size: 0.925rem;
                line-height: 1.5;
                margin-bottom: 1.5rem;
            }
            
            .driver-popover.zensub-theme .driver-popover-footer {
                margin-top: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.75rem;
            }

            .driver-popover.zensub-theme button {
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: inherit;
            }

            .driver-popover.zensub-theme .driver-popover-next-btn,
            .driver-popover.zensub-theme .driver-popover-done-btn {
                background-color: var(--primary) !important;
                color: var(--primary-foreground) !important;
                text-shadow: none !important;
                border: 1px solid var(--primary) !important;
                border-radius: var(--radius) !important;
                padding: 0.5rem 1rem !important;
                font-size: 0.875rem !important;
                font-weight: 500 !important;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            
            html.dark .driver-popover.zensub-theme .driver-popover-next-btn,
            html.dark .driver-popover.zensub-theme .driver-popover-done-btn {
                background-color: #fafafa !important;
                color: #18181b !important;
            }

            .driver-popover.zensub-theme .driver-popover-next-btn:hover,
            .driver-popover.zensub-theme .driver-popover-done-btn:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
            
            .driver-popover.zensub-theme .driver-popover-prev-btn {
                background-color: transparent !important;
                color: var(--muted-foreground) !important;
                border: 1px solid transparent !important;
                border-radius: var(--radius) !important;
                padding: 0.5rem 0.75rem !important;
                font-size: 0.875rem !important;
                font-weight: 500;
            }
            .driver-popover.zensub-theme .driver-popover-prev-btn:hover {
                color: var(--foreground) !important;
                background-color: var(--secondary) !important;
            }
            
            .driver-popover.zensub-theme .driver-popover-close-btn {
                top: 0.75rem;
                right: 0.75rem;
                color: var(--muted-foreground) !important;
                background: transparent !important;
                border: none !important;
                border-radius: 50%;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
            }
            .driver-popover.zensub-theme .driver-popover-close-btn:hover {
                color: var(--destructive) !important;
                background-color: var(--secondary) !important;
            }

            .driver-popover.zensub-theme .driver-popover-progress-text {
                color: var(--muted-foreground) !important;
                font-size: 0.75rem !important;
                font-weight: 500;
                margin-right: auto; 
            }

            /* Arrow color fixes for dark mode */
            html.dark .driver-popover.zensub-theme .driver-popover-arrow-side-left.driver-popover-arrow {
                border-left-color: #09090b;
                border-left-color: var(--card);
            }
            html.dark .driver-popover.zensub-theme .driver-popover-arrow-side-right.driver-popover-arrow {
                border-right-color: #09090b;
                border-right-color: var(--card);
            }
            html.dark .driver-popover.zensub-theme .driver-popover-arrow-side-top.driver-popover-arrow {
                border-top-color: #09090b;
                border-top-color: var(--card);
            }
            html.dark .driver-popover.zensub-theme .driver-popover-arrow-side-bottom.driver-popover-arrow {
                border-bottom-color: #09090b;
                border-bottom-color: var(--card);
            }
        `}</style>
    );
}
