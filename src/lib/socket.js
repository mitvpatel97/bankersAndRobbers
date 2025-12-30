'use client';

import { io } from 'socket.io-client';

// Singleton socket instance
let socket;

export const getSocket = () => {
    if (!socket) {
        socket = io();
    }
    return socket;
};
