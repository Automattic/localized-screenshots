import React from 'react';

import Controls from '/components/controls';
import Editor, { EditorProvider } from '/components/editor';
import Frame from '/components/frame';
import Screenshots from '/components/screenshots';
import { useCanvasContext } from '/state';

export default function App() {
	const { lockedScreen } = useCanvasContext();

	return (
		<EditorProvider>
			<Controls screenshot={ lockedScreen } />

			<Screenshots />

			<Editor />

			{ ! lockedScreen && <Frame /> }
		</EditorProvider>
	);
}
