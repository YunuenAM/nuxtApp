import { resolve } from 'path';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
	css: ['vuetify/styles'],
	alias: {
		'@': resolve(__dirname, './src'),
		'~': resolve(__dirname, './'),
	},
	vite: {
		ssr: {
			noExternal: ['vuetify'], // NECESARIO para evitar error con .css
		},
	},
});