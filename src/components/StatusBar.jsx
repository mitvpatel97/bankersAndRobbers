'use client';

import { Users, Crown, Scale, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { BankerIcon, RobberIcon, MastermindIcon } from './GameAssets';
import clsx from 'clsx';

/**
 * StatusBar Component - Inspired by Secret Hitler's status bar
 * Shows current game phase, active players, and key information
 */
export default function StatusBar({ game }) {
    const currentPresident = game.players[game.presidentIdx];
    const currentChancellor = game.players.find(p => p.id === game.chancellorId);
    const alivePlayers = game.players.filter(p => p.isAlive);

    const getPhaseDisplay = () => {
        switch (game.status) {
            case 'LOBBY':
                return { text: 'Assembling Crew', icon: Users, color: 'text-gold' };
            case 'ELECTION':
                return { text: 'Nomination Phase', icon: Scale, color: 'text-blue-400' };
            case 'LEGISLATIVE':
                return { text: 'Policy Decision', icon: Crown, color: 'text-purple-400' };
            case 'EXECUTIVE':
                return { text: 'Executive Action', icon: AlertTriangle, color: 'text-robber' };
            case 'GAME_OVER':
                return game.winner === 'banker'
                    ? { text: 'Vault Secured', icon: CheckCircle2, color: 'text-banker' }
                    : { text: 'Heist Successful', icon: XCircle, color: 'text-robber' };
            default:
                return { text: 'Standby', icon: Users, color: 'text-text-muted' };
        }
    };

    const phase = getPhaseDisplay();
    const PhaseIcon = phase.icon;

    return (
        <div className="w-full bg-black/40 border-y border-white/10 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

                    {/* LEFT: Game Phase */}
                    <div className="flex items-center gap-4">
                        <div className={clsx(
                            "p-3 rounded-full border border-white/10",
                            phase.color.replace('text-', 'bg-') + '/10'
                        )}>
                            <PhaseIcon className={clsx("w-5 h-5", phase.color)} />
                        </div>
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-widest font-mono">Phase</p>
                            <p className={clsx("font-display text-lg tracking-wider", phase.color)}>
                                {phase.text}
                            </p>
                        </div>
                    </div>

                    {/* CENTER: Active Players */}
                    <div className="flex items-center justify-center gap-6">
                        {currentPresident && (
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
                                <Crown className="w-4 h-4 text-gold" />
                                <div className="text-left">
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest">Director</p>
                                    <p className="text-sm font-bold text-white">{currentPresident.name}</p>
                                </div>
                            </div>
                        )}

                        {currentChancellor && (
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10">
                                <Scale className="w-4 h-4 text-blue-400" />
                                <div className="text-left">
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest">Executor</p>
                                    <p className="text-sm font-bold text-white">{currentChancellor.name}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Score Tracker */}
                    <div className="flex items-center justify-end gap-4">
                        <div className="flex items-center gap-2">
                            <BankerIcon className="w-6 h-6 text-banker" />
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "w-2 h-6 rounded-sm border transition-all",
                                            i < game.policies.banker
                                                ? "bg-banker border-banker shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                                                : "bg-transparent border-white/20"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-8 bg-white/10" />

                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "w-2 h-6 rounded-sm border transition-all",
                                            i < game.policies.robber
                                                ? "bg-robber border-robber shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                                                : "bg-transparent border-white/20"
                                        )}
                                    />
                                ))}
                            </div>
                            <RobberIcon className="w-6 h-6 text-robber" />
                        </div>
                    </div>

                </div>

                {/* Secondary Row: Living Players Count */}
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-muted font-mono">
                    <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        <span>{alivePlayers.length} operatives active</span>
                    </div>

                    {game.electionTracker > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="uppercase tracking-widest">Chaos:</span>
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "w-2 h-2 rounded-full border",
                                            i < game.electionTracker
                                                ? "bg-robber border-robber"
                                                : "bg-transparent border-white/20"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <span className="text-white/40">Room:</span>
                        <span className="ml-2 text-gold font-bold tracking-widest">{game.roomCode}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
