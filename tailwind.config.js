/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./hooks/**/*.{js,ts,jsx,tsx}',
		'./utils/**/*.{js,ts,jsx,tsx}',
	],
	important: '#__next',
	corePlugins: {
		preflight: false,
	},
	theme: {
		extend: {},
	},
	plugins: [],
};
