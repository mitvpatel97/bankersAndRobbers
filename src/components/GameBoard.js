import styles from './GameBoard.module.css';

export default function GameBoard({ game }) {
    return (
        <div className={styles.board}>
            {/* Game Status Banner */}
            <div className={styles.statusBanner}>
                <h2>
                    {game.status === 'ELECTION' && `Election Phase: Nominate & Vote`}
                    {game.status === 'LEGISLATIVE' && `Legislative Phase: Passing Laws`}
                    {game.status === 'EXECUTIVE' && `Executive Action: ${game.executiveAction}`}
                    {game.status === 'GAME_OVER' && `GAME OVER - ${game.winner.toUpperCase()} WINS!`}
                </h2>
                {game.winReason && <p className={styles.winReason}>{game.winReason}</p>}
            </div>

            {/* Policy Tracks */}
            <div className={styles.tracksContainer}>
                {/* Banker Track */}
                <div className={`${styles.track} ${styles.bankerTrack}`}>
                    <h3>Banker Policies (Good)</h3>
                    <div className={styles.policySlots}>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.slot} ${i < game.policies.banker ? styles.filled : ''}`}
                            >
                                {i < game.policies.banker && '🏦'}
                            </div>
                        ))}
                    </div>
                    <p>Enact 5 to win</p>
                </div>

                {/* Robber Track */}
                <div className={`${styles.track} ${styles.robberTrack}`}>
                    <h3>Robber Policies (Evil)</h3>
                    <div className={styles.policySlots}>
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.slot} ${i < game.policies.robber ? styles.filled : ''}`}
                            >
                                {i < game.policies.robber && '🎭'}
                                {/* Visual powerups based on slot index (1-based logic) */}
                                {i === 2 && <span className={styles.powerup} title="Policy Peek">👀</span>}
                                {i === 3 && <span className={styles.powerup} title="Execution">🔫</span>}
                                {i === 4 && <span className={styles.powerup} title="Execution + Veto Unlock">☠️</span>}
                                {i === 5 && <span className={styles.powerup}>👑</span>}
                            </div>
                        ))}
                    </div>
                    <p>Enact 6 to win</p>
                    {game.vetoUnlocked && <div className={styles.vetoBadge}>VETO POWER UNLOCKED</div>}
                </div>
            </div>

            {/* Election Tracker */}
            <div className={styles.tracker}>
                <h4>Election Tracker (Chaos Counter)</h4>
                <div className={styles.trackerSlots}>
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.trackerDot} ${i < game.electionTracker ? styles.active : ''}`}
                        />
                    ))}
                </div>
                <p>If reaches 3, top policy is enacted!</p>
            </div>

            {/* Last Action Log */}
            <div className={styles.logs}>
                <h3>Game Log</h3>
                <div className={styles.logList}>
                    {game.logs.slice(-5).reverse().map((log, i) => (
                        <p key={i}>{log}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
