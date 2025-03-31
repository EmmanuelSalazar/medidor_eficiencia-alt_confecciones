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
					label: 'Comienza Aquí',
					autogenerate: { directory: 'inicio' },
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'Arquitectura',
					autogenerate: { directory: 'arquitectura' },
				},
			],
		}),
	],
	markdown: {
		remarkPlugins: [remarkMermaid],
	},
});
