import React from 'react';
import { useParams } from 'react-router-dom';

import Nav from '/components/nav';
import Editor, { EditorProvider } from '/components/editor';
import Frame from '/components/frame';
import { useCanvasStore, useSessionStore } from '/state';
import { client as wsClient, request } from '/web-sockets';

function SessionController() {
	const { project, resolution } = useParams();
	const { setSize, setActions, lockedScreen } = useCanvasStore();
	const { setIsReady, setUrl, url } = useSessionStore();

	const recordActionsHandler = React.useCallback(
		( payload ) => {
			setActions( ( actions ) => actions.concat( payload ) );
		},
		[ setActions ]
	);

	React.useEffect( () => {
		wsClient.on( 'page:location', setUrl );
		return () => wsClient.off( 'page:location', setUrl );
	}, [ setUrl ] );

	React.useEffect( () => {
		if ( lockedScreen ) {
			return;
		}

		setActions( [] );
	}, [ url, lockedScreen ] );

	React.useEffect( () => {
		if ( lockedScreen ) {
			return;
		}

		wsClient.on( 'page:action', recordActionsHandler );
		return () => wsClient.off( 'page:action', recordActionsHandler );
	}, [ recordActionsHandler, lockedScreen ] );

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
	const { lockedScreen, size } = useCanvasStore();
	const { isReady } = useSessionStore();

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
