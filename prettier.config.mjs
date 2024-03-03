/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
	endOfLine: 'auto',
	semi: false,
	useTabs: true,
	singleQuote: true,
	arrowParens: 'avoid',
	tabWidth: 2,
	trailingComma: 'none',
	plugins: ['prettier-plugin-tailwindcss']
}

export default config
