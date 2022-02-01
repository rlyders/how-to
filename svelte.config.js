import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import yaml from "@rollup/plugin-yaml";
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		paths: {
			base: process.env.NODE_ENV === 'development' ? undefined : '/how-to'
		  },
		  adapter: vercel(),
		// adapter: adapter({
		// 	// default options are shown
		// 	pages: 'build',
		// 	assets: 'build',
		// 	fallback: null,
		// 	precompress: false
		// }),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			plugins: [yaml()]
		}
	}
};

export default config;
