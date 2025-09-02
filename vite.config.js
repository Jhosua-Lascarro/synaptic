// vite.config.js

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		// Plugin to copy _redirects file
		{
			name: 'copy-redirects',
			generateBundle() {
				this.emitFile({
					type: 'asset',
					fileName: '_redirects',
					source: '/*    /index.html   200'
				});
			}
		}
	],

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
		// Copy _redirects file for Netlify compatibility
		copyPublicDir: false,
		assetsInclude: ['**/_redirects']
	},
});
