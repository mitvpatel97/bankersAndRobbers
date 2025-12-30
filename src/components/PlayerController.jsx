'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull, Eye, Crown, Zap, Lock, Unlock, Check, X, Users, AlertTriangle, Fingerprint } from 'lucide-react';
import clsx from 'clsx';

export default function PlayerController({
    game,
    roleData,
    playerId,
    onNominate,
    onVote,
    onDiscard,
    onVetoRequest,
    onVetoResponse,
    onExecutiveAction,
    onEndExecutiveAction,
    executiveResult
}) {
    const [roleRevealed, setRoleRevealed] = useState(false);

    // Helper State Checks
    const isPresident = game.presidentIdx >= 0 && game.players[game.presidentIdx]?.id === playerId;
    const isChancellor = game.chancellorId === playerId;
    const isDead = !game.players.find(p => p.id === playerId)?.isAlive;
    const roleColor = roleData.role === 'banker' ? 'text-banker' : 'text-robber';
    const bgGradient = roleData.role === 'banker' ? 'from-banker/5 to-transparent' : 'from-robber/5 to-transparent';

    // --- SUB-COMPONENTS ---

    const RoleCard = () => (
        <motion.div
            className="w-full bg-surface border border-white/10 rounded-2xl overflow-hidden relative group cursor-pointer select-none"
            onPointerDown={() => setRoleRevealed(true)}
            onPointerUp={() => setRoleRevealed(false)}
            onPointerLeave={() => setRoleRevealed(false)}
            initial={{ height: 80 }}
            animate={{ height: roleRevealed ? 'auto' : 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${roleData.role === 'banker' ? 'from-banker via-white to-banker' : 'from-robber via-gold to-robber'}`} />

            <div className="p-4 text-center">
                {!roleRevealed ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                        <Fingerprint className="w-8 h-8 text-white/50 animate-pulse" />
                        <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">Hold to Reveal Identity</p>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <h2 className={`text-3xl font-display font-bold ${roleColor} uppercase tracking-wider`}>
                            {roleData.role}
                        </h2>
                        {roleData.teamMembers && roleData.teamMembers.length > 0 && (
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-sm">
                                <p className="text-text-muted mb-2 font-mono text-[10px] uppercase">Known Associates</p>
                                <div className="space-y-1">
                                    {roleData.teamMembers.map((m, i) => (
                                        <div key={i} className="flex justify-between items-center text-white">
                                            <span>{m.name}</span>
                                            <span className="text-xs font-bold text-robber">{m.role}</span>
                                        </div>
                                    ))}
                                    {roleData.mastermind && (
                                        <div className="flex justify-between items-center text-gold border-t border-white/10 pt-1 mt-1">
                                            <span>{roleData.mastermind}</span>
                                            <span className="text-xs font-bold">MASTERMIND</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <p className="text-[10px] text-text-secondary opacity-50">Release to Hide</p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const NominationView = () => (
        <div className="space-y-4">
            <div className="text-center space-y-2">
                <Users className="w-12 h-12 text-gold mx-auto" />
                <h2 className="text-2xl font-bold text-gold">Nominate Chancellor</h2>
                <p className="text-sm text-text-secondary">Select your partner for this turn.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {game.players.map(p => {
                    const isSelf = p.id === playerId;
                    const isLastChan = p.id === game.lastChancellorId;
                    const isLastPres = game.players.length > 5 && p.id === game.lastPresidentId;
                    const ineligible = isSelf || isLastChan || isLastPres || !p.isAlive;

                    return (
                        <button
                            key={p.id}
                            disabled={ineligible}
                            onClick={() => onNominate(p.id)}
                            className={clsx(
                                "p-4 rounded-xl font-bold text-left transition-all border",
                                ineligible
                                    ? "bg-black/20 border-white/5 text-text-muted cursor-not-allowed"
                                    : "bg-surface border-white/10 hover:border-gold hover:bg-gold/10 text-white"
                            )}
                        >
                            {p.name}
                            {ineligible && <span className="float-right text-xs opacity-50 font-mono mt-1">N/A</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const VotingView = () => (
        <div className="space-y-6 text-center">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Vote on Government</h2>
                <div className="flex justify-center gap-4 text-sm bg-black/30 p-4 rounded-xl">
                    <div className="text-right">
                        <p className="text-text-muted text-[10px]">PRESIDENT</p>
                        <p className="font-bold text-banker">{game.players[game.presidentIdx].name}</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-left">
                        <p className="text-text-muted text-[10px]">CHANCELLOR</p>
                        <p className="font-bold text-gold">{game.players.find(p => p.id === game.chancellorId)?.name}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 h-48">
                <button
                    onClick={() => onVote(true)}
                    className="bg-green-600/20 border-2 border-green-500 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-green-600/40 active:scale-95 transition-all group"
                >
                    <Check className="w-12 h-12 text-green-500 group-hover:scale-125 transition-transform" />
                    <span className="font-bold text-green-500 text-2xl tracking-widest">JA</span>
                </button>
                <button
                    onClick={() => onVote(false)}
                    className="bg-red-600/20 border-2 border-red-500 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-red-600/40 active:scale-95 transition-all group"
                >
                    <X className="w-12 h-12 text-red-500 group-hover:scale-125 transition-transform" />
                    <span className="font-bold text-red-500 text-2xl tracking-widest">NEIN</span>
                </button>
            </div>
        </div>
    );

    const LegislativeView = () => {
        const canVeto = isChancellor && game.vetoUnlocked && !game.vetoRequested;
        const waitingForVeto = isChancellor && game.vetoRequested;

        if (waitingForVeto) {
            return (
                <div className="text-center p-8 space-y-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Veto Requested</h2>
                    <p className="text-text-secondary">Waiting for President to decide...</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white">
                        {game.turnStep === 'PRESIDENT_DISCARD' ? 'Discard One Policy' : 'Enact One Policy'}
                    </h2>
                    <p className="text-sm text-text-secondary">
                        {game.turnStep === 'PRESIDENT_DISCARD' ? 'Pass 2 to Chancellor' : 'Discard 1. Enact the other.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {game.hand.map((card, i) => (
                        <button
                            key={i}
                            onClick={() => onDiscard(i, isChancellor)}
                            className={clsx(
                                "p-6 rounded-xl border-2 flex items-center justify-between group active:scale-95 transition-transform",
                                card === 'banker'
                                    ? "bg-banker/10 border-banker hover:bg-banker/20"
                                    : "bg-robber/10 border-robber hover:bg-robber/20"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                {card === 'banker' ? <Shield className="w-8 h-8 text-banker" /> : <Skull className="w-8 h-8 text-robber" />}
                                <span className={clsx("font-bold text-xl uppercase", card === 'banker' ? 'text-banker' : 'text-robber')}>
                                    {card} Policy
                                </span>
                            </div>
                            <span className="text-xs font-mono opacity-50 text-white group-hover:opacity-100">DISCARD</span>
                        </button>
                    ))}
                </div>

                {canVeto && (
                    <button
                        onClick={onVetoRequest}
                        className="w-full py-4 mt-8 border border-red-500/50 text-red-500 rounded-xl font-bold uppercase tracking-widest hover:bg-red-500/10 transition-colors"
                    >
                        Request Veto
                    </button>
                )}
            </div>
        );
    };

    const VetoResponseView = () => (
        <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Chancellor Requested Veto</h2>
                <p className="text-text-secondary">Do you agree to discard ALL cards?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => onVetoResponse(true)} className="bg-green-600/20 border border-green-500 p-4 rounded-xl text-green-500 font-bold">
                    AGREE
                </button>
                <button onClick={() => onVetoResponse(false)} className="bg-red-600/20 border border-red-500 p-4 rounded-xl text-red-500 font-bold">
                    DECLINE
                </button>
            </div>
        </div>
    );

    const ExecutiveActionView = () => {
        if (executiveResult) {
            // SHOW RESULT
            return (
                <div className="space-y-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Action Report</h2>
                    <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                        {game.executiveAction === 'POLICY_PEEK' ? (
                            <div className="space-y-4">
                                <p className="text-text-secondary">Top 3 Policies:</p>
                                <div className="flex flex-col gap-2">
                                    {executiveResult.map((c, i) => (
                                        <div key={i} className={clsx(
                                            "p-3 rounded-lg font-bold border",
                                            c === 'banker' ? "text-banker border-banker" : "text-robber border-robber"
                                        )}>
                                            {c.toUpperCase()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-text-secondary">Investigation Result:</p>
                                <p className={clsx("text-4xl font-bold uppercase", executiveResult === 'Banker' ? 'text-banker' : 'text-robber')}>
                                    {executiveResult}
                                </p>
                            </div>
                        )}
                    </div>
                    <button onClick={onEndExecutiveAction} className="w-full btn btn-primary py-4">ACKNOWLEDGE</button>
                </div>
            );
        }

        // SELECT TARGET
        return (
            <div className="space-y-4">
                <div className="text-center space-y-2">
                    <Zap className="w-12 h-12 text-gold mx-auto" />
                    <h2 className="text-2xl font-bold text-gold">Executive Action</h2>
                    <p className="text-lg font-bold text-white bg-gold/10 inline-block px-3 py-1 rounded">
                        {game.executiveAction.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-text-secondary">Select a target.</p>
                </div>

                <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[400px]">
                    {game.players
                        .filter(p => {
                            if (p.id === playerId) return false;
                            if (!p.isAlive) return false;
                            if (game.executiveAction === 'INVESTIGATE_LOYALTY' && p.investigated) return false;
                            return true;
                        })
                        .map(p => (
                            <button
                                key={p.id}
                                onClick={() => onExecutiveAction(game.executiveAction, p.id)}
                                className="p-4 bg-surface rounded-xl border border-white/10 hover:border-gold hover:bg-gold/10 text-white font-bold transition-all"
                            >
                                {p.name}
                            </button>
                        ))
                    }
                    {game.executiveAction === 'POLICY_PEEK' && (
                        <button onClick={() => onExecutiveAction('POLICY_PEEK')} className="p-4 bg-gold text-black font-bold rounded-xl mt-4">
                            REVEAL CARDS
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // --- MAIN RENDER ---

    if (isDead) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-6">
                <Skull className="w-24 h-24 text-red-600 animate-pulse" />
                <h1 className="text-4xl text-red-600 font-bold">TERMINATED</h1>
                <p className="text-text-secondary">You have been executed. Do not speak.</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-gradient-to-b ${bgGradient} text-text-primary p-4 pb-20`}>
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm border border-white/20">
                        {roleData.name[0]}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">MISSION STATUS</p>
                    <p className="text-sm font-bold text-gold">{game.status}</p>
                </div>
            </header>

            <main className="max-w-md mx-auto space-y-8">
                <RoleCard />

                <AnimatePresence mode="wait">
                    {/* LOBBY */}
                    {game.status === 'LOBBY' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-surface/50 p-6 rounded-2xl border border-white/5">
                            <p className="animate-pulse text-text-secondary">Waiting for mission start...</p>
                        </motion.div>
                    )}

                    {/* ELECTION */}
                    {game.status === 'ELECTION' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                            {isPresident && !game.chancellorId ? <NominationView /> :
                                game.chancellorId && !game.votes[playerId] ? <VotingView /> :
                                    <div className="text-center p-8 bg-black/20 rounded-xl">
                                        <p className="text-text-secondary">Waiting for voting result...</p>
                                    </div>
                            }
                        </motion.div>
                    )}

                    {/* LEGISLATIVE */}
                    {game.status === 'LEGISLATIVE' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            {(isPresident && game.turnStep === 'PRESIDENT_DISCARD') || (isChancellor && game.turnStep === 'CHANCELLOR_DISCARD' && !game.vetoRequested) ?
                                <LegislativeView /> :
                                isPresident && game.turnStep === 'CHANCELLOR_DISCARD' && game.vetoRequested ?
                                    <VetoResponseView /> :
                                    <div className="text-center p-8 space-y-4">
                                        <Lock className="w-12 h-12 text-text-muted mx-auto" />
                                        <p>Legislative session in progress...</p>
                                    </div>
                            }
                        </motion.div>
                    )}

                    {/* EXECUTIVE */}
                    {game.status === 'EXECUTIVE' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {isPresident ? <ExecutiveActionView /> :
                                <div className="text-center p-8 space-y-4">
                                    <Crown className="w-12 h-12 text-gold mx-auto animate-bounce" />
                                    <p>President is taking executive action...</p>
                                </div>
                            }
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
