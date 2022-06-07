import React from 'react';
import { useScreenshotsContext } from '/state';
import { useEditorContext } from '/components/editor';

export default function Screenshot( { screenshot, index } ) {
	const { setSelectedScreenshotIndex } = useScreenshotsContext();
	const { data, annotations, meta } = screenshot;
	const editorRef = useEditorContext();

	return (
		<li>
			<button
				onClick={ () => {
					setSelectedScreenshotIndex( index );
					editorRef?.current.reset();
					editorRef?.current.createShapes( ...annotations );
				} }
			>
				<img src={ `data:image/jpeg;base64,${ data }` } />
				<span>{ meta.locale }</span>
			</button>
		</li>
	);
}
