import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss()],

	// Root directory
	root: path.resolve(__dirname, "src"),

	// Build configuration
	build: {
		outDir: path.resolve(__dirname, "src/dist"), // ⬅️ ahora el dist queda dentro de src
		emptyOutDir: true,
	},

	// Alias configuration
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},

	// Server configuration
	server: {
		port: 5173,
		open: true,
	},
});
