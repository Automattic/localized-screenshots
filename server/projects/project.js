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
	isRecordingActions = true;

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
		await this.maybeRecordAction( { type, x, y } );

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

	handleLocalizedScreenshotRequest = async ( { locales, page, actions } ) => {
		for ( const locale of locales ) {
			const screenshot = await this.generateLocalizedScreenshot( {
				...page,
				actions,
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

	async doPageActions( actions ) {
		if ( ! actions ) {
			return;
		}

		try {
			for ( const action of actions ) {
				if ( action.type === 'click' ) {
					await this.page.click( action.selector, { timeout: 2000 } );
				}
			}
		} catch ( error ) {
			console.log( error );
			// Unable to execute page actions.
		}
	}

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

	async maybeRecordAction( { type, x, y } ) {
		if ( ! this.isRecordingActions ) {
			return;
		}

		if ( type === 'click' ) {
			await this.recordMouseAction( { type, x, y } );
		}
	}

	async recordMouseAction( { type, x, y } ) {
		const selector = (
			( await this.getElementSelectorFromPoint( x, y ) ) ?? []
		).join( ' ' );
		const payload = {
			type,
			selector,
		};
		this.socket.emit( 'page:action', payload );
	}

	async getElementSelectorFromPoint( x, y ) {
		return await this.page.evaluate(
			( [ x, y ] ) => {
				let element = document.elementFromPoint( x, y );
				const path = [];

				while (
					element?.parentNode &&
					element?.parentNode?.localName !== 'html'
				) {
					// An element with ID attribute adds enough specificity to the selector path,
					// and therefore going futher up the DOM tree is not needed.
					if ( element.id ) {
						path.unshift( `#${ element.id }` );
						break;
					}

					let selector;

					if ( element.classList.length ) {
						selector = `.${ [ ...element.classList ].join( '.' ) }`;
					} else {
						selector = element.localName.toLowerCase();
					}

					// Append :nth-child() to the selector if element has sibligns
					// with matching class/tag selector.
					const hasMatchingSiblings = [
						...element.parentNode.children,
					].some( ( _element ) => {
						return (
							_element !== element && _element.matches( selector )
						);
					} );

					if ( hasMatchingSiblings ) {
						const index = [
							...element.parentNode.children,
						].indexOf( element );
						selector = `${ selector }:nth-child(${ index + 1 })`;
					}

					path.unshift( selector );

					element = element.parentNode;
				}

				// @todo:
				// Selector could be optimized by dropping the unnecessary segments from the path array,
				// so that it still matches only the target element on the page, but making the selector
				// a bit more flexible to smaller DOM changes.

				return path;
			},
			[ x, y ]
		);
	}

	async generateLocalizedScreenshot( { url, locale, scrollX, scrollY } ) {
		// @implement
	}
}

module.exports = Project;
