import React from 'react';
import { useParams } from 'react-router-dom';

import Controls from '/components/controls';
import Editor, { EditorProvider } from '/components/editor';
import Frame from '/components/frame';
import Screenshots from '/components/screenshots';
import { useCanvasContext } from '/state';
import wsClient from '/web-sockets';

function SessionController() {
	const { project, resolution } = useParams();
	const { setSize } = useCanvasContext();

	React.useEffect( () => {
		let [ width, height ] = resolution.split( 'x' );

		width = parseInt( width ) || null;
		height = parseInt( height ) || null;

		setSize( { width, height } );

		// @todo: remove timeout.
		setTimeout( () => {
			wsClient.emit( 'session:start', {
				project,
				width,
				height,
			} );
		}, 500 );
	}, [] );

	return null;
}

export default function PageCreate() {
	const { lockedScreen, size } = useCanvasContext();
	const [ navHidden, setNavHidden ] = React.useState( false );

	return (
		<EditorProvider>
			<SessionController />

			<div className={ `nav ${ navHidden ? 'is-hidden' : '' }` }>
				<button
					className="nav__toggle"
					onClick={ () => setNavHidden( ! navHidden ) }
				/>

				<Controls screenshot={ lockedScreen } />

				<Screenshots />
			</div>

			<Editor />

			{ ! lockedScreen && (
				<Frame width={ size.width } height={ size.height } />
			) }
		</EditorProvider>
	);
}
