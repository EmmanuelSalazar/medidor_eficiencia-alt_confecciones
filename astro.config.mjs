// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMermaid from 'remark-mermaidjs';
export default defineConfig({
	integrations: [
		starlight({
			title: 'ALT-Confecciones',
			social: {
				github: 'https://github.com/EmmanuelSalazar',
			},
			sidebar: [
				{
					label: 'Introducción',
					autogenerate: { directory: 'introduccion' },
				},
				{
					label: 'Arquitectura',
					autogenerate: { directory: 'arquitectura' },
				},
				{
					label: 'API',
					autogenerate: { directory: 'api' },
				},
			],
		}),
	],
	markdown: {
		remarkPlugins: [remarkMermaid],
	},
});
