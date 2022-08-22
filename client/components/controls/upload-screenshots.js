import React, { useCallback } from 'react';
import { useCanvasContext, useScreenshotsContext } from '/state';
import { svgToPNGBase64 } from '/lib/helpers';
import { useEditorContext } from '/components/editor';

export default function UploadScreenshots() {
	const { lockedScreen } = useCanvasContext();
	const { screenshots, setSelectedScreenshotIndex } = useScreenshotsContext();
	const editorRef = useEditorContext();
	const [ isLoading, setIsLoading ] = React.useState( false );

	const getScreenshotWithAnnotationsBlob = useCallback( async () => {
		editorRef.current.selectNone();

		const shapes = editorRef.current.getShapes();
		const bounds = shapes.reduce( ( _bounds, shape ) => {
			const { minX, minY, maxX, maxY } = editorRef.current.getShapeBounds(
				shape.id
			);

			return {
				minX:
					_bounds.minX !== undefined
						? Math.min( minX, _bounds.minX )
						: minX,
				minY:
					_bounds.minY !== undefined
						? Math.min( minY, _bounds.minY )
						: minY,
				maxX:
					_bounds.maxX !== undefined
						? Math.max( maxX, _bounds.maxX )
						: maxX,
				maxY:
					_bounds.maxY !== undefined
						? Math.max( maxY, _bounds.maxY )
						: maxY,
			};
		}, {} );

		const canvas = document.createElement( 'canvas' );
		const canvasContext = canvas.getContext( '2d' );
		const screenshot = new Image();
		screenshot.src = `data:image/jpeg;base64,${ lockedScreen.data }`;
		screenshot.onload = () => {
			canvas.width = screenshot.width;
			canvas.height = screenshot.height;
			canvasContext.drawImage(
				screenshot,
				0,
				0,
				screenshot.width,
				screenshot.height
			);
		};

		return editorRef.current
			.getSvg()
			.then( ( svg ) => {
				// Remove SVG background style.
				svg.style = '';

				return svgToPNGBase64(
					svg?.outerHTML || '',
					bounds.maxX - bounds.minX,
					bounds.maxY - bounds.minY
				);
			} )
			.then( ( annotationsImageData ) => {
				return new Promise( ( resolve ) => {
					const annotations = new Image();
					annotations.src = annotationsImageData;
					annotations.onload = () => {
						canvasContext.drawImage(
							annotations,
							bounds.minX,
							bounds.minY,
							annotations.width,
							annotations.height
						);

						canvas.toBlob( resolve );
					};
				} );
			} );
	}, [ editorRef.current ] );

	const uploadScreenshots = useCallback( async () => {
		setIsLoading( true );

		let parentScreenshot = null;

		for ( const [ index, screenshot ] of screenshots.entries() ) {
			setSelectedScreenshotIndex( index );

			const screenshotBlob = await getScreenshotWithAnnotationsBlob();

			const { locale } = screenshot.meta;
			const formData = new FormData();
			formData.append(
				'screenshot',
				new File( [ screenshotBlob ], `screenshot_${ locale }.png` )
			);
			formData.append( 'screenshot_locale', locale );
			formData.append( 'screenshot_meta', {
				annotations: screenshot.annotations,
			} );

			if ( locale !== 'en' && parentScreenshot ) {
				formData.append( 'screenshot_parent', parentScreenshot );
			}

			const screenshotId = await (
				await fetch(
					'http://localhost:8888/wp-json/localized-screenshots/v1/upload',
					{
						method: 'POST',
						body: formData,
					}
				)
			 ).json();

			if ( locale === 'en' ) {
				parentScreenshot = screenshotId;
			}
		}

		setIsLoading( false );
	}, [ screenshots, getScreenshotWithAnnotationsBlob ] );

	return (
		<>
			<button onClick={ uploadScreenshots }>Upload Screenshot</button>
			{ isLoading && 'Uploading...' }
		</>
	);
}