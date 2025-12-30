'use client';

import { motion } from 'framer-motion';
import { Crown, Scale, Skull, Eye, Ban, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

/**
 * PlayerTile Component - Enhanced player card display
 * Inspired by Secret Hitler's player tiles with heist theme
 */
export default function PlayerTile({
    player,
    isCurrentPlayer = false,
    isPresident = false,
    isChancellor = false,
    wasPresident = false,
    wasChancellor = false,
    isInvestigated = false,
    voted = null, // true (ja), false (nein), null (not voted)
    canSelect = false,
    onSelect,
    className
}) {
    const isDead = !player.isAlive;
    const showVote = voted !== null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={canSelect ? { scale: 1.02 } : {}}
            className={clsx(
                "relative group",
                className
            )}
        >
            {/* Main Card */}
            <div
                className={clsx(
                    "relative border backdrop-blur-sm transition-all duration-300",
                    canSelect && "cursor-pointer hover:border-gold/50 hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]",
                    isCurrentPlayer && "border-gold bg-gold/5 shadow-[0_0_20px_rgba(217,119,6,0.2)]",
                    isPresident && "border-blue-400 bg-blue-500/5",
                    isChancellor && "border-purple-400 bg-purple-500/5",
                    !isCurrentPlayer && !isPresident && !isChancellor && "border-white/10 bg-white/5",
                    isDead && "opacity-40 grayscale"
                )}
                onClick={canSelect ? onSelect : undefined}
            >
                {/* Status Badges */}
                <div className="absolute -top-2 -right-2 flex gap-1 z-10">
                    {isPresident && (
                        <div className="p-1.5 rounded-full bg-blue-500 border-2 border-background shadow-lg">
                            <Crown className="w-3 h-3 text-white" />
                        </div>
                    )}
                    {isChancellor && (
                        <div className="p-1.5 rounded-full bg-purple-500 border-2 border-background shadow-lg">
                            <Scale className="w-3 h-3 text-white" />
                        </div>
                    )}
                    {isDead && (
                        <div className="p-1.5 rounded-full bg-red-500 border-2 border-background shadow-lg">
                            <Skull className="w-3 h-3 text-white" />
                        </div>
                    )}
                    {isInvestigated && (
                        <div className="p-1.5 rounded-full bg-gold border-2 border-background shadow-lg">
                            <Eye className="w-3 h-3 text-black" />
                        </div>
                    )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className={clsx(
                            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors",
                            isCurrentPlayer && "bg-gold text-black border-gold",
                            isPresident && !isCurrentPlayer && "bg-blue-500/20 text-blue-400 border-blue-500",
                            isChancellor && !isCurrentPlayer && "bg-purple-500/20 text-purple-400 border-purple-500",
                            !isCurrentPlayer && !isPresident && !isChancellor && "bg-white/10 text-white border-white/20"
                        )}>
                            {player.name[0].toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <h3 className={clsx(
                                "font-bold font-mono text-sm tracking-wider",
                                isCurrentPlayer && "text-gold",
                                !isCurrentPlayer && "text-white"
                            )}>
                                {player.name}
                            </h3>

                            {/* Status Labels */}
                            <div className="flex gap-1 mt-1 flex-wrap">
                                {player.isHost && (
                                    <span className="text-[9px] uppercase tracking-widest text-gold/70 font-bold">Boss</span>
                                )}
                                {wasPresident && !isPresident && (
                                    <span className="text-[9px] uppercase tracking-widest text-blue-400/50 font-bold">Ex-Director</span>
                                )}
                                {wasChancellor && !isChancellor && (
                                    <span className="text-[9px] uppercase tracking-widest text-purple-400/50 font-bold">Ex-Executor</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vote Indicator */}
                    {showVote && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                {voted ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Ja</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 text-red-400" />
                                        <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Nein</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Ineligible Overlay */}
                {!canSelect && !isDead && onSelect && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded">
                        <div className="text-center">
                            <Ban className="w-8 h-8 text-red-400 mx-auto mb-1" />
                            <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold">
                                Ineligible
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Glow Effect */}
            {(isPresident || isChancellor || isCurrentPlayer) && (
                <div className={clsx(
                    "absolute inset-0 -z-10 blur-xl opacity-20",
                    isCurrentPlayer && "bg-gold",
                    isPresident && !isCurrentPlayer && "bg-blue-500",
                    isChancellor && !isCurrentPlayer && "bg-purple-500"
                )} />
            )}
        </motion.div>
    );
}

/**
 * Simplified mini player badge for compact displays
 */
export function PlayerBadge({ player, className }) {
    return (
        <div className={clsx(
            "inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1",
            className
        )}>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                {player.name[0].toUpperCase()}
            </div>
            <span className="text-sm font-mono">{player.name}</span>
        </div>
    );
}
