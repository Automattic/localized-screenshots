import React from 'react';

const EditorContext = React.createContext( {} );

export function useEditorContext() {
	return React.useContext( EditorContext );
}

export function EditorProvider( { children } ) {
	const ref = React.useRef();

	return (
		<EditorContext.Provider value={ ref }>
			{ children }
		</EditorContext.Provider>
	);
}
