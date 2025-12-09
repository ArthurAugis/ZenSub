"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "@/components/ui/custom-select";

interface Subscription {
    id: string;
    name: string;
    price: number;
    currency: string;
    nextRenewalDate: Date;
    frequencyUnit: string;
    frequencyValue: number;
    logoUrl?: string | null;
}

interface CalendarViewProps {
    subscriptions: Subscription[];
}

export function CalendarView({ subscriptions }: CalendarViewProps) {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const getEventsForMonth = () => {
        const events: { date: number; sub: Subscription }[] = [];
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0);

        subscriptions.forEach(sub => {
            const anchor = new Date(sub.nextRenewalDate);
            const freqVal = sub.frequencyValue || 1;
            const freqUnit = sub.frequencyUnit || 'Monthly';
            let cursor = new Date(anchor);



            if (cursor > monthEnd) return;

            if (freqUnit === 'Monthly') {
                const targetDay = anchor.getDate();

                if (targetDay <= daysInMonth) {
                    if (new Date(currentYear, currentMonth, targetDay) >= anchor) {
                        const monthDiff = (currentYear - anchor.getFullYear()) * 12 + (currentMonth - anchor.getMonth());
                        if (monthDiff >= 0 && monthDiff % freqVal === 0) {
                            events.push({ date: targetDay, sub });
                        }
                    }
                }
            } else if (freqUnit === 'Yearly') {
                if (cursor.getMonth() === currentMonth && cursor.getFullYear() >= anchor.getFullYear()) {
                    const yearDiff = currentYear - anchor.getFullYear();
                    if (yearDiff >= 0 && yearDiff % freqVal === 0 && cursor.getDate() <= daysInMonth) {
                        if (cursor.getDate() === anchor.getDate()) {
                            events.push({ date: cursor.getDate(), sub });
                        }
                    }
                }
            } else if (freqUnit === 'Weekly') {
                while (cursor <= monthEnd) {
                    if (cursor >= monthStart && cursor <= monthEnd) {
                        events.push({ date: cursor.getDate(), sub });
                    }
                    cursor.setDate(cursor.getDate() + (7 * freqVal));
                }
            } else if (freqUnit === 'Daily') {
                while (cursor <= monthEnd) {
                    if (cursor >= monthStart && cursor <= monthEnd) {
                        events.push({ date: cursor.getDate(), sub });
                    }
                    cursor.setDate(cursor.getDate() + freqVal);
                }
            }
        });

        return events;
    };

    const events = getEventsForMonth();

    const changeMonth = (delta: number) => {
        setViewDate(new Date(currentYear, currentMonth + delta, 1));
        setSelectedDate(null);
    };

    const getDailyTotal = (day: number) => {
        return events
            .filter(e => e.date === day)
            .reduce((acc, curr) => acc + curr.sub.price, 0);
    };

    return (
        <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                    <CustomSelect
                        value={currentMonth.toString()}
                        onChange={(val) => {
                            setViewDate(new Date(currentYear, parseInt(val), 1));
                            setSelectedDate(null);
                        }}
                        options={monthNames.map((m, i) => ({ label: m, value: i.toString() }))}
                        className="w-[140px]"
                    />
                    <CustomSelect
                        value={currentYear.toString()}
                        onChange={(val) => {
                            setViewDate(new Date(parseInt(val), currentMonth, 1));
                            setSelectedDate(null);
                        }}
                        options={Array.from({ length: 11 }, (_, i) => currentYear - 5 + i).map(y => ({ label: y.toString(), value: y.toString() }))}
                        className="w-[100px]"
                    />
                </div>
                <div className="flex gap-1">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-background rounded-md border border-transparent hover:border-border transition-all cursor-pointer">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => setViewDate(new Date())} className="px-3 text-sm font-medium hover:bg-background rounded-md border border-transparent hover:border-border transition-all cursor-pointer">
                        Today
                    </button>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-background rounded-md border border-transparent hover:border-border transition-all cursor-pointer">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Calendar Grid */}
                <div className="flex-1 p-4">
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-xs font-semibold text-muted-foreground py-2 uppercase">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 auto-rows-[100px]">
                        {/* Empty slots for start of month */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="p-2" />
                        ))}

                        {/* Days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const date = i + 1;
                            const dayEvents = events.filter(e => e.date === date);
                            const dailyTotal = getDailyTotal(date);
                            const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, date).toDateString();

                            return (
                                <div
                                    key={date}
                                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, date))}
                                    className={`
                                        border rounded-lg p-2 relative flex flex-col gap-1 transition-all cursor-pointer hover:border-primary/50
                                        ${isToday ? 'bg-primary/5 border-primary' : 'bg-background border-border'}
                                        ${selectedDate?.getDate() === date && selectedDate?.getMonth() === currentMonth ? 'ring-2 ring-primary' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>{date}</span>
                                        {dailyTotal > 0 && (
                                            <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-1.5 rounded-sm">
                                                ${dailyTotal.toFixed(0)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-1 content-start overflow-hidden">
                                        {dayEvents.slice(0, 3).map((e, idx) => (
                                            <div key={`${e.sub.id}-${idx}`} title={e.sub.name} className="w-5 h-5 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                                                {e.sub.logoUrl ? (
                                                    <img src={e.sub.logoUrl} alt={e.sub.name[0]} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[8px] font-bold">{e.sub.name[0]}</span>
                                                )}
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium border border-border">
                                                +{dayEvents.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Details (Responsive: bottom on mobile, right on desktop) */}
                <AnimatePresence>
                    {selectedDate && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border bg-muted/10 p-4"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                                <button onClick={() => setSelectedDate(null)} className="text-muted-foreground hover:text-foreground">
                                    <span className="sr-only">Close</span>
                                    &times;
                                </button>
                            </div>

                            <div className="space-y-3">
                                {events.filter(e => e.date === selectedDate.getDate()).length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No subscriptions renewing on this day.</p>
                                ) : (
                                    events.filter(e => e.date === selectedDate.getDate()).map((e, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
                                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                                                {e.sub.logoUrl ? (
                                                    <img src={e.sub.logoUrl} alt={e.sub.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-bold">{e.sub.name[0]}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{e.sub.name}</div>
                                                <div className="text-xs text-muted-foreground">Renews {e.sub.frequencyUnit}</div>
                                            </div>
                                            <div className="font-semibold">
                                                ${e.sub.price}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
