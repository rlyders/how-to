// import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import yaml from "@rollup/plugin-yaml";
// import vercel from '@sveltejs/adapter-vercel';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			scss: {
				prependData: '@use "src/variables.scss" as *;'
			}
		})
	],

	kit: {
		paths: {
			base: '/how-to',
			assets: '/how-to'
		  },
		// adapter: vercel(),
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null
		  }),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			css: {
				preprocessorOptions: {
					scss: {
						additionalData: '@use "src/variables.scss" as *;'
					}
				}
			},
			plugins: [yaml()],
			build: {
				minify: false
			}
		}
	}
};

export default config;
