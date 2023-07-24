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
		await this.page.waitForSelector( '.masterbar__item-me-label', {
			state: 'attached',
		} );
		await this.page.goto( `${ this.config.url }` );
	}

	async login() {
		await this.page.goto( `${ this.config.url }/log-in` );

		await this.page.fill( '#usernameOrEmail', process.env.WPCOM_USER );
		await this.page.click( '.login__form-action button[type=submit]' );
		await this.page.fill( '#password', process.env.WPCOM_PASS );
		await this.page.click( '.login__form-action button[type=submit]' );
	}

	async changeLocale( locale ) {
		const page = await this.page.context().newPage();

		await page.goto( `${ this.config.url }/me/account` );
		await page.click( '.language-picker:not(.is-loading)' );

		await page.click( '.search-component__icon-navigation:visible' );
		await page.fill( '.search-component__input:visible', locale );
		await page.click(
			`.language-picker-component__language-buttons [lang=${ locale }]`
		);
		await page.click( '.language-picker__modal-buttons .is-secondary' );
		await page.waitForSelector( '.language-picker:not(:disabled)' );

		await page.close();
	}

	async generateLocalizedScreenshot( {
		url,
		locale,
		scrollX,
		scrollY,
		actions,
	} ) {
		await this.changeLocale( locale );
		const page = await this.page.context().newPage();
		await page.goto( url, { waitUntil: 'networkidle' } );
		await page.evaluate(
			( scroll ) => window.scrollTo( scroll.scrollX, scroll.scrollY ),
			{ scrollX, scrollY }
		);
		await this.doPageActions( page, actions );
		const screenshot = await page.screenshot();
		await page.close();

		return screenshot;
	}
}

module.exports = ProjectWordPressCom;
