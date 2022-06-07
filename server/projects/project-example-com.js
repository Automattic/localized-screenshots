const Project = require( './project' );

class ProjectExmpleCom extends Project {
	config = {
		url: 'https://example.com',
		width: 1280,
		height: 720,
		quality: 50,
		fps: 30,
	};

	async generateLocalizedScreenshot() {
		return await this.page.screenshot();
	}
}

module.exports = ProjectExmpleCom;
