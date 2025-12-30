'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Users, Lock, Play, Check, Radio } from 'lucide-react';
import clsx from 'clsx';
import { BankerIcon, RobberIcon, NoiseOverlay, CitySkyline, VHSOverlay, GlowingOrb } from './GameAssets';

export default function Lobby({ roomCode, players, isHost, onStartGame }) {
    const [copied, setCopied] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = `${window.location.origin}?room=${roomCode}`;
            QRCode.toDataURL(url, {
                width: 256,
                margin: 0,
                color: { dark: '#0d0221', light: '#ff9d00' }, // Midnight purple on neon orange
            }).then(setQrDataUrl);
        }
    }, [roomCode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* VHS Effect */}
            <VHSOverlay />

            {/* Background Elements */}
            <div className="fixed inset-0 z-0">
                <CitySkyline className="absolute bottom-0 left-0 right-0 h-[50%] opacity-40" />
                <GlowingOrb color="pink" size="lg" className="absolute top-10 left-10" />
                <GlowingOrb color="cyan" size="xl" className="absolute bottom-20 right-10" />
                <GlowingOrb color="orange" size="md" className="absolute top-1/2 left-1/3" />
            </div>

            <NoiseOverlay />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* Visual Panel - Left */}
                <div className="card-noir backdrop-blur-xl p-10 relative overflow-hidden flex flex-col items-center justify-center text-center">
                    {/* Top neon line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent" />

                    {/* Icons */}
                    <div className="relative mb-8">
                        <div className="flex items-center justify-center gap-8 relative z-10">
                            <BankerIcon className="w-20 h-20 text-banker glow-cyan animate-float" />
                            <div className="w-px h-20 bg-gradient-to-b from-transparent via-gold to-transparent" />
                            <RobberIcon className="w-20 h-20 text-robber glow-pink animate-float animation-delay-500" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-display font-bold tracking-[0.2em] mb-2">
                        <span className="text-banker neon-text-cyan">BANKER</span>
                        <span className="text-gold mx-3">&</span>
                        <span className="text-robber neon-text-pink">ROBBER</span>
                    </h1>
                    <p className="text-text-secondary font-mono text-sm tracking-[0.3em] uppercase mb-10">
                        Midnight Social Deduction
                    </p>

                    {/* Room Code Display */}
                    <div className="w-full max-w-xs relative group cursor-pointer" onClick={handleCopy}>
                        <div className="bg-midnight/80 border-2 border-gold/30 hover:border-gold transition-all p-6 flex flex-col items-center gap-3 relative overflow-hidden">
                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent animate-scanline" />

                            <span className="text-xs uppercase tracking-[0.4em] text-text-muted font-mono">Operation Code</span>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-mono font-bold text-gold tracking-[0.3em] neon-text-orange">{roomCode}</span>
                                {copied ? <Check className="w-5 h-5 text-banker" /> : <Copy className="w-5 h-5 text-text-secondary group-hover:text-gold transition-colors" />}
                            </div>
                            <span className="text-[10px] text-text-muted font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to copy
                            </span>
                        </div>
                    </div>

                    {/* Decorative corner elements */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-robber/30" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-banker/30" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-banker/30" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-robber/30" />
                </div>

                {/* Operations Panel - Right */}
                <div className="card-noir backdrop-blur-xl flex flex-col p-8 relative overflow-hidden">
                    {/* Top neon line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-banker to-transparent" />

                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <h2 className="text-lg font-display text-text-primary tracking-[0.2em] flex items-center gap-3">
                            <Users className="w-5 h-5 text-gold" />
                            CREW MANIFEST
                        </h2>
                        <span className={clsx(
                            "font-mono text-xs px-3 py-1.5 border",
                            players.length >= 5
                                ? "border-banker/50 text-banker bg-banker/10"
                                : "border-robber/50 text-robber bg-robber/10"
                        )}>
                            {players.length} / 10 RECRUITED
                        </span>
                    </div>

                    <div className="flex-1 space-y-2 mb-6 overflow-y-auto pr-2 custom-scrollbar min-h-[280px]">
                        <AnimatePresence>
                            {players.map((p, idx) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={clsx(
                                        "p-4 border flex items-center justify-between group transition-all",
                                        p.isHost
                                            ? "bg-gold/5 border-gold/30 hover:border-gold/50"
                                            : "bg-white/5 border-white/10 hover:border-banker/30"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "w-10 h-10 flex items-center justify-center font-bold font-mono text-sm border-2",
                                            p.isHost
                                                ? "bg-gold text-midnight border-gold"
                                                : "bg-surface-light text-text-secondary border-white/20"
                                        )}>
                                            {p.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className={clsx("font-bold font-mono", p.isHost ? "text-gold" : "text-text-primary")}>
                                                {p.name}
                                            </p>
                                            {p.isHost && (
                                                <p className="text-[10px] text-gold/60 font-mono uppercase tracking-widest">Mastermind</p>
                                            )}
                                        </div>
                                    </div>
                                    {p.isHost && (
                                        <div className="flex items-center gap-2">
                                            <Radio className="w-3 h-3 text-gold animate-pulse" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold">HOST</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Empty Slots */}
                        {[...Array(Math.max(0, 5 - players.length))].map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="p-4 border border-dashed border-white/10 flex items-center justify-center text-text-muted/30 font-mono text-xs tracking-[0.3em]"
                            >
                                AWAITING OPERATIVE
                            </div>
                        ))}
                    </div>

                    {/* Start Button or Waiting Message */}
                    {isHost ? (
                        <button
                            onClick={onStartGame}
                            disabled={players.length < 5}
                            className={clsx(
                                "w-full py-5 font-display font-bold text-lg tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 border-2",
                                players.length >= 5
                                    ? "bg-gradient-to-r from-robber to-neon-purple border-robber text-white hover:shadow-neon-pink"
                                    : "bg-surface border-white/10 text-text-muted cursor-not-allowed"
                            )}
                        >
                            {players.length >= 5 ? (
                                <>
                                    <Play className="w-5 h-5 fill-current" />
                                    COMMENCE HEIST
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    NEED {5 - players.length} MORE
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="p-5 bg-midnight/50 border border-white/10 text-center">
                            <div className="flex items-center justify-center gap-3 text-text-muted font-mono text-sm tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                                AWAITING HOST SIGNAL
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse animation-delay-500" />
                            </div>
                        </div>
                    )}

                    {/* QR Code */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <div className="text-[10px] text-text-muted uppercase tracking-[0.3em] mb-3 font-mono">Mobile Access</div>
                        {qrDataUrl && (
                            <div className="relative inline-block">
                                <img
                                    src={qrDataUrl}
                                    alt="Quick Join"
                                    className="w-28 h-28 mx-auto opacity-60 hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 border border-gold/20" />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
