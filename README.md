# 🏦 Banker & Robber 🎭

A **social deduction game** for 5-10 players, inspired by Secret Hitler. One team protects the vault, the other plans the heist. Trust no one.

![Game Theme](https://img.shields.io/badge/Theme-Gilded%20Noir-gold) ![Players](https://img.shields.io/badge/Players-5--10-blue) ![Status](https://img.shields.io/badge/Status-Playable-green)

---

## 🎮 How to Play

### The Setup
Players are secretly divided into two teams:
- **Bankers** (Liberals) - Protect the vault by passing Security Protocols
- **Robbers** (Fascists) - Sabotage security and help the **Mastermind** seize power

One player is the **Mastermind** (Hitler) - if elected Chancellor after 3 Heist Plans pass, the Robbers win instantly!

### Winning Conditions
| Team | Victory Condition |
|------|-------------------|
| 🏦 Bankers | Pass **5 Security Protocols** OR execute the Mastermind |
| 🎭 Robbers | Pass **6 Heist Plans** OR elect the Mastermind as Chancellor (after 3 Heist Plans) |

### Game Flow
1. **Election** - President nominates a Chancellor, everyone votes
2. **Legislative** - President draws 3 policies, discards 1. Chancellor receives 2, enacts 1
3. **Executive Actions** - Triggered by Heist Plans (investigate, peek, execute, special election)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone https://github.com/mitvpatel97/bankersAndRobbers.git
cd bankersAndRobbers
npm install
```

### Running the Game
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Playing with Friends
1. **Host** creates a game and shares the room code
2. Players join via room code or QR scan
3. Once 5+ players join, host starts the game
4. Each player scans their personal QR code to access their secret role on their phone

---

## 🎨 Features

### Dual-Screen Experience
- **Main Display** (TV/Laptop) - Shows game board, policy tracks, election tracker
- **Player Controllers** (Phone) - Each player's secret role and action buttons

### Anonymous Role Assignment
Roles are automatically and secretly assigned when the game starts:
- Robbers know each other and the Mastermind
- Mastermind may or may not know Robbers (depends on player count)
- Bankers know nothing

### Role Distribution
| Players | Bankers | Robbers | Mastermind |
|---------|---------|---------|------------|
| 5       | 3       | 1       | 1          |
| 6       | 4       | 1       | 1          |
| 7       | 4       | 2       | 1          |
| 8       | 5       | 2       | 1          |
| 9       | 5       | 3       | 1          |
| 10      | 6       | 3       | 1          |

### Executive Actions (Heist Plan Track)
| Policy # | 5-6 Players | 7-8 Players | 9-10 Players |
|----------|-------------|-------------|--------------|
| 1        | -           | -           | Investigate  |
| 2        | -           | Investigate | Investigate  |
| 3        | Policy Peek | Special Election | Special Election |
| 4        | Execution   | Execution   | Execution    |
| 5        | Execution + Veto | Execution + Veto | Execution + Veto |

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Node.js, Socket.io
- **Styling**: Custom "Gilded Noir" theme with SVG assets
- **Real-time**: WebSocket connections for live game state

---

## 📁 Project Structure

```
bankersAndRobbers/
├── src/
│   ├── app/              # Next.js pages
│   │   ├── page.js       # Landing page
│   │   ├── lobby/        # Lobby waiting room
│   │   ├── game/         # Main game board
│   │   ├── role/         # Player controller (mobile)
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── Lobby.jsx     # Lobby UI
│   │   ├── GameBoard.jsx # Main game display
│   │   ├── PlayerController.jsx # Mobile player interface
│   │   └── GameAssets.jsx # SVG icons and assets
│   └── lib/              # Game logic
│       ├── gameState.mjs # Core game state machine
│       ├── gameLogic.mjs # Role assignment, shuffle
│       ├── gameStore.mjs # In-memory state store
│       └── socket.js     # Socket.io client
├── server.mjs            # Custom Node.js server with Socket.io
└── tailwind.config.js    # Theme configuration
```

---

## 🎭 Theme: Gilded Noir

A cinematic heist aesthetic featuring:
- Deep charcoal backgrounds with subtle texture
- Gold accents for high-stakes moments
- Security Blue (Bankers) vs Blood Red (Robbers)
- Monospace "classified dossier" typography

---

## 📄 License

MIT License - Feel free to fork and create your own themed version!

---

## 🙏 Credits

Game mechanics inspired by [Secret Hitler](https://www.secrethitler.com/) - original game by Goat, Wolf, & Cabbage.

Built with ❤️ using Next.js and Socket.io.
