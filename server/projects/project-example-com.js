const Project = require( './project' );

class ProjectExmpleCom extends Project {
	defaultConfig = {
		url: 'https://example.com',
		width: 1280,
		height: 720,
		quality: 50,
		fps: 30,
	};

	constructor( socket, config = {} ) {
		super( socket, config );
		this.config = { ...this.defaultConfig, ...config };
	}

	async generateLocalizedScreenshot( { actions } ) {
		await this.doPageActions( actions );
		return await this.page.screenshot();
	}
}

module.exports = ProjectExmpleCom;
