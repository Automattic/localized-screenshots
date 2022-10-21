import React from 'react';
import { useScreenshotsContext } from '/state';
import { useEditorContext } from '/components/editor';

export default function Screenshot( { screenshot, index } ) {
	const { selectedScreenshotIndex, setSelectedScreenshotIndex } =
		useScreenshotsContext();
	const { data, annotations, meta } = screenshot;
	const editorRef = useEditorContext();

	return (
		<li>
			<button
				className={ `button ${
					index === selectedScreenshotIndex ? 'is-active' : ''
				}` }
				onClick={ () => {
					setSelectedScreenshotIndex( index );
					editorRef?.current.reset();

					if ( annotations ) {
						editorRef?.current.createShapes( ...annotations );
						editorRef?.current.select();
					}
				} }
			>
				<img src={ `data:image/jpeg;base64,${ data }` } />
				<span>{ meta.locale }</span>
			</button>
		</li>
	);
}
