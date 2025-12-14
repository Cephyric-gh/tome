# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start Vite development server at http://localhost:5173
- `npm run build` - Build production bundle
- `npm run format` - Format TypeScript/TSX/CSS files with Prettier
- `npm run pregen` - Generate tome data from raw source
- `npm run deploy` - Run pregen and build together

## Architecture

### Data Flow

This app displays IdleOn game Tome Toolbox achievement data with scoring calculations.

**Pre-generation Pipeline:**
1. Raw tome data lives in `src/tome/tome-raw.ts`
2. `npm run pregen` processes raw data through helpers in `src/tome/helpers/`
3. Generates `src/app/tome.ts` with calculated `true_max_points` and `true_max_score`
4. App imports from the generated file at runtime

**Runtime Data:**
- User scores stored in localStorage via `useStickyState` hook
- Comparison accounts hardcoded in `src/app/functions/accounts.ts`
- Custom accounts stored in localStorage via `src/app/functions/custom-accounts.ts`
- "Best" account dynamically calculated as max score across all accounts for each achievement

### Core Calculation System

**Sheet Functions** (`src/app/functions/sheet-fns.ts`):
- `IDLEONNUM(input)` - Parses IdleOn number notation (K, M, B, T, Q, QQ, QQQ suffixes)
- `POINTS(n, value)` - Calculates points for achievement index `n` with score `value`
  - Uses 5 formula types (0-4) based on `tome[n].formula_type`
  - Each formula has different mathematical curves for scoring
  - Returns ceiling of calculated value × `max_points`

**Tome Data Structure** (`TomeItem` type):
```typescript
{
  title: string;              // Achievement name
  max_points: number;         // Maximum points achievable
  formula_type: number;       // Which POINTS formula to use (0-4)
  max_score: number;          // Score needed for max points
  true_max_points: number;    // Pre-calculated actual max points
  true_max_score: number | string; // Pre-calculated score for true max
}
```

### Component Organization

**Main App** (`src/app/App.tsx`):
- Manages state for scores, filters, and dialogs
- Calculates total points for user and comparison account
- Orchestrates child components

**Key Components** (`src/app/components/`):
- `FiltersBar` - Comparison selector, view toggle (points/scores), checkboxes (show max, highlight row)
- `TotalPointsBox` - Displays total points for user vs comparison with diff
- `ToolboxTable` - Main data table with per-achievement comparisons
- `ImportDialog` - Parses IdleOnToolbox copy/paste data
- `BulkImportDialog` - Dev-only feature for bulk account imports
- `ExportDialog` - JSON export with copy button
- `ManageAccountsDialog` - Manage custom comparison accounts

**Color Gradient System:**
The diff columns use RGB interpolation between color stops:
- ≤ -100: Red (red-600/400)
- -10: Yellow (yellow-600/400)
- ≥ 0: Green (green-600/400)
Colors smoothly transition between these thresholds for both light and dark modes.

### State Persistence

`useStickyState` hook syncs React state with localStorage automatically. Used for storing user's toolbox scores between sessions.

### Account Management

**Hardcoded Accounts:** 10 reference accounts in `src/app/functions/accounts.ts`
**Custom Accounts:** User can import and save custom accounts via localStorage
**Best Account:** Virtual account showing the maximum score for each achievement across all accounts (hardcoded + custom)
