'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { BankerIcon, RobberIcon, MastermindIcon, NoiseOverlay, CitySkyline, VHSOverlay, GlowingOrb, ShieldIcon } from './GameAssets';
import { ScrollText, Eye, Skull, Vote, Search, Zap, AlertTriangle, Trophy } from 'lucide-react';

export default function GameBoard({ game }) {
    const logContainerRef = useRef(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [game.logs]);

    // Get executive power icon for robber track slots
    const getRobberPowerIcon = (slotIdx, playerCount) => {
        const count = slotIdx + 1;

        if (count === 6) return <RobberIcon className="w-6 h-6 text-midnight" />;

        if (playerCount <= 6) {
            if (count === 3) return <Eye className="w-5 h-5 text-midnight" />;
            if (count === 4) return <Skull className="w-5 h-5 text-midnight" />;
            if (count === 5) return <Skull className="w-5 h-5 text-midnight" />;
        } else if (playerCount <= 8) {
            if (count === 2) return <Search className="w-5 h-5 text-midnight" />;
            if (count === 3) return <Vote className="w-5 h-5 text-midnight" />;
            if (count === 4) return <Skull className="w-5 h-5 text-midnight" />;
            if (count === 5) return <Skull className="w-5 h-5 text-midnight" />;
        } else {
            if (count === 1) return <Search className="w-5 h-5 text-midnight" />;
            if (count === 2) return <Search className="w-5 h-5 text-midnight" />;
            if (count === 3) return <Vote className="w-5 h-5 text-midnight" />;
            if (count === 4) return <Skull className="w-5 h-5 text-midnight" />;
            if (count === 5) return <Skull className="w-5 h-5 text-midnight" />;
        }
        return null;
    };

    // Game Over Screen
    if (game.status === 'GAME_OVER') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
                <VHSOverlay />
                <div className="fixed inset-0 z-0">
                    <CitySkyline className="absolute bottom-0 left-0 right-0 h-[60%] opacity-30" />
                    <GlowingOrb color={game.winner === 'banker' ? 'cyan' : 'pink'} size="xl" className="absolute top-1/4 left-1/2 -translate-x-1/2" />
                </div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 text-center space-y-8 max-w-2xl"
                >
                    <Trophy className={clsx(
                        "w-24 h-24 mx-auto",
                        game.winner === 'banker' ? "text-banker glow-cyan" : "text-robber glow-pink"
                    )} />

                    <h1 className={clsx(
                        "text-6xl font-display font-bold tracking-widest",
                        game.winner === 'banker' ? "neon-text-cyan" : "neon-text-pink"
                    )}>
                        {game.winner === 'banker' ? 'VAULT SECURED' : 'HEIST COMPLETE'}
                    </h1>

                    <p className="text-2xl font-mono text-text-secondary tracking-wider">
                        {game.winReason}
                    </p>

                    <div className="pt-8 border-t border-white/10">
                        <p className="text-sm font-mono text-text-muted uppercase tracking-widest mb-4">Final Score</p>
                        <div className="flex justify-center gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-banker neon-text-cyan">{game.policies.banker}</div>
                                <div className="text-xs text-text-muted font-mono mt-1">SECURITY</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-robber neon-text-pink">{game.policies.robber}</div>
                                <div className="text-xs text-text-muted font-mono mt-1">HEIST</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 relative overflow-hidden">
            {/* Background */}
            <VHSOverlay />
            <div className="fixed inset-0 z-0">
                <CitySkyline className="absolute bottom-0 left-0 right-0 h-[40%] opacity-25" />
                <GlowingOrb color="pink" size="lg" className="absolute top-20 left-10" />
                <GlowingOrb color="cyan" size="xl" className="absolute bottom-40 right-20" />
            </div>
            <NoiseOverlay />

            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

                {/* LEFT: Game Status & Tracks */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Header Info */}
                    <div className="card-noir p-4 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="bg-midnight/60 border border-gold/30 px-4 py-2">
                                <span className="text-[10px] text-text-muted uppercase tracking-widest block font-mono">Operation</span>
                                <span className="text-xl font-mono text-gold font-bold tracking-[0.2em] neon-text-orange">{game.roomCode}</span>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div>
                                <span className="text-[10px] text-text-muted uppercase tracking-widest block font-mono">Phase</span>
                                <span className="text-sm font-display text-text-primary tracking-wider flex items-center gap-2">
                                    {game.status === 'LOBBY' && <><Zap className="w-4 h-4 text-gold" /> STANDBY</>}
                                    {game.status === 'ELECTION' && <><Vote className="w-4 h-4 text-banker" /> ELECTION</>}
                                    {game.status === 'LEGISLATIVE' && <><ScrollText className="w-4 h-4 text-gold" /> LEGISLATION</>}
                                    {game.status === 'EXECUTIVE' && <><AlertTriangle className="w-4 h-4 text-robber" /> EXECUTIVE</>}
                                </span>
                            </div>
                        </div>

                        {/* Current President */}
                        <div className="text-right">
                            <span className="text-[10px] text-text-muted uppercase tracking-widest block font-mono">President</span>
                            <span className="text-lg font-display text-banker neon-text-cyan">
                                {game.players[game.presidentIdx]?.name || "—"}
                            </span>
                        </div>
                    </div>

                    {/* BANKER TRACK (Security Protocols) */}
                    <div className="card-noir p-6 relative overflow-hidden">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-banker to-transparent" />

                        <div className="flex items-center gap-3 mb-4">
                            <BankerIcon className="w-8 h-8 text-banker glow-cyan" />
                            <h2 className="text-lg font-display text-banker tracking-[0.15em] uppercase neon-text-cyan">
                                Security Protocol
                            </h2>
                            <span className="ml-auto text-xs font-mono text-banker/60">5 TO WIN</span>
                        </div>

                        {/* Track */}
                        <div className="grid grid-cols-5 gap-2">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        scale: i < game.policies.banker ? 1 : 0.95,
                                        opacity: i < game.policies.banker ? 1 : 0.4,
                                    }}
                                    className={clsx(
                                        "aspect-[3/4] flex items-center justify-center border-2 transition-all duration-500 relative",
                                        i < game.policies.banker
                                            ? "bg-banker border-banker shadow-neon-cyan"
                                            : "bg-surface border-banker/20 border-dashed"
                                    )}
                                >
                                    {i < game.policies.banker ? (
                                        <ShieldIcon className="w-12 h-12 text-midnight" />
                                    ) : (
                                        <span className="text-banker/20 font-mono text-3xl font-bold">{i + 1}</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ROBBER TRACK (Heist Plans) */}
                    <div className="card-noir p-6 relative overflow-hidden">
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-robber to-transparent" />

                        <div className="flex items-center gap-3 mb-4">
                            <RobberIcon className="w-8 h-8 text-robber glow-pink" />
                            <h2 className="text-lg font-display text-robber tracking-[0.15em] uppercase neon-text-pink">
                                The Heist Plan
                            </h2>
                            <span className="ml-auto text-xs font-mono text-robber/60">6 TO WIN</span>
                        </div>

                        {/* Track */}
                        <div className="grid grid-cols-6 gap-2">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        scale: i < game.policies.robber ? 1 : 0.95,
                                        opacity: i < game.policies.robber ? 1 : 0.4,
                                    }}
                                    className={clsx(
                                        "aspect-[3/4] flex flex-col items-center justify-center border-2 transition-all duration-500 relative",
                                        i < game.policies.robber
                                            ? "bg-robber border-robber shadow-neon-pink"
                                            : "bg-surface border-robber/20 border-dashed"
                                    )}
                                >
                                    {i < game.policies.robber ? (
                                        <RobberIcon className="w-10 h-10 text-midnight" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            {getRobberPowerIcon(i, game.players.length) || (
                                                <span className="text-robber/20 font-mono text-3xl font-bold">{i + 1}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Veto label */}
                                    {i === 4 && (
                                        <span className="absolute bottom-1 text-[8px] font-bold text-white/30 uppercase tracking-widest">
                                            Veto
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CHAOS METER (Election Tracker) */}
                    <div className="card-noir p-4">
                        <div className="flex items-center justify-center gap-8">
                            <span className="text-xs font-mono text-text-muted uppercase tracking-[0.2em]">Chaos Meter</span>
                            <div className="flex items-center gap-4">
                                {[0, 1, 2, 3].map((stage) => (
                                    <div key={stage} className="relative">
                                        <motion.div
                                            animate={{
                                                scale: game.electionTracker > stage ? 1.2 : 1,
                                            }}
                                            className={clsx(
                                                "w-5 h-5 rounded-full border-2 transition-all duration-300",
                                                stage === 3
                                                    ? "border-robber"
                                                    : "border-white/20",
                                                game.electionTracker > stage
                                                    ? "bg-robber border-robber shadow-neon-pink"
                                                    : "bg-transparent"
                                            )}
                                        />
                                        {stage === 3 && (
                                            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] text-robber uppercase tracking-widest whitespace-nowrap font-mono">
                                                CHAOS
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Mission Log */}
                <div className="lg:col-span-4 flex flex-col h-full min-h-[600px] card-noir relative overflow-hidden">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                        <ScrollText className="w-5 h-5 text-gold" />
                        <h3 className="text-sm font-display text-gold tracking-[0.2em] uppercase neon-text-orange">Mission Log</h3>
                    </div>

                    <div
                        ref={logContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs text-text-secondary custom-scrollbar"
                    >
                        <AnimatePresence>
                            {game.logs.map((log, i) => {
                                const match = log.match(/\[(.*?)\] (.*)/);
                                const time = match ? match[1] : '';
                                const msg = match ? match[2] : log;

                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3"
                                    >
                                        <span className="text-text-muted/40 shrink-0">{time}</span>
                                        <span className={clsx(
                                            msg.includes('Banker') && "text-banker",
                                            msg.includes('Robber') && "text-robber",
                                            msg.includes('GAME OVER') && "text-gold font-bold neon-text-orange",
                                            msg.includes('executed') && "text-robber",
                                            msg.includes('President') && "text-banker",
                                            msg.includes('Chancellor') && "text-gold"
                                        )}>
                                            {msg}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Active President Card */}
                    <div className="p-4 border-t border-white/10 bg-midnight/30">
                        <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-2">
                            <span className="uppercase tracking-widest">Current Turn</span>
                            <div className="w-2 h-2 rounded-full bg-banker animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-text-muted font-mono uppercase">President</p>
                                <p className="text-lg font-display text-banker tracking-wider">
                                    {game.players[game.presidentIdx]?.name || "—"}
                                </p>
                            </div>
                            {game.chancellorId && (
                                <div className="text-right">
                                    <p className="text-[10px] text-text-muted font-mono uppercase">Chancellor</p>
                                    <p className="text-lg font-display text-gold tracking-wider">
                                        {game.players.find(p => p.id === game.chancellorId)?.name || "—"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
