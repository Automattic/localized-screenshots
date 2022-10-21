import React from 'react';
import wsClient from '/web-sockets';
import { useCanvasContext, useScreenshotsContext } from '/state';
import { languages } from '/lib/languages';
import LockedScreenController from './controller';
import UploadScreenshots from './upload-screenshots';

export default function Controls() {
	const { lockedScreen } = useCanvasContext();
	const { screenshots } = useScreenshotsContext();
	const [ isLoading, setIsLoading ] = React.useState( false );
	const generateLocalizedScreenshots = () => {
		if ( isLoading ) {
			return;
		}

		const locales = [];
		// @todo use state.
		for ( const option of document.querySelector( '#locales' ).options ) {
			if ( option.selected ) {
				locales.push( option.value );
			}
		}
		const { meta } = lockedScreen;

		wsClient.emit( 'request:localizedScreenshots', { locales, meta } );
		setIsLoading( true );

		const screenshotsInQueue = new Set( locales );
		wsClient.on( 'page:localizedScreenshot', ( { meta } ) => {
			screenshotsInQueue.delete( meta.locale );

			if ( screenshotsInQueue.size === 0 ) {
				wsClient.off( 'page:localizedScreenshot' );
				setIsLoading( false );
			}
		} );
	};

	return (
		<ul className="controls">
			{ ! lockedScreen && (
				<li>
					<LockedScreenController />

					<button
						className="button"
						onClick={ () =>
							! isLoading && wsClient.emit( 'request:screenshot' )
						}
						disabled={ isLoading }
					>
						Take Screenshot
					</button>
				</li>
			) }

			{ lockedScreen && ! screenshots.length && (
				<li>
					<select id="locales" multiple>
						{ languages.map( ( { slug, name } ) => (
							<option key={ slug } value={ slug }>
								{ name }
							</option>
						) ) }
					</select>

					<button
						className="button"
						onClick={ generateLocalizedScreenshots }
					>
						Get Localized Screenshots
					</button>
				</li>
			) }

			{ isLoading && <li>Generating screenshots...</li> }

			{ screenshots.length > 0 && (
				<li>
					<UploadScreenshots />
				</li>
			) }
		</ul>
	);
}
