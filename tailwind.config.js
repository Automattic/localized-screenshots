/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [ './client/**/*.js', './public/index.html' ],
	theme: {
		extend: {},
	},
	plugins: [ require( '@tailwindcss/forms' ) ],
};
