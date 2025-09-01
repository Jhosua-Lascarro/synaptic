// vite.config.js

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	base: 'SynapTic',
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
});
