# Oscar Picks

A real-time, multiplayer prediction game for the 98th Academy Awards. Players compete to predict Oscar winners across all 24 categories, earn points during a live ceremony reveal, and battle for the top spot on the leaderboard.

## How It Works

1. **Create or Join** - One player creates a game and shares the code (`OSCAR-XXXX`). Others join using the code. An optional host can control the ceremony without playing.
2. **Make Your Picks** - Everyone selects their predicted winners across all 24 categories before the lock deadline.
3. **Live Ceremony** - The host reveals winners one by one during the broadcast. Players earn 10 points per correct pick, with real-time leaderboard updates, sound effects, and confetti celebrations.
4. **Final Results** - See the podium, full standings, and a breakdown of every pick.

## Features

### Game Modes
- **Standard Mode** - Predictions auto-lock at ceremony start time (March 16, 2026 00:00 UTC). Manual lock available once all 24 picks are filled.
- **Test Mode** - For trying things out. Includes randomize picks, add bot players, and manual pick locking with no time restriction.

### Multiplayer
- Up to 6 players per game, plus an optional host
- Real-time sync across all players via Firestore
- Session recovery - if you lose your browser session, rejoin with the same name and game code to reclaim your player slot and picks

### Live Ceremony
- **Host controls** - Set the current category, reveal winners, end the ceremony
- **Player experience** - Live category view, real-time leaderboard, personal picks tracker
- **Celebrations** - Confetti animation and success sound on correct picks, "oh no" sounds on wrong ones

### Avatars & Audio
- Randomizable character avatars powered by [DiceBear Adventurer](https://www.dicebear.com/styles/adventurer/)
- Each avatar has a unique synthesized voice (Animal Crossing-style chirps) - soprano or baritone based on the seed

### Scoring & Leaderboard
- 10 points per correct pick (max 240)
- Tie-aware rankings - players with equal scores and correct picks share the same rank
- Top 3 podium with tie handling

### Nominee Images
- Actor headshots and movie posters fetched from [TMDB](https://www.themoviedb.org/) with localStorage caching

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 with React Compiler |
| Routing | React Router DOM 7 |
| Backend | Firebase (Firestore + Anonymous Auth) |
| Animations | Framer Motion |
| Audio | use-sound + Web Audio API (avatar synthesis) |
| Images | TMDB API |
| Deployment | Vercel |

## Project Structure

```
src/
├── pages/              # Route-level components
│   ├── HomePage        # Sign in, avatar picker, game menu
│   ├── LobbyPage       # Player list, start game
│   ├── PredictionsPage # Pick nominees for all 24 categories
│   ├── LivePage        # Live ceremony view for players
│   ├── AdminPage       # Host control panel
│   └── ResultsPage     # Final standings and podium
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks (useGame, usePredictions, useLeaderboard, etc.)
├── context/            # React context (AuthContext, GameContext)
├── data/               # 24 Oscar categories and nominees
├── utils/              # Scoring, avatar generation, TMDB, time helpers
├── config/             # Firebase init, constants
├── styles/             # CSS theme and global styles
└── types/              # TypeScript interfaces
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- A [Firebase](https://firebase.google.com/) project with Firestore and Anonymous Auth enabled
- A [TMDB API key](https://developer.themoviedb.org/) (for nominee images)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/vreddi/oscars.git
   cd oscars
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root with your Firebase and TMDB credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_TMDB_API_KEY=your_tmdb_key
   ```

4. Start the dev server:
   ```bash
   pnpm dev
   ```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint |

## Firebase Data Model

```
/users/{uid}
  displayName, avatarSeed, createdAt

/games/{gameCode}
  createdBy, phase, testMode, currentCategory, players, revealedCategories
  └── /predictions/{uid}
        picks: { categoryIndex: nomineeId }
        lockedAt: Timestamp | null
```

**Game phases:** `lobby` → `predictions` → `live` → `ended`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Ensure the build passes (`pnpm build`)
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
6. Open a pull request against `main`

### Guidelines

- Keep PRs focused - one feature or fix per PR
- Follow existing code patterns and component structure
- Use TypeScript strictly - no `any` types unless unavoidable
- Test in both standard and test mode before submitting
- Nominees and categories live in `src/data/categories.ts` - update there for future ceremonies

## License

MIT
