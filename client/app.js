import React from 'react';
import { Tldraw } from '@tldraw/tldraw';
import wsClient from './web-sockets';
import Frame from './frame';
import Controls from './controls';

const App = () => {
	const [ screenshot, setScreenshot ] = React.useState( null );
	const [ localized, setLocalized ] = React.useState( [] );

	wsClient.on( 'page:screenshot', ( payload ) => {
		setScreenshot( payload );
	} );

	wsClient.on( 'page:localizedScreenshot', ( data ) => {
		setLocalized( localized.concat( data ) );
	} );

	return (
		<React.StrictMode>
			<Controls screenshot={ screenshot } />

			<ul className="localized-screenshots">
				{ localized.map( ( data ) => {
					return (
						<li>
							<img
								src={ `data:image/jpeg;base64,${ data }` }
								width="100"
								onClick={ () =>
									setScreenshot( {
										...screenshot,
										data,
									} )
								}
							/>
						</li>
					);
				} ) }
			</ul>

			{ screenshot && (
				<div class="editor-wrapper">
					<img
						src={ `data:image/jpeg;base64,${ screenshot.data }` }
					/>

					<Tldraw showMenu={ false } showPages={ false } />
				</div>
			) }
			{ ! screenshot && <Frame /> }
		</React.StrictMode>
	);
};

export default App;
