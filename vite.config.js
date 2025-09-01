import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
export default defineConfig({
	plugins: [tailwindcss()],
	base: "/synaptic/",
	server: {
		port: 5173,
		open: true,
	},
});
