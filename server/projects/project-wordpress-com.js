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
		await this.page.goto( `${ this.config.url }/me/account` );
		await this.page.click( '.language-picker:not(.is-loading)' );

		await this.page.click( '.search-component__icon-navigation:visible' );
		await this.page.fill( '.search-component__input:visible', locale );
		await this.page.click(
			`.language-picker-component__language-buttons [lang=${ locale }]`
		);
		await this.page.click(
			'.language-picker__modal-buttons .is-secondary'
		);
		await this.page.waitForSelector( '.language-picker:not(:disabled)' );
	}

	async generateLocalizedScreenshot( {
		url,
		locale,
		scrollX,
		scrollY,
		actions,
	} ) {
		await this.changeLocale( locale );
		await this.page.goto( url, { waitUntil: 'networkidle' } );
		await this.page.waitForNavigation( { waitUntil: 'networkidle' } );
		await this.page.evaluate(
			( scroll ) => window.scrollTo( scroll.scrollX, scroll.scrollY ),
			{ scrollX, scrollY }
		);
		await this.doPageActions( actions );
		return await this.page.screenshot();
	}
}

module.exports = ProjectWordPressCom;
