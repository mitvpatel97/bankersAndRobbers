'use client'; // GameBoard.jsx

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { BankerIcon, RobberIcon, MastermindIcon, NoiseOverlay } from './GameAssets';
import { ScrollText, Eye, Skull, Vote, RefreshCw, Search } from 'lucide-react';

export default function GameBoard({ game }) {
    const logContainerRef = useRef(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [game.logs]);

    // Helpers for Policy Track Icons
    const getRobberPowerIcon = (slotIdx, playerCount) => {
        // Slot indices are 0-5 (for 1st to 6th policy)
        // Standard SH Rules:
        // 5-6 Players: 3: Peek, 4: Kill, 5: Kill + Veto
        // 7-8 Players: 2: Investigate, 3: Elect, 4: Kill, 5: Kill + Veto
        // 9-10 Players: 1: Investigate, 2: Investigate, 3: Elect, 4: Kill, 5: Kill + Veto

        const count = slotIdx + 1; // 1-based count for logic checks

        if (count === 6) return <RobberIcon className="w-6 h-6 text-black" />; // Win slot

        if (playerCount <= 6) {
            if (count === 3) return <Eye className="w-5 h-5 text-black" />;
            if (count === 4) return <Skull className="w-5 h-5 text-black" />;
            if (count === 5) return <Skull className="w-5 h-5 text-black" />;
        } else if (playerCount <= 8) {
            if (count === 2) return <Search className="w-5 h-5 text-black" />; // Investigate
            if (count === 3) return <Vote className="w-5 h-5 text-black" />; // Special Election
            if (count === 4) return <Skull className="w-5 h-5 text-black" />;
            if (count === 5) return <Skull className="w-5 h-5 text-black" />;
        } else {
            if (count === 1) return <Search className="w-5 h-5 text-black" />;
            if (count === 2) return <Search className="w-5 h-5 text-black" />;
            if (count === 3) return <Vote className="w-5 h-5 text-black" />;
            if (count === 4) return <Skull className="w-5 h-5 text-black" />;
            if (count === 5) return <Skull className="w-5 h-5 text-black" />;
        }
        return null;
    };

    return (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

            {/* LEFT: Game Status & Tracks */}
            <div className="lg:col-span-8 space-y-8">

                {/* Header Info */}
                <div className="flex items-center justify-between bg-black/40 border-y border-white/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded border border-white/10">
                            <span className="text-xs text-text-muted uppercase tracking-widest block">Room ID</span>
                            <span className="text-xl font-mono text-gold font-bold tracking-widest">{game.roomCode}</span>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div>
                            <span className="text-xs text-text-muted uppercase tracking-widest block">Status</span>
                            <span className="text-sm font-display text-white tracking-wider flex items-center gap-2">
                                {game.status === 'LOBBY' && 'WAITING FOR SIGNAL'}
                                {game.status === 'ELECTION' && 'ELECTION CYCLES'}
                                {game.status === 'LEGISLATIVE' && 'LEGISLATIVE SESSION'}
                                {game.status === 'EXECUTIVE' && 'EXECUTIVE ACTION REQUIRED'}
                                {game.status === 'GAME_OVER' && 'MISSION CONCLUDED'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* BANKER TRACK (Liberal) */}
                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <BankerIcon className="w-6 h-6 text-banker" />
                        <h2 className="text-lg font-display text-banker tracking-[0.2em] uppercase">Security Protocol</h2>
                    </div>

                    {/* Track Container */}
                    <div className="bg-surface border border-banker/30 p-1 rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.1)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-banker/5" />
                        <div className="grid grid-cols-5 gap-1 relative z-10">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        "aspect-[3/4] rounded-sm flex items-center justify-center border transition-all duration-500",
                                        i < game.policies.banker
                                            ? "bg-banker border-banker shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                                            : "bg-[#1a1a1a] border-white/5 border-dashed"
                                    )}
                                >
                                    {i < game.policies.banker ? (
                                        <BankerIcon className="w-12 h-12 text-white/90 drop-shadow-md pb-1" />
                                    ) : (
                                        <span className="text-banker/10 font-mono text-4xl font-bold">{i + 1}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Win Marker */}
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full text-banker text-xs font-mono uppercase tracking-widest rotate-90 origin-left opacity-50">
                        Victory
                    </div>
                </div>

                {/* ROBBER TRACK (Fascist) */}
                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <RobberIcon className="w-6 h-6 text-robber" />
                        <h2 className="text-lg font-display text-robber tracking-[0.2em] uppercase">The Heist Plan</h2>
                    </div>

                    {/* Track Container */}
                    <div className="bg-surface border border-robber/30 p-1 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.1)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-robber/5" />
                        <div className="grid grid-cols-6 gap-1 relative z-10">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className={clsx(
                                        "aspect-[3/4] rounded-sm flex items-center justify-center border transition-all duration-500 relative ring-offset-0",
                                        // Specific styling for Danger Zones (Executive Actions)
                                        (i >= 2 && game.players.length <= 8) || (i >= 0 && game.players.length > 8) // Simplified logic check logic visualization
                                            ? "bg-[#1f1a1a]"
                                            : "bg-[#1a1a1a]",
                                        i < game.policies.robber
                                            ? "bg-robber border-robber shadow-[0_0_15px_rgba(220,38,38,0.6)]"
                                            : "border-white/5 border-dashed"
                                    )}
                                >
                                    {i < game.policies.robber ? (
                                        <RobberIcon className="w-12 h-12 text-black/80 drop-shadow-md pb-1" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 opacity-40">
                                            {/* Power-up Icons */}
                                            {getRobberPowerIcon(i, game.players.length) || (
                                                <span className="text-robber/20 font-mono text-4xl font-bold">{i + 1}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Slot Label (e.g. "VETO") */}
                                    {i === 4 && <span className="absolute bottom-1 text-[8px] font-bold text-white/30 uppercase tracking-widest">Veto</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ELECTION TRACKER */}
                <div className="flex items-center justify-center gap-6 pt-4 bg-black/20 p-4 rounded border border-white/5">
                    <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Chaos Meter</span>
                    <div className="flex items-center gap-4">
                        {[0, 1, 2, 3].map((stage) => (
                            <div key={stage} className="relative">
                                <div
                                    className={clsx(
                                        "w-4 h-4 rounded-full border transition-all duration-300",
                                        stage === 3 // The Chaos Token
                                            ? "border-robber bg-transparent"
                                            : "border-white/20 bg-transparent",
                                        game.electionTracker > stage
                                            ? "bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                            : ""
                                    )}
                                />
                                {stage === 3 && (
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] text-robber uppercase tracking-widest whitespace-nowrap">
                                        CHAOS
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* RIGHT: Game Log & Intel */}
            <div className="lg:col-span-4 flex flex-col h-full min-h-[500px] bg-black/60 border-l border-white/10 backdrop-blur-md">
                <div className="p-4 border-b border-white/10 flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-gold" />
                    <h3 className="text-sm font-display text-gold tracking-[0.2em] uppercase">Mission Log</h3>
                </div>

                <div
                    ref={logContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs text-text-secondary custom-scrollbar"
                >
                    {game.logs.map((log, i) => {
                        // Extract timestamp and message
                        const match = log.match(/\[(.*?)\] (.*)/);
                        const time = match ? match[1] : '';
                        const msg = match ? match[2] : log;

                        return (
                            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <span className="text-white/20 shrink-0">{time}</span>
                                <span className={clsx(
                                    msg.includes('Banker') && "text-banker",
                                    msg.includes('Robber') && "text-robber",
                                    msg.includes('GAME OVER') && "text-gold font-bold",
                                    msg.includes('executed') && "text-red-500"
                                )}>
                                    {msg}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Active Role Card (Status Indicator) */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                    <div className="flex items-center justify-between text-xs text-text-muted font-mono mb-2">
                        <span>CURRENT PRESIDENT</span>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    {/* Placeholder for current turn logic display if needed */}
                    <div className="text-white font-display text-lg tracking-widest">
                        {game.players[game.presidentIdx]?.name || "None"}
                    </div>
                </div>

            </div>
        </div>
    );
}


