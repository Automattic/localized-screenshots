import React from 'react';

const SessionContext = React.createContext();

export function useSessionContext() {
	return React.useContext( SessionContext );
}

export function SessionContextProvider( { children } ) {
	const [ isReady, setIsReady ] = React.useState( false );

	const context = React.useMemo(
		() => ( {
			isReady,
			setIsReady,
		} ),
		[ isReady, setIsReady ]
	);

	return (
		<SessionContext.Provider value={ context }>
			{ children }
		</SessionContext.Provider>
	);
}
