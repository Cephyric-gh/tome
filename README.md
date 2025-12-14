# IdleOn Tome Toolbox Tracker

A React application for tracking and comparing IdleOn Tome Toolbox achievement scores with advanced points calculation and comparison features.

## Features

- 📊 Interactive achievement table with points and score tracking
- 🔄 Import/Export functionality for IdleOnToolbox data
- 👥 Compare your progress against reference accounts
- 🎯 Dynamic "Best" account showing max scores across all comparisons
- 📈 Color-coded diff columns with smooth gradient transitions
- 🧮 5 different formula types for points calculation
- 🌙 Dark mode support with persistent preference
- 💾 LocalStorage persistence for your scores
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast development with Vite
- 📱 Responsive design

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

Generate tome data and build:

```bash
npm run deploy
```

Or run steps separately:

```bash
npm run pregen  # Generate tome data from raw source
npm run build   # Build production bundle
```

### Format Code

```bash
npm run format
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main app component
│   │   ├── tome.ts                    # Generated tome data (from pregen)
│   │   ├── components/                # React components
│   │   │   ├── TotalPointsBox.tsx    # Total points display
│   │   │   ├── FiltersBar.tsx        # Filters and view toggles
│   │   │   ├── ToolboxTable.tsx      # Main achievement table
│   │   │   ├── ImportDialog.tsx      # Import from IdleOnToolbox
│   │   │   └── ExportDialog.tsx      # JSON export
│   │   ├── functions/
│   │   │   ├── sheet-fns.ts          # POINTS() and IDLEONNUM() calculations
│   │   │   └── accounts.ts           # Comparison account data
│   │   └── hooks/
│   │       └── useStickyState.ts     # LocalStorage state hook
│   └── tome/
│       ├── tome-raw.ts                # Raw tome achievement data
│       └── helpers/                   # Pre-generation helpers
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Pages deployment
└── public/                            # Static assets
```

## How It Works

### Data Flow

1. **Pre-generation**: Raw tome data in `src/tome/tome-raw.ts` is processed by `npm run pregen` to calculate `true_max_points` and `true_max_score`, generating `src/app/tome.ts`
2. **Runtime**: App loads generated data and user scores from localStorage
3. **Comparison**: Your scores are compared against hardcoded reference accounts and a dynamic "Best" account

### Points Calculation

The app uses 5 different formula types (0-4) to calculate points based on scores:
- `IDLEONNUM(input)` - Parses IdleOn number notation (K, M, B, T, Q, etc.)
- `POINTS(n, value)` - Calculates points for achievement `n` with score `value`
  - Each formula type uses different mathematical curves
  - Returns ceiling of calculated value × `max_points`

### Color Gradient System

Diff columns use RGB interpolation between:
- ≤ -100: Red
- -10: Yellow
- ≥ 0: Green

## Deployment

The app is automatically deployed to GitHub Pages on push to main branch via GitHub Actions.

