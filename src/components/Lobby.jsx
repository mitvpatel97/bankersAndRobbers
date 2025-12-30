'use client'; // Lobby.jsx

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Users, Lock, Unlock, Play, AlertTriangle, Check } from 'lucide-react';
import clsx from 'clsx';
import { BankerIcon, RobberIcon, NoiseOverlay } from './GameAssets';

export default function Lobby({ roomCode, players, isHost, onStartGame }) {
    const [copied, setCopied] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = `${window.location.origin}?room=${roomCode}`;
            QRCode.toDataURL(url, {
                width: 256,
                margin: 0,
                color: { dark: '#0a0a0a', light: '#d97706' }, // Black on Gold
            }).then(setQrDataUrl);
        }
    }, [roomCode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
            <NoiseOverlay />

            {/* Ambient Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-banker/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-robber/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                {/* Visual Panel */}
                <div className="bg-surface/90 backdrop-blur-md border border-white/5 rounded-none shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-12 text-center group">
                    <div className="absolute inset-0 border border-gold/10 m-2 pointer-events-none" />

                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
                        <div className="flex items-center justify-center gap-6 relative z-10">
                            <BankerIcon className="w-24 h-24 text-banker drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                            <RobberIcon className="w-24 h-24 text-robber drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                        </div>
                    </div>

                    <h1 className="text-5xl font-display font-bold text-white tracking-widest mb-2">
                        BANKER <span className="text-gold">&</span> ROBBER
                    </h1>
                    <p className="text-text-secondary font-mono text-sm tracking-widest uppercase mb-10">
                        High Stakes Social Deduction
                    </p>

                    {/* Room Code Display */}
                    <div className="w-full max-w-xs relative group/code cursor-pointer" onClick={handleCopy}>
                        <div className="absolute inset-0 bg-gold/5 blur-lg opacity-0 group-hover/code:opacity-100 transition-opacity" />
                        <div className="bg-black/50 border border-white/10 hover:border-gold/50 transition-colors p-6 flex flex-col items-center gap-2 relative">
                            <span className="text-xs uppercase tracking-widest text-text-muted">Operation Code</span>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-mono font-bold text-gold tracking-[0.2em]">{roomCode}</span>
                                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-text-secondary" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations Panel */}
                <div className="bg-surface/90 backdrop-blur-md border border-white/5 rounded-none shadow-2xl flex flex-col p-8 relative">
                    <div className="absolute inset-0 border border-white/5 m-2 pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                        <h2 className="text-xl font-display text-text-primary tracking-widest flex items-center gap-2">
                            <Users className="w-4 h-4 text-gold" />
                            CREW MANIFEST
                        </h2>
                        <span className={clsx(
                            "font-mono text-xs px-2 py-1 rounded",
                            players.length >= 5 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        )}>
                            {players.length} / 10 RECRUITED
                        </span>
                    </div>

                    <div className="flex-1 space-y-2 mb-8 overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
                        <AnimatePresence>
                            {players.map((p) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={clsx(
                                        "p-3 border flex items-center justify-between group",
                                        p.isHost
                                            ? "bg-gold/5 border-gold/20"
                                            : "bg-white/5 border-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-8 h-8 flex items-center justify-center font-bold font-mono text-sm border",
                                            p.isHost ? "bg-gold text-black border-gold" : "bg-transparent text-text-secondary border-white/20"
                                        )}>
                                            {p.name[0]}
                                        </div>
                                        <div>
                                            <p className={clsx("font-bold font-mono text-sm", p.isHost ? "text-gold" : "text-text-primary")}>
                                                {p.name}
                                            </p>
                                        </div>
                                    </div>
                                    {p.isHost && <span className="text-[10px] uppercase font-bold tracking-widest text-gold opacity-50">Boss</span>}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {/* Empty Slots */}
                        {[...Array(Math.max(0, 5 - players.length))].map((_, i) => (
                            <div key={i} className="p-3 border border-white/5 border-dashed flex items-center justify-center text-white/10 font-mono text-xs tracking-widest">
                                OPEN SLOT
                            </div>
                        ))}
                    </div>

                    {isHost ? (
                        <button
                            onClick={onStartGame}
                            disabled={players.length < 5}
                            className={clsx(
                                "w-full py-5 font-display font-bold text-lg tracking-widest uppercase transition-all flex items-center justify-center gap-3",
                                players.length >= 5
                                    ? "bg-gold text-black hover:bg-white hover:text-black shadow-[0_0_20px_rgba(217,119,6,0.3)]"
                                    : "bg-white/5 text-text-muted cursor-not-allowed border border-white/5"
                            )}
                        >
                            {players.length >= 5 ? <>BEGIN HEIST <Play className="w-4 h-4 fill-current" /></> : <>WAITING FOR CREW <Lock className="w-4 h-4" /></>}
                        </button>
                    ) : (
                        <div className="p-4 bg-black/30 border border-white/5 text-center">
                            <p className="text-text-muted text-xs font-mono animate-pulse tracking-widest">AWAITING SIGNAL FROM BOSS...</p>
                        </div>
                    )}

                    {/* Mobile Join QR Display Alternative */}
                    <div className="mt-4 pt-4 border-t border-white/10 text-center">
                        <div className="text-[10px] text-text-muted uppercase tracking-widest mb-2">Mobile Link</div>
                        {qrDataUrl && (
                            <img src={qrDataUrl} alt="Quick Join" className="w-32 h-32 mx-auto mix-blend-screen opacity-50 hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
