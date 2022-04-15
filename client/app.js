import React from 'react';
import { Tldraw } from '@tldraw/tldraw';
import wsClient from './web-sockets';
import Frame from './frame';
import Controls from './controls';

const App = () => {
	const [ screenshot, setScreenshot ] = React.useState( null );
	const [ localized, setLocalized ] = React.useState( [] );

	wsClient.on( 'page:screenshot', ( data ) => {
		setScreenshot( `data:image/jpeg;base64,${ data }` );
	} );

	wsClient.on( 'page:localizedScreenshot', ( data ) => {
		setLocalized( localized.concat( `data:image/jpeg;base64,${ data }` ) );
	} );

	return (
		<React.StrictMode>
			<Controls />

			<ul className="localized-screenshots">
				{ localized.map( ( img ) => {
					return (
						<li>
							<img
								src={ img }
								width="100"
								onClick={ () => setScreenshot( img ) }
							/>
						</li>
					);
				} ) }
			</ul>

			{ screenshot && (
				<div class="editor-wrapper">
					<img src={ screenshot } />

					<Tldraw showMenu={ false } showPages={ false } />
				</div>
			) }
			{ ! screenshot && <Frame /> }
		</React.StrictMode>
	);
};

export default App;
