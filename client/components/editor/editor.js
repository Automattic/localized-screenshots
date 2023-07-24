import React from 'react';
import set from 'lodash.set';
import { Tldraw } from '@tldraw/tldraw';

import {
	useCanvasStore,
	useScreenshotsStore,
	useSelectedScreenshot,
} from '/state';
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
	const { offset: canvasOffset, setOffset: setCanvasOffset } =
		useCanvasStore();
	const { setScreenshots, selectedScreenshotIndex } = useScreenshotsStore();
	const selectedScreenshot = useSelectedScreenshot();
	const offset = selectedScreenshot
		? selectedScreenshot.offset
		: canvasOffset;
	const setScreenshotOffset = React.useCallback(
		( payload ) => {
			setScreenshots( ( screenshots ) =>
				set(
					screenshots,
					`[${ selectedScreenshotIndex }].offset`,
					payload
				)
			);
		},
		[ selectedScreenshotIndex, setScreenshots ]
	);
	const setOffset = selectedScreenshot
		? setScreenshotOffset
		: setCanvasOffset;

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
	const { lockedScreen, setAnnotations, size } = useCanvasStore();
	const { setScreenshots, selectedScreenshotIndex } = useScreenshotsStore();
	const selectedScreenshot = useSelectedScreenshot();
	const editorRef = useEditorContext();

	React.useEffect( () => {
		if ( ! selectedScreenshot ) {
			return;
		}

		const { annotations } = selectedScreenshot;

		editorRef?.current?.reset();

		if ( annotations ) {
			editorRef?.current?.createShapes( ...annotations );
			editorRef?.current?.select();
		}
	}, [ selectedScreenshot ] );

	if ( ! lockedScreen && ! selectedScreenshot ) {
		return null;
	}

	const isEditable =
		! selectedScreenshot?.id || selectedScreenshot?.isUpdated;
	const style = {
		width: `${ size.width }px`,
		height: `${ size.height }px`,
	};
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
				'style',
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
		<div className="editor" style={ style }>
			<div className="editor__inner">
				<img src={ imageSrc } />

				{ isEditable && <EditorHandles /> }
			</div>

			<div
				className={ `editor__annotations ${
					isEditable ? '' : 'is-hidden'
				}` }
			>
				<Tldraw
					showMenu={ false }
					showPages={ false }
					onMount={ ( editor ) => ( editorRef.current = editor )  }
					onChange={ handleEditorChange }
				/>
			</div>
		</div>
	);
}
