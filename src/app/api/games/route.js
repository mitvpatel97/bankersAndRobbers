import { NextResponse } from 'next/server';
import { createGame, getGame } from '@/lib/gameStore.mjs';
import { generateRoomCode } from '@/lib/gameLogic';

// Create a new game
export async function POST(request) {
    try {
        const { hostName } = await request.json();

        if (!hostName || hostName.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Host name is required' },
                { status: 400 }
            );
        }

        // Generate unique room code
        let roomCode;
        let attempts = 0;
        do {
            roomCode = generateRoomCode();
            attempts++;
        } while (getGame(roomCode) && attempts < 10);

        if (attempts >= 10) {
            return NextResponse.json(
                { success: false, error: 'Failed to generate room code' },
                { status: 500 }
            );
        }

        const { game, hostToken } = createGame(roomCode, hostName.trim());

        return NextResponse.json({
            success: true,
            roomCode: game.roomCode,
            token: hostToken,
        });
    } catch (error) {
        console.error('Error creating game:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create game' },
            { status: 500 }
        );
    }
}
