'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull, Eye, Crown, Zap, Lock, Check, X, Users, AlertTriangle, Fingerprint, Radio } from 'lucide-react';
import clsx from 'clsx';
import { BankerIcon, RobberIcon, MastermindIcon, VHSOverlay, GlowingOrb, ShieldIcon } from './GameAssets';

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
    const isBanker = roleData.role === 'banker';
    const isRobber = roleData.role === 'robber' || roleData.role === 'mastermind';

    // --- SUB-COMPONENTS ---

    const RoleCard = () => (
        <motion.div
            className={clsx(
                "w-full card-noir overflow-hidden relative cursor-pointer select-none",
                isBanker ? "border-banker/30" : "border-robber/30"
            )}
            onPointerDown={() => setRoleRevealed(true)}
            onPointerUp={() => setRoleRevealed(false)}
            onPointerLeave={() => setRoleRevealed(false)}
            initial={{ height: 80 }}
            animate={{ height: roleRevealed ? 'auto' : 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Top accent */}
            <div className={clsx(
                "absolute top-0 left-0 right-0 h-[2px]",
                isBanker ? "bg-gradient-to-r from-transparent via-banker to-transparent" : "bg-gradient-to-r from-transparent via-robber to-transparent"
            )} />

            <div className="p-4 text-center">
                {!roleRevealed ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                        <Fingerprint className={clsx("w-8 h-8 animate-pulse", isBanker ? "text-banker" : "text-robber")} />
                        <p className="font-mono text-xs tracking-[0.2em] text-text-secondary uppercase">Hold to Reveal Identity</p>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        {/* Role Icon */}
                        <div className="flex justify-center mb-4">
                            {roleData.role === 'banker' && <BankerIcon className="w-16 h-16 text-banker glow-cyan" />}
                            {roleData.role === 'robber' && <RobberIcon className="w-16 h-16 text-robber glow-pink" />}
                            {roleData.role === 'mastermind' && <MastermindIcon className="w-16 h-16 text-gold glow-orange" />}
                        </div>

                        <h2 className={clsx(
                            "text-3xl font-display font-bold uppercase tracking-[0.2em]",
                            roleData.role === 'banker' && "text-banker neon-text-cyan",
                            roleData.role === 'robber' && "text-robber neon-text-pink",
                            roleData.role === 'mastermind' && "text-gold neon-text-orange"
                        )}>
                            {roleData.role}
                        </h2>

                        {/* Known Associates */}
                        {roleData.teamMembers && roleData.teamMembers.length > 0 && (
                            <div className="bg-midnight/60 p-4 border border-white/10 text-sm mt-4">
                                <p className="text-text-muted mb-3 font-mono text-[10px] uppercase tracking-[0.2em]">Known Associates</p>
                                <div className="space-y-2">
                                    {roleData.teamMembers.map((m, i) => (
                                        <div key={i} className="flex justify-between items-center text-text-primary">
                                            <span className="font-mono">{m.name}</span>
                                            <span className="text-xs font-bold text-robber uppercase">{m.role}</span>
                                        </div>
                                    ))}
                                    {roleData.mastermind && (
                                        <div className="flex justify-between items-center text-gold border-t border-white/10 pt-2 mt-2">
                                            <span className="font-mono">{roleData.mastermind}</span>
                                            <span className="text-xs font-bold uppercase">MASTERMIND</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <p className="text-[10px] text-text-muted opacity-50 font-mono uppercase tracking-widest">Release to Hide</p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const NominationView = () => (
        <div className="space-y-6">
            <div className="text-center space-y-3">
                <Users className="w-12 h-12 text-gold mx-auto glow-orange" />
                <h2 className="text-2xl font-display font-bold text-gold tracking-widest neon-text-orange">Nominate Chancellor</h2>
                <p className="text-sm text-text-secondary font-mono">Select your partner for this operation.</p>
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
                                "p-4 font-bold text-left transition-all border-2 font-mono",
                                ineligible
                                    ? "bg-surface/30 border-white/5 text-text-muted cursor-not-allowed"
                                    : "bg-surface border-white/10 hover:border-gold hover:bg-gold/10 text-text-primary"
                            )}
                        >
                            {p.name}
                            {ineligible && <span className="float-right text-xs opacity-50 mt-1">N/A</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const VotingView = () => (
        <div className="space-y-6 text-center">
            <div>
                <h2 className="text-2xl font-display font-bold text-text-primary mb-4 tracking-widest">Vote on Government</h2>
                <div className="flex justify-center gap-6 text-sm bg-midnight/50 p-4 border border-white/10">
                    <div className="text-right">
                        <p className="text-text-muted text-[10px] font-mono uppercase tracking-widest">President</p>
                        <p className="font-bold text-banker text-lg">{game.players[game.presidentIdx].name}</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-left">
                        <p className="text-text-muted text-[10px] font-mono uppercase tracking-widest">Chancellor</p>
                        <p className="font-bold text-gold text-lg">{game.players.find(p => p.id === game.chancellorId)?.name}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 h-40">
                <button
                    onClick={() => onVote(true)}
                    className="bg-banker/10 border-2 border-banker flex flex-col items-center justify-center gap-2 hover:bg-banker/20 active:scale-95 transition-all group"
                >
                    <Check className="w-10 h-10 text-banker group-hover:scale-125 transition-transform" />
                    <span className="font-display font-bold text-banker text-2xl tracking-[0.2em]">JA</span>
                </button>
                <button
                    onClick={() => onVote(false)}
                    className="bg-robber/10 border-2 border-robber flex flex-col items-center justify-center gap-2 hover:bg-robber/20 active:scale-95 transition-all group"
                >
                    <X className="w-10 h-10 text-robber group-hover:scale-125 transition-transform" />
                    <span className="font-display font-bold text-robber text-2xl tracking-[0.2em]">NEIN</span>
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
                    <div className="w-16 h-16 bg-robber/20 border border-robber flex items-center justify-center mx-auto animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-robber" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-text-primary tracking-widest">Veto Requested</h2>
                    <p className="text-text-secondary font-mono text-sm">Awaiting President decision...</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-xl font-display font-bold text-text-primary tracking-widest mb-2">
                        {game.turnStep === 'PRESIDENT_DISCARD' ? 'Discard One Policy' : 'Enact One Policy'}
                    </h2>
                    <p className="text-sm text-text-secondary font-mono">
                        {game.turnStep === 'PRESIDENT_DISCARD' ? 'Pass 2 to Chancellor' : 'Discard 1. Enact the other.'}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {game.hand.map((card, i) => (
                        <button
                            key={i}
                            onClick={() => onDiscard(i, isChancellor)}
                            className={clsx(
                                "p-6 border-2 flex items-center justify-between group active:scale-95 transition-all",
                                card === 'banker'
                                    ? "bg-banker/10 border-banker hover:bg-banker/20"
                                    : "bg-robber/10 border-robber hover:bg-robber/20"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                {card === 'banker' ? (
                                    <ShieldIcon className="w-10 h-10 text-banker" />
                                ) : (
                                    <RobberIcon className="w-10 h-10 text-robber" />
                                )}
                                <span className={clsx(
                                    "font-display font-bold text-xl uppercase tracking-widest",
                                    card === 'banker' ? 'text-banker' : 'text-robber'
                                )}>
                                    {card === 'banker' ? 'Security' : 'Heist'}
                                </span>
                            </div>
                            <span className="text-xs font-mono opacity-50 text-text-primary group-hover:opacity-100 uppercase tracking-widest">Discard</span>
                        </button>
                    ))}
                </div>

                {canVeto && (
                    <button
                        onClick={onVetoRequest}
                        className="w-full py-4 mt-4 border-2 border-robber/50 text-robber font-display font-bold uppercase tracking-[0.2em] hover:bg-robber/10 transition-all"
                    >
                        Request Veto
                    </button>
                )}
            </div>
        );
    };

    const VetoResponseView = () => (
        <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-robber/20 border border-robber flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10 text-robber" />
            </div>
            <div>
                <h2 className="text-2xl font-display font-bold text-text-primary tracking-widest">Veto Requested</h2>
                <p className="text-text-secondary font-mono text-sm mt-2">Do you agree to discard ALL cards?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => onVetoResponse(true)}
                    className="bg-banker/10 border-2 border-banker p-4 text-banker font-display font-bold tracking-widest hover:bg-banker/20 transition-all"
                >
                    AGREE
                </button>
                <button
                    onClick={() => onVetoResponse(false)}
                    className="bg-robber/10 border-2 border-robber p-4 text-robber font-display font-bold tracking-widest hover:bg-robber/20 transition-all"
                >
                    DECLINE
                </button>
            </div>
        </div>
    );

    const ExecutiveActionView = () => {
        if (executiveResult) {
            return (
                <div className="space-y-6 text-center">
                    <h2 className="text-2xl font-display font-bold text-gold tracking-widest neon-text-orange">Intel Report</h2>
                    <div className="bg-midnight/60 p-6 border border-gold/30">
                        {game.executiveAction === 'POLICY_PEEK' ? (
                            <div className="space-y-4">
                                <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">Top 3 Policies:</p>
                                <div className="flex flex-col gap-2">
                                    {executiveResult.map((c, i) => (
                                        <div key={i} className={clsx(
                                            "p-3 font-display font-bold border-2 uppercase tracking-widest",
                                            c === 'banker' ? "text-banker border-banker" : "text-robber border-robber"
                                        )}>
                                            {c === 'banker' ? 'Security' : 'Heist'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">Investigation Result:</p>
                                <p className={clsx(
                                    "text-4xl font-display font-bold uppercase tracking-widest",
                                    executiveResult === 'Banker' ? 'text-banker neon-text-cyan' : 'text-robber neon-text-pink'
                                )}>
                                    {executiveResult}
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onEndExecutiveAction}
                        className="w-full btn btn-primary py-4"
                    >
                        ACKNOWLEDGE
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="text-center space-y-3">
                    <Zap className="w-12 h-12 text-gold mx-auto glow-orange" />
                    <h2 className="text-2xl font-display font-bold text-gold tracking-widest neon-text-orange">Executive Action</h2>
                    <p className="text-lg font-display font-bold text-text-primary bg-gold/10 inline-block px-4 py-2 border border-gold/30 tracking-widest">
                        {game.executiveAction.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-text-secondary font-mono">Select a target.</p>
                </div>

                <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[350px]">
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
                                className="p-4 bg-surface border-2 border-white/10 hover:border-gold hover:bg-gold/10 text-text-primary font-mono font-bold transition-all"
                            >
                                {p.name}
                            </button>
                        ))
                    }
                    {game.executiveAction === 'POLICY_PEEK' && (
                        <button
                            onClick={() => onExecutiveAction('POLICY_PEEK')}
                            className="p-4 bg-gold text-midnight font-display font-bold tracking-widest mt-4"
                        >
                            REVEAL CARDS
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // --- DEATH SCREEN ---
    if (isDead) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 relative overflow-hidden">
                <VHSOverlay />
                <GlowingOrb color="pink" size="lg" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                <Skull className="w-24 h-24 text-robber animate-pulse glow-pink relative z-10" />
                <h1 className="text-4xl font-display text-robber font-bold tracking-[0.3em] neon-text-pink relative z-10">TERMINATED</h1>
                <p className="text-text-secondary font-mono tracking-widest relative z-10">You have been executed. Do not speak.</p>
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen text-text-primary p-4 pb-24 relative overflow-hidden">
            {/* Background */}
            <VHSOverlay />
            <div className="fixed inset-0 z-0">
                <GlowingOrb color={isBanker ? 'cyan' : 'pink'} size="lg" className="absolute top-20 right-10 opacity-50" />
                <GlowingOrb color="orange" size="md" className="absolute bottom-40 left-10 opacity-30" />
            </div>

            {/* Header */}
            <header className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "w-10 h-10 flex items-center justify-center font-bold font-mono text-sm border-2",
                        isBanker ? "border-banker text-banker" : "border-robber text-robber"
                    )}>
                        {roleData.name[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="font-mono text-sm text-text-primary">{roleData.name}</p>
                        <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
                            {isPresident && 'President'} {isChancellor && 'Chancellor'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Status</p>
                    <div className="flex items-center gap-2">
                        <Radio className={clsx("w-3 h-3 animate-pulse", isBanker ? "text-banker" : "text-robber")} />
                        <p className="text-sm font-display text-gold tracking-widest">{game.status}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto space-y-8 relative z-10">
                <RoleCard />

                <AnimatePresence mode="wait">
                    {/* LOBBY */}
                    {game.status === 'LOBBY' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center card-noir p-6">
                            <div className="flex items-center justify-center gap-3 text-text-secondary font-mono">
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                                <span className="tracking-widest text-sm uppercase">Awaiting mission start</span>
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse animation-delay-500" />
                            </div>
                        </motion.div>
                    )}

                    {/* ELECTION */}
                    {game.status === 'ELECTION' && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                            {isPresident && !game.chancellorId ? <NominationView /> :
                                game.chancellorId && !game.votes[playerId] ? <VotingView /> :
                                    <div className="text-center card-noir p-8">
                                        <p className="text-text-secondary font-mono tracking-widest text-sm uppercase">Awaiting votes...</p>
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
                                    <div className="text-center card-noir p-8 space-y-4">
                                        <Lock className="w-12 h-12 text-text-muted mx-auto" />
                                        <p className="font-mono text-sm tracking-widest uppercase text-text-secondary">Legislative session in progress</p>
                                    </div>
                            }
                        </motion.div>
                    )}

                    {/* EXECUTIVE */}
                    {game.status === 'EXECUTIVE' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {isPresident ? <ExecutiveActionView /> :
                                <div className="text-center card-noir p-8 space-y-4">
                                    <Crown className="w-12 h-12 text-gold mx-auto animate-bounce glow-orange" />
                                    <p className="font-mono text-sm tracking-widest uppercase text-text-secondary">President taking executive action</p>
                                </div>
                            }
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
