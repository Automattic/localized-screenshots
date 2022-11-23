const { chromium } = require( 'playwright' );
const throttle = require( 'lodash.throttle' );

class Project {
	socket = null;
	browser = null;
	page = null;
	defaultConfig = {
		url: 'about:blank',
		width: 1280,
		height: 720,
		quality: 50,
		fps: 30,
	};
	cursor = null;

	constructor( socket, config = {} ) {
		this.socket = socket;
		this.config = { ...this.defaultConfig, ...config };

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
			width: this.config.width,
			height: this.config.height,
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

		await this.updateCursor( x, y );
	};

	handleUserKeyboardInput = async ( { type, key } ) => {
		if ( [ 'down', 'press', 'up' ].includes( type ) ) {
			await this.page.keyboard[ type ]( key );
		}
	};

	bindRequestHandlers() {
		this.socket.on( 'request:screenshot', this.handleScreenshotRequest );
		this.socket.on(
			'request:localizedScreenshots',
			this.handleLocalizedScreenshotRequest
		);
	}

	getPageData = async () => {
		return {
			url: await this.page.url(),
			scrollX: await this.page.evaluate( () => window.scrollX ),
			scrollY: await this.page.evaluate( () => window.scrollY ),
		};
	};

	handleScreenshotRequest = async () => {
		const screenshot = await this.page.screenshot();
		const page = await this.getPageData();
		const payload = {
			data: `data:image/png;base64,${ screenshot.toString( 'base64' ) }`,
			page,
		};
		this.socket.emit( 'page:screenshot', payload );
	};

	handleLocalizedScreenshotRequest = async ( { locales, page } ) => {
		for ( const locale of locales ) {
			const screenshot = await this.generateLocalizedScreenshot( {
				...page,
				locale,
			} );
			const pageData = await this.getPageData();
			const payload = {
				data: `data:image/png;base64,${ screenshot.toString(
					'base64'
				) }`,
				meta: {
					locale,
					page: pageData,
				},
			};
			this.socket.emit( 'page:localizedScreenshot', payload );
		}
	};

	async updateCursor( x, y ) {
		let cursor;

		try {
			cursor = await this.page.evaluate(
				( [ x, y ] ) => {
					const target = document.elementFromPoint( x, y );

					return window.getComputedStyle( target )[ 'cursor' ];
				},
				[ x, y ]
			);

			// Detect whether the pointer is over a text node.
			if ( cursor === 'auto' ) {
				cursor = await this.page.evaluate(
					( [ x, y ] ) => {
						const range = document.caretRangeFromPoint( x, y );
						range.selectNodeContents( range.startContainer );
						const { left, top, width, height } =
							range.getBoundingClientRect();
						const isText =
							left <= x &&
							left + width >= x &&
							top <= y &&
							top + height >= y;
						return isText ? 'text' : 'auto';
					},
					[ x, y ]
				);
			}
		} catch {}

		if ( this._cursor !== cursor ) {
			this.socket.emit( 'page:cursor', cursor );
			this._cursor = cursor;
		}
	}

	async generateLocalizedScreenshot( { url, locale, scrollX, scrollY } ) {
		// @implement
	}
}

module.exports = Project;
