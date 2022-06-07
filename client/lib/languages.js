export const languages = [
	{
		slug: 'en',
		name: 'English',
		rtl: false,
	},
	{
		slug: 'es',
		name: 'Spanish',
		rtl: false,
	},
	{
		slug: 'pt-br',
		name: 'Brazilian Portuguese',
		rtl: false,
	},
	{
		slug: 'de',
		name: 'German',
		rtl: false,
	},
	{
		slug: 'fr',
		name: 'French',
		rtl: false,
	},
	{
		slug: 'he',
		name: 'Hebrew',
		rtl: true,
	},
	{
		slug: 'ja',
		name: 'Japanese',
		rtl: false,
	},
	{
		slug: 'it',
		name: 'Italian',
		rtl: false,
	},
	{
		slug: 'nl',
		name: 'Dutch',
		rtl: false,
	},
	{
		slug: 'ru',
		name: 'Russian',
		rtl: false,
	},
	{
		slug: 'tr',
		name: 'Turkish',
		rtl: false,
	},
	{
		slug: 'id',
		name: 'Indonesian',
		rtl: false,
	},
	{
		slug: 'zh-cn',
		name: 'Chinese (China)',
		rtl: false,
	},
	{
		slug: 'zh-tw',
		name: 'Chinese (Taiwan)',
		rtl: false,
	},
	{
		slug: 'ko',
		name: 'Korean',
		rtl: false,
	},
	{
		slug: 'ar',
		name: 'Arabic',
		rtl: true,
	},
	{
		slug: 'sv',
		name: 'Swedish',
		rtl: false,
	},
];

/**
 * Get language by slug.
 *
 * @param  {string} slug Language slug
 * @return {object}      Language object.
 */
export function getLanguageBySlug( slug ) {
	return languages.find( ( language ) => language.slug === slug );
}

export default languages;
