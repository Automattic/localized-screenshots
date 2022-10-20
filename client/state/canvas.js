import React from 'react';

const CanvasContext = React.createContext();

export function useCanvasContext() {
	return React.useContext( CanvasContext );
}

export function CanvasContextProvider( { children } ) {
	const [ lockedScreen, setLockedScreen ] = React.useState( null );
	const [ annotations, setAnnotations ] = React.useState( null );
	const [ size, setSize ] = React.useState( { width: 1280, height: 720 } );
	const [ offset, setOffset ] = React.useState( {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	} );

	const context = React.useMemo(
		() => ( {
			lockedScreen,
			setLockedScreen,
			annotations,
			setAnnotations,
			size,
			setSize,
			offset,
			setOffset,
		} ),
		[
			lockedScreen,
			setLockedScreen,
			annotations,
			setAnnotations,
			size,
			setSize,
			offset,
			setOffset,
		]
	);

	return (
		<CanvasContext.Provider value={ context }>
			{ children }
		</CanvasContext.Provider>
	);
}
