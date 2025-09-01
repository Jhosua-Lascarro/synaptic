// vite.config.js

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	 base: '/synaptic/',
	plugins: [tailwindcss()],

	build: {
    	outDir: '../dist',
		emptyOutDir: true
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
