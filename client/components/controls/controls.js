import React from 'react';
import wsClient from '/web-sockets';
import { useCanvasContext, useScreenshotsContext } from '/state';
import { languages } from '/lib/languages';
import LockedScreenController from './controller';

export default function Controls() {
	const { lockedScreen } = useCanvasContext();
	const { screenshots } = useScreenshotsContext();
	const [ isLoading, setIsLoading ] = React.useState( false );
	const generateLocalizedScreenshots = () => {
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
	};

	return (
		<ul className="controls">
			{ ! lockedScreen && (
				<li>
					<LockedScreenController />

					<button
						onClick={ () =>
							! isLoading && wsClient.emit( 'request:screenshot' )
						}
						disabled={ isLoading }
					>
						Take Screenshot
					</button>
				</li>
			) }

			{ lockedScreen && (
				<li>
					<select id="locales" multiple>
						{ languages.map( ( { slug, name } ) => (
							<option key={ slug } value={ slug }>
								{ name }
							</option>
						) ) }
					</select>

					<button onClick={ generateLocalizedScreenshots }>
						Get Localized Screenshots
					</button>
				</li>
			) }

			{ isLoading &&
				screenshots.length === 0 &&
				'Generating screenshots...' }
		</ul>
	);
}
