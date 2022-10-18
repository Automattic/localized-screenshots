import React from 'react';

const CanvasContext = React.createContext();

export function useCanvasContext() {
	return React.useContext( CanvasContext );
}

export function CanvasContextProvider( { children } ) {
	const [ lockedScreen, setLockedScreen ] = React.useState( null );
	const [ annotations, setAnnotations ] = React.useState( null );
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
			offset,
			setOffset,
		} ),
		[
			lockedScreen,
			setLockedScreen,
			annotations,
			setAnnotations,
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
