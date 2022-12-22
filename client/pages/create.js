import React from 'react';
import { useParams } from 'react-router-dom';

import Nav from '/components/nav';
import Editor, { EditorProvider } from '/components/editor';
import Frame from '/components/frame';
import { useCanvasContext, useSessionContext } from '/state';
import { request } from '/web-sockets';

function SessionController() {
	const { project, resolution } = useParams();
	const { setSize } = useCanvasContext();
	const { setIsReady } = useSessionContext();

	React.useEffect( () => {
		let [ width, height ] = resolution.split( 'x' );

		width = parseInt( width ) || null;
		height = parseInt( height ) || null;

		setSize( { width, height } );

		request( 'startSession', {
			project,
			width,
			height,
		} ).then( ( isReady ) => setIsReady( isReady ) );

		return () => request( 'stopSession' );
	}, [] );

	return null;
}

export default function PageCreate() {
	const { lockedScreen, size } = useCanvasContext();
	const { isReady } = useSessionContext();

	return (
		<EditorProvider>
			<SessionController />

			<Nav />

			<Editor />

			{ isReady && ! lockedScreen && (
				<Frame width={ size.width } height={ size.height } />
			) }
		</EditorProvider>
	);
}
