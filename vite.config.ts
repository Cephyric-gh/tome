import { type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default {
    root: "src/app",
    base: "/tome/",
    publicDir: "/public/",
    plugins: [react(), tailwindcss()],
    build: { outDir: "../../dist", emptyOutDir: true },
    define: {
        "import.meta.env.VITE_LAST_LEADERBOARD_UPDATE": '"2025-12-29 00:00"',
    },
} satisfies UserConfig;
