import React from 'react';

const CanvasContext = React.createContext();

export function useCanvasContext() {
	return React.useContext( CanvasContext );
}

export function CanvasContextProvider( { children } ) {
	const [ lockedScreen, setLockedScreen ] = React.useState( null );
	const [ annotations, setAnnotations ] = React.useState( null );

	const context = React.useMemo(
		() => ( {
			lockedScreen,
			setLockedScreen,
			annotations,
			setAnnotations,
		} ),
		[ lockedScreen, setLockedScreen, annotations, setAnnotations ]
	);

	return (
		<CanvasContext.Provider value={ context }>
			{ children }
		</CanvasContext.Provider>
	);
}
