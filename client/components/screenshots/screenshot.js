import React from 'react';
import { useScreenshotsContext } from '/state';
import { useEditorContext } from '/components/editor';

export default function Screenshot( { screenshot, index } ) {
	const { selectedScreenshotIndex, setSelectedScreenshotIndex } =
		useScreenshotsContext();
	const { data, annotations, meta } = screenshot;
	const editorRef = useEditorContext();
	const willBeUploaded = ! screenshot.id || screenshot.isUpdated;

	return (
		<li>
			<button
				className={ `button ${
					index === selectedScreenshotIndex ? 'is-active' : ''
				}` }
				onClick={ () => {
					setSelectedScreenshotIndex( index );
					editorRef?.current?.reset();

					if ( annotations ) {
						editorRef?.current?.createShapes( ...annotations );
						editorRef?.current?.select();
					}
				} }
			>
				<img src={ data } />
				<span>{ meta.locale }</span>

				{ willBeUploaded && <i /> }
			</button>
		</li>
	);
}
