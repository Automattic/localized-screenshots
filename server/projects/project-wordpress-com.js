const Project = require( './project' );

class ProjectWordPressCom extends Project {
	config = {
		url: 'https://wordpress.com',
		width: 1280,
		height: 720,
		quality: 50,
		fps: 30,
	};

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
		await this.page.click( '.language-picker' );
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

	async generateLocalizedScreenshot( locale ) {
		const currentUrl = await this.page.url();
		await this.changeLocale( locale );
		await this.page.goto( currentUrl );
		return await this.page.screenshot();
	}
}

module.exports = ProjectWordPressCom;
