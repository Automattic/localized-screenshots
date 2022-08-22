import React from 'react';
import set from 'lodash.set';
import { Tldraw } from '@tldraw/tldraw';

import { useCanvasContext, useScreenshotsContext } from '/state';
import { useEditorContext } from './context';

export default function Editor() {
	const { lockedScreen, setAnnotations } = useCanvasContext();
	const { selectedScreenshot, setScreenshots, selectedScreenshotIndex } =
		useScreenshotsContext();
	const editorRef = useEditorContext();

	if ( ! lockedScreen && ! selectedScreenshot ) {
		return null;
	}

	const imageSrc = selectedScreenshot?.data || lockedScreen?.data;

	const handleEditorChange = ( editor, event ) => {
		if (
			[
				'session:complete:TransformSingleSession',
				'session:complete:TranslateSession',
				'session:complete:ArrowSession',
				'session:complete:DrawSession',
				'session:complete:EraseSession',
				'updated_shapes',
			].includes( event )
		) {
			const shapes = JSON.parse( JSON.stringify( editor.getShapes() ) );

			if ( ! selectedScreenshot ) {
				setAnnotations( shapes );
			} else {
				setScreenshots( ( screenshots ) =>
					set(
						screenshots,
						`[${ selectedScreenshotIndex }].annotations`,
						shapes
					)
				);
			}
		}
	};

	return (
		<div className="editor-wrapper">
			<img src={ `data:image/jpeg;base64,${ imageSrc }` } />

			<Tldraw
				showMenu={ false }
				showPages={ false }
				onMount={ ( editor ) => ( editorRef.current = editor ) }
				onChange={ handleEditorChange }
			/>
		</div>
	);
}
