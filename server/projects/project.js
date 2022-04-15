const { chromium } = require( 'playwright' );
const throttle = require( 'lodash.throttle' );

class Project {
	socket = null;
	browser = null;
	page = null;
	config = {
		url: 'about:blank',
		width: 1280,
		height: 720,
		quality: 50,
		fps: 30,
	};

	constructor( socket, config = {} ) {
		this.socket = socket;
		this.config = { ...this.config, ...config };

		this.init();
	}

	async init() {
		await this.launchBrowser();
		await this.initPage();
		await this.loadInitialPage();
		await this.initScreencast();

		this.bindUserInputHandlers();
		this.bindRequestHandlers();
	}

	async launchBrowser() {
		this.browser = await chromium.launch();
	}

	async initPage() {
		this.page = await this.browser.newPage();

		await this.page.setViewportSize( {
			width: 1280,
			height: 720,
		} );
	}

	async initScreencast() {
		const client = await this.page.context().newCDPSession( this.page );

		await client.send( 'Page.startScreencast', {
			format: 'jpeg',
			quality: this.config.quality,
			maxWidth: this.config.width,
			maxHeight: this.config.height,
			everyNthFrame: 1,
		} );

		client.on(
			'Page.screencastFrame',
			throttle( async ( { data, sessionId } ) => {
				this.socket.emit( 'page:frame', data );
				await client.send( 'Page.screencastFrameAck', { sessionId } );
			}, 1000 / this.config.fps )
		);
	}

	async loadInitialPage() {
		this.page.goto( this.config.url );
	}

	bindUserInputHandlers() {
		this.socket.on( 'client:mouse', this.handleUserMouseInput );
		this.socket.on( 'client:keyboard', this.handleUserKeyboardInput );
	}

	handleUserMouseInput = async ( { x, y, type } ) => {
		if ( [ 'move', 'click', 'wheel' ].includes( type ) ) {
			await this.page.mouse[ type ]( x, y );
		} else {
			await this.page.mouse[ type ]();
		}
	};

	handleUserKeyboardInput = async () => {
		// @todo
	};

	bindRequestHandlers() {
		this.socket.on( 'request:screenshot', this.handleScreenshotRequest );
		this.socket.on(
			'request:localizedScreenshots',
			this.handleLocalizedScreenshotRequest
		);
	}

	handleScreenshotRequest = async () => {
		const screenshot = await this.page.screenshot();
		this.socket.emit( 'page:screenshot', screenshot.toString( 'base64' ) );
	};

	handleLocalizedScreenshotRequest = async ( locales ) => {
		for ( const locale of locales ) {
			const screenshot = await this.generateLocalizedScreenshot( locale );
			this.socket.emit(
				'page:localizedScreenshot',
				screenshot.toString( 'base64' )
			);
		}
	};

	async generateLocalizedScreenshot( locale ) {
		// @implement
	}
}

module.exports = Project;
