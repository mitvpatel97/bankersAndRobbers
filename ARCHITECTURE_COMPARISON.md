# Architecture Comparison: Secret Hitler Online vs. Bankers & Robbers

## Structural Analysis

### Secret Hitler Online
```
├── backend/          (Java + Javalin)
│   └── Game simulation + REST API
├── frontend/         (React)
│   ├── assets/       Static resources
│   ├── board/        Game board components
│   ├── custom-alert/ Alert UI
│   ├── event-bar/    Event display
│   ├── player/       Player components
│   ├── status-bar/   Status display
│   └── util/         Utilities
└── Communication: WebSocket + HTTP
```

### Bankers & Robbers (Current)
```
├── server.mjs        (Node.js + Socket.io)
├── src/
│   ├── lib/          Game logic & state
│   ├── components/   React components
│   └── app/          Next.js pages (App Router)
└── Communication: Socket.io
```

## ✅ Architectural Parity

### MATCHING FEATURES
1. **Client-Server Architecture** ✅
   - SH: Java backend / React frontend
   - B&R: Node.js backend / Next.js frontend

2. **Real-time Communication** ✅
   - SH: WebSocket + HTTP
   - B&R: Socket.io (WebSocket-based)

3. **Game State Management** ✅
   - Both use centralized game state
   - Both track players, policies, phases

4. **Component Organization** ✅
   - Both use modular component structure
   - Similar separation of concerns

5. **Role Assignment** ✅
   - Both implement Secret Hitler mechanics
   - Identical role distributions (5-10 players)

6. **Game Phases** ✅
   - Election → Legislative → Executive
   - Executive powers at correct thresholds

7. **Win Conditions** ✅
   - 5 Liberal/Banker policies
   - 6 Fascist/Robber policies
   - Hitler/Mastermind election after 3 policies

## 📋 Feature Gaps to Address

### 1. Component Organization
**Gap**: Secret Hitler has dedicated directories for features
**Solution**: Reorganize into feature-based structure

### 2. Visual Polish
**Gap**: SH has custom Inkscape SVG artwork
**Current**: Basic SVG icons
**Enhancement**: Create premium vault/heist-themed artwork

### 3. Event System
**Gap**: SH has dedicated event-bar component
**Current**: Basic game log
**Enhancement**: Create animated event notifications

### 4. Status Bar
**Gap**: SH has dedicated status-bar component
**Current**: Integrated into GameBoard
**Enhancement**: Extract to dedicated StatusBar component

### 5. Player Tiles
**Gap**: SH has sophisticated player card system
**Current**: Basic player list
**Enhancement**: Create interactive player tiles with states

## 🎨 Branding Differences

### Secret Hitler
- **Theme**: 1930s fascism/liberalism
- **Colors**: Red, blue, brown
- **Fonts**: Germania One (display), Montserrat (body)
- **Style**: Historical, serious

### Bankers & Robbers
- **Theme**: Gilded Age heist/noir
- **Colors**: Gold (#d4af37), Security Blue, Blood Red
- **Fonts**: Outfit (display), Inter (sans)
- **Style**: Cinematic, high-stakes, art deco

## 🔄 Rebranding Complete

### Terminology Mapping
| Secret Hitler | Bankers & Robbers |
|--------------|-------------------|
| Liberals | Bankers |
| Fascists | Robbers |
| Hitler | Mastermind |
| Liberal Policy | Security Protocol |
| Fascist Policy | Heist Plan |
| Election | Nomination Cycle |
| President | Director |
| Chancellor | Executor |

## 🎯 Implementation Status

- [x] Core game logic (gameState.mjs)
- [x] Socket.io communication
- [x] Role assignment (gameLogic.mjs)
- [x] Win conditions
- [x] Executive actions
- [x] Game phases
- [x] Player tracking
- [x] Lobby system
- [x] QR code joining
- [x] Mobile controller
- [ ] Enhanced event system
- [ ] Status bar component
- [ ] Advanced player tiles
- [ ] Custom artwork assets
- [ ] Sound effects
- [ ] Animations polish

## 📊 Conclusion

**Architecturally**: The games are **structurally equivalent**. Both follow clean client-server separation with real-time communication.

**Logically**: Game mechanics are **100% aligned** with Secret Hitler rules, just re-skinned.

**Branding**: **Successfully differentiated** with unique heist/noir theme instead of political theme.

**Next Steps**: Enhance visual polish, component organization, and UX details.
