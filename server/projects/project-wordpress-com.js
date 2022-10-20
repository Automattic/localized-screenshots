const Project = require( './project' );

class ProjectWordPressCom extends Project {
	defaultConfig = {
		url: 'https://wordpress.com',
		width: 1280,
		height: 720,
		quality: 50,
		fps: 30,
	};

	constructor( socket, config = {} ) {
		super( socket, config );
		this.config = { ...this.defaultConfig, ...config };
	}

	async loadInitialPage() {
		await this.login();
	}

	async login() {
		await this.page.goto( `${ this.config.url }/log-in` );

		await this.page.fill( '#usernameOrEmail', process.env.WPCOM_USER );
		await this.page.click( '.login__form-action button[type=submit]' );
		await this.page.fill( '#password', process.env.WPCOM_PASS );
		await this.page.click( '.login__form-action button[type=submit]' );
	}

	async changeLocale( locale ) {
		await this.page.click( '.masterbar__item.masterbar__item-me' );
		await this.page.click( '.sidebar__menu li:nth-child(2) a' );
		await this.page.click( '.language-picker:not(.is-loading)' );
		await this.page.fill(
			'.language-picker-component__search-desktop .search-component__input',
			locale
		);
		await this.page.click(
			`.language-picker-component__language-buttons [lang=${ locale }]`
		);
		await this.page.click(
			'.language-picker__modal-buttons .is-secondary'
		);
		await this.page.waitForSelector( '.language-picker:not(:disabled)' );
	}

	async generateLocalizedScreenshot( { url, locale, scrollX, scrollY } ) {
		await this.changeLocale( locale );
		await this.page.goto( url, { waitUntil: 'networkidle' } );
		await this.page.evaluate(
			( scroll ) => window.scrollTo( scroll.scrollX, scroll.scrollY ),
			{ scrollX, scrollY }
		);
		return await this.page.screenshot();
	}
}

module.exports = ProjectWordPressCom;
