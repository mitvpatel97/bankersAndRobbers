import { NextResponse } from 'next/server';
import { getGame, startGame } from '@/lib/gameStore.mjs';
import { assignRoles } from '@/lib/gameLogic';

// Start the game
export async function POST(request, { params }) {
    try {
        const { roomCode } = await params;
        const game = getGame(roomCode.toUpperCase());

        if (!game) {
            return NextResponse.json(
                { success: false, error: 'Game not found' },
                { status: 404 }
            );
        }

        if (game.players.length < 5) {
            return NextResponse.json(
                { success: false, error: 'Need at least 5 players to start' },
                { status: 400 }
            );
        }

        // Assign roles to players
        const playersForRoles = game.players.map(p => ({ id: p.id, name: p.name }));
        const assignedRoles = assignRoles(playersForRoles);

        const result = startGame(roomCode.toUpperCase(), assignedRoles);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error starting game:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to start game' },
            { status: 500 }
        );
    }
}
