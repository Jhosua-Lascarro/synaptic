// vite.config.js

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss()],

	// Root directory
	root: path.resolve(__dirname, "src"),

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

	// Build configuration
	build: {
		outDir: path.resolve(__dirname, "dist"),
		emptyOutDir: true,
		sourcemap: false,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, "src/index.html"),
			},
		},
	},
});
