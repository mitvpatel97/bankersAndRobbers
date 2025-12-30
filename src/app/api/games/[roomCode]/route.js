import { NextResponse } from 'next/server';
import { getPublicGameInfo } from '@/lib/gameStore.mjs';

// Get game info
export async function GET(request, { params }) {
    const { roomCode } = await params;
    const game = getPublicGameInfo(roomCode.toUpperCase());

    if (!game) {
        return NextResponse.json(
            { success: false, error: 'Game not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ success: true, game });
}
