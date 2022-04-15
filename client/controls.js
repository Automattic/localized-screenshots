import React from 'react';
import wsClient from './web-sockets';

const Frame = () => {
	return (
		<ul className="controls">
			<li>
				<button onClick={ () => wsClient.emit( 'request:screenshot' ) }>
					Lock Screenshot
				</button>
			</li>

			<li>
				<select id="locales" multiple>
					<option value="en">English</option>
					<option value="fr">French</option>
					<option value="de">German</option>
					<option value="he">Hebrew</option>
				</select>

				<button
					onClick={ () => {
						const locales = [];
						for ( const option of document.querySelector(
							'#locales'
						).options ) {
							if ( option.selected ) {
								locales.push( option.value );
							}
						}

						wsClient.emit(
							'request:localizedScreenshots',
							locales
						);
					} }
				>
					Get Localized Screenshots
				</button>
			</li>
		</ul>
	);
};

export default Frame;
