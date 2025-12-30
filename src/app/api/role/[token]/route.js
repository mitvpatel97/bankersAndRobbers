import { NextResponse } from 'next/server';
import { getPlayerById } from '@/lib/gameStore.mjs';

// Get player role by ID (from QR code)
export async function GET(request, { params }) {
    const { token } = await params;
    const result = getPlayerById(token);

    if (!result) {
        return NextResponse.json(
            { success: false, error: 'Invalid token' },
            { status: 404 }
        );
    }

    const { player, gameStatus, roomCode } = result;

    // Block role access if game hasn't started yet
    if (gameStatus === 'LOBBY' || gameStatus === 'lobby') {
        return NextResponse.json(
            { success: false, error: 'Game not started yet', gameStatus },
            { status: 400 }
        );
    }

    return NextResponse.json({
        success: true,
        player: {
            name: player.name,
            role: player.role,
            team: player.team,
            teamMembers: player.teamMembers,
            mastermind: player.mastermind,
            blindMastermind: player.blindMastermind,
        },
        roomCode,
    });
}
