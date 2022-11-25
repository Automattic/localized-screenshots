import React from 'react';
import { useParams } from 'react-router-dom';

import Nav from '/components/nav';
import Editor, { EditorProvider } from '/components/editor';
import Frame from '/components/frame';
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

	return (
		<EditorProvider>
			<SessionController />

			<Nav />

			<Editor />

			{ ! lockedScreen && (
				<Frame width={ size.width } height={ size.height } />
			) }
		</EditorProvider>
	);
}
