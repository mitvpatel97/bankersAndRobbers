import { NextResponse } from 'next/server';
import { joinGame } from '@/lib/gameStore.mjs';

// Join a game
export async function POST(request, { params }) {
    try {
        const { roomCode } = await params;
        const { playerName } = await request.json();

        if (!playerName || playerName.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Player name is required' },
                { status: 400 }
            );
        }

        const result = joinGame(roomCode.toUpperCase(), playerName.trim());

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            token: result.player.token,
            playerId: result.player.id,
        });
    } catch (error) {
        console.error('Error joining game:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to join game' },
            { status: 500 }
        );
    }
}
