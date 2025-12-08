# Tome Toolbox React App

A React application displaying Tome Toolbox data in a beautiful, responsive table with dark mode support.

## Features

- 📊 Interactive data table with formatted numbers
- 🌙 Dark mode toggle with persistent preference
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

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── App.tsx          # Main React component with table
│   ├── main.tsx         # React entry point
│   └── index.css        # Tailwind CSS imports
├── sheet-fns.ts         # Calculation functions
├── tome-strings.ts      # Tome data
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run the original test script

