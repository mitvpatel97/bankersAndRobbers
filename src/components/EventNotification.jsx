'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, XCircle, Skull, Eye, Zap, Crown } from 'lucide-react';
import clsx from 'clsx';

/**
 * EventNotification Component - Toast-style notifications for game events
 * Inspired by Secret Hitler's event bar system
 */
export function EventNotification({ events }) {
    const [visibleEvents, setVisibleEvents] = useState([]);

    useEffect(() => {
        if (events && events.length > 0) {
            const latestEvent = events[events.length - 1];
            const eventWithId = { ...latestEvent, id: Date.now() + Math.random() };
            setVisibleEvents(prev => [...prev, eventWithId]);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                setVisibleEvents(prev => prev.filter(e => e.id !== eventWithId.id));
            }, 5000);
        }
    }, [events]);

    const getEventStyle = (type) => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle2,
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/30',
                    text: 'text-green-400',
                    iconBg: 'bg-green-500/20'
                };
            case 'error':
            case 'danger':
                return {
                    icon: XCircle,
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/30',
                    text: 'text-red-400',
                    iconBg: 'bg-red-500/20'
                };
            case 'warning':
                return {
                    icon: AlertTriangle,
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/30',
                    text: 'text-yellow-400',
                    iconBg: 'bg-yellow-500/20'
                };
            case 'banker':
                return {
                    icon: CheckCircle2,
                    bg: 'bg-banker/10',
                    border: 'border-banker/30',
                    text: 'text-banker',
                    iconBg: 'bg-banker/20'
                };
            case 'robber':
                return {
                    icon: Skull,
                    bg: 'bg-robber/10',
                    border: 'border-robber/30',
                    text: 'text-robber',
                    iconBg: 'bg-robber/20'
                };
            case 'executive':
                return {
                    icon: Zap,
                    bg: 'bg-gold/10',
                    border: 'border-gold/30',
                    text: 'text-gold',
                    iconBg: 'bg-gold/20'
                };
            case 'election':
                return {
                    icon: Crown,
                    bg: 'bg-purple-500/10',
                    border: 'border-purple-500/30',
                    text: 'text-purple-400',
                    iconBg: 'bg-purple-500/20'
                };
            default:
                return {
                    icon: Info,
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/30',
                    text: 'text-blue-400',
                    iconBg: 'bg-blue-500/20'
                };
        }
    };

    return (
        <div className="fixed top-20 right-6 z-[100] space-y-3 pointer-events-none max-w-md">
            <AnimatePresence>
                {visibleEvents.map((event, index) => {
                    const style = getEventStyle(event.type);
                    const EventIcon = style.icon;

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={clsx(
                                "pointer-events-auto backdrop-blur-lg border rounded-lg p-4 shadow-2xl flex items-start gap-4",
                                style.bg,
                                style.border
                            )}
                        >
                            <div className={clsx("p-2 rounded-full", style.iconBg)}>
                                <EventIcon className={clsx("w-5 h-5", style.text)} />
                            </div>

                            <div className="flex-1">
                                {event.title && (
                                    <h4 className={clsx("font-display font-bold text-sm tracking-wider mb-1", style.text)}>
                                        {event.title}
                                    </h4>
                                )}
                                <p className="text-sm text-white/90 font-mono">
                                    {event.message}
                                </p>
                            </div>

                            <button
                                onClick={() => setVisibleEvents(prev => prev.filter(e => e.id !== event.id))}
                                className="text-white/40 hover:text-white/80 transition-colors"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

/**
 * Floating event badge for inline game updates
 */
export function EventBadge({ type, children, className }) {
    const getTypeStyle = () => {
        switch (type) {
            case 'banker':
                return 'bg-banker/20 text-banker border-banker/30';
            case 'robber':
                return 'bg-robber/20 text-robber border-robber/30';
            case 'gold':
                return 'bg-gold/20 text-gold border-gold/30';
            default:
                return 'bg-white/10 text-white border-white/20';
        }
    };

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={clsx(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest",
                getTypeStyle(),
                className
            )}
        >
            {children}
        </motion.span>
    );
}
