import React from 'react';
import wsClient from './web-sockets';

const Frame = ( { screenshot } ) => {
	const [ isLoading, setIsLoading ] = React.useState( false );
	const localizeScreenshot = () => {
		const locales = [];
		for ( const option of document.querySelector( '#locales' ).options ) {
			if ( option.selected ) {
				locales.push( option.value );
			}
		}
		const { meta } = screenshot;

		wsClient.emit( 'request:localizedScreenshots', { locales, meta } );
		setIsLoading( true );
	};

	return (
		<ul className="controls">
			{ ! screenshot && (
				<li>
					<button
						onClick={ () =>
							! isLoading && wsClient.emit( 'request:screenshot' )
						}
						disabled={ isLoading }
					>
						Lock Screenshot
					</button>
				</li>
			) }

			{ screenshot && (
				<li>
					<select id="locales" multiple>
						<option value="en">English</option>
						<option value="es">Spanish</option>
						<option value="pt-br">Brazilian Portuguese</option>
						<option value="de">German</option>
						<option value="fr">French</option>
						<option value="he">Hebrew</option>
						<option value="ja">Japanese</option>
						<option value="it">Italian</option>
						<option value="nl">Dutch</option>
						<option value="ru">Russian</option>
						<option value="tr">Turkish</option>
						<option value="id">Indonesian</option>
						<option value="zh-cn">Chinese (China)</option>
						<option value="zh-tw">Chinese (Taiwan)</option>
						<option value="ko">Korean</option>
						<option value="ar">Arabic</option>
						<option value="sv">Swedish</option>
					</select>

					<button onClick={ localizeScreenshot }>
						Get Localized Screenshots
					</button>
				</li>
			) }
		</ul>
	);
};

export default Frame;
