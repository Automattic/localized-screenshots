import React from 'react';
import set from 'lodash.set';
import { Tldraw } from '@tldraw/tldraw';

import { useCanvasContext, useScreenshotsContext } from '/state';
import { useEditorContext } from './context';

function EditorHandle( { position, onChange = () => {} } ) {
	const isVertical = [ 'top', 'bottom' ].includes( position );
	const deltaCoef = [ 'top', 'left' ].includes( position ) ? 1 : -1;

	function handleDragging( event ) {
		let startPos = isVertical ? event.clientY : event.clientX;

		function handleMouseMove( event ) {
			const currentPos = isVertical ? event.clientY : event.clientX;
			const delta = ( currentPos - startPos ) * deltaCoef;

			onChange( delta, position );
		}

		function handleMouseUp( event ) {
			startPos = isVertical ? event.clientY : event.clientX;

			window.removeEventListener( 'mousemove', handleMouseMove );
			window.removeEventListener( 'mouseup', handleMouseUp );
		}

		window.addEventListener( 'mousemove', handleMouseMove );
		window.addEventListener( 'mouseup', handleMouseUp );
	}

	return (
		<button
			className={ `editor__handle editor__handle--${ position }` }
			onMouseDown={ handleDragging }
		/>
	);
}

function EditorHandles() {
	const { offset, setOffset } = useCanvasContext();
	const style = {
		borderTopWidth: `${ offset.top }px`,
		borderRightWidth: `${ offset.right }px`,
		borderBottomWidth: `${ offset.bottom }px`,
		borderLeftWidth: `${ offset.left }px`,
	};

	return (
		<div className="editor__handles" style={ style }>
			<EditorHandle
				position="top"
				onChange={ ( delta ) =>
					setOffset( {
						...offset,
						top: Math.max( 0, offset.top + delta ),
					} )
				}
			/>
			<EditorHandle
				position="right"
				onChange={ ( delta ) =>
					setOffset( {
						...offset,
						right: Math.max( 0, offset.right + delta ),
					} )
				}
			/>
			<EditorHandle
				position="bottom"
				onChange={ ( delta ) =>
					setOffset( {
						...offset,
						bottom: Math.max( 0, offset.bottom + delta ),
					} )
				}
			/>
			<EditorHandle
				position="left"
				onChange={ ( delta ) =>
					setOffset( {
						...offset,
						left: Math.max( 0, offset.left + delta ),
					} )
				}
			/>
		</div>
	);
}

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
		<div className="editor">
			<div className="editor__inner">
				<img src={ `data:image/jpeg;base64,${ imageSrc }` } />

				<EditorHandles />
			</div>

			<div className="editor__annotations">
				<Tldraw
					showMenu={ false }
					showPages={ false }
					onMount={ ( editor ) => ( editorRef.current = editor ) }
					onChange={ handleEditorChange }
				/>
			</div>
		</div>
	);
}
