import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useCanvasContext, useScreenshotsContext } from '/state';
import { svgToPNGBase64 } from '/lib/helpers';
import { useEditorContext } from '/components/editor';

export default function UploadScreenshots() {
	const { offset } = useCanvasContext();
	const { screenshots, setSelectedScreenshotIndex } = useScreenshotsContext();
	const editorRef = useEditorContext();
	const { project, resolution } = useParams();
	const [ isLoading, setIsLoading ] = React.useState( false );

	const getScreenshotWithAnnotationsBlob = useCallback(
		async ( screenshotIndex ) => {
			editorRef.current.selectNone();

			const shapes = editorRef.current.getShapes();
			const bounds = shapes.reduce( ( _bounds, shape ) => {
				const { minX, minY, maxX, maxY } =
					editorRef.current.getShapeBounds( shape.id );

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

			await new Promise( ( resolve ) => {
				screenshot.src = screenshots[ screenshotIndex ].data;
				screenshot.onload = () => {
					canvas.width =
						screenshot.width - ( offset.left + offset.right );
					canvas.height =
						screenshot.height - ( offset.top + offset.bottom );
					canvasContext.drawImage(
						screenshot,
						0 - offset.left,
						0 - offset.top,
						screenshot.width,
						screenshot.height
					);
					resolve();
				};
			} );

			return editorRef.current
				.getSvg()
				.then( ( svg ) => {
					if ( ! svg ) {
						return null;
					}
					// Remove SVG background style.
					svg.style = '';

					return svgToPNGBase64(
						svg?.outerHTML || '',
						bounds.maxX - bounds.minX,
						bounds.maxY - bounds.minY
					);
				} )
				.then( ( annotationsImageData ) => {
					if ( ! annotationsImageData ) {
						return Promise.resolve();
					}

					return new Promise( ( resolve ) => {
						const annotations = new Image();
						annotations.src = annotationsImageData;
						annotations.onload = () => {
							canvasContext.drawImage(
								annotations,
								bounds.minX - offset.left,
								bounds.minY - offset.top,
								annotations.width,
								annotations.height
							);

							resolve();
						};
					} );
				} )
				.then( () => {
					return new Promise( ( resolve ) =>
						canvas.toBlob( resolve )
					);
				} );
		},
		[ editorRef.current, screenshots, offset ]
	);

	const uploadScreenshots = useCallback( async () => {
		setIsLoading( true );

		let parentScreenshot = screenshots.find(
			( screenshot ) => screenshot.meta.locale === 'en'
		)?.id;

		for ( const [ index, screenshot ] of screenshots.entries() ) {
			setSelectedScreenshotIndex( index );

			if ( screenshot.id && ! screenshot.isUpdated ) {
				continue;
			}

			const screenshotBlob = await getScreenshotWithAnnotationsBlob(
				index
			);

			let [ width, height ] = resolution.split( 'x' );
			width = parseInt( width ) || null;
			height = parseInt( height ) || null;
			const { locale, page } = screenshot.meta;
			const formData = new FormData();
			formData.append(
				'screenshot',
				new File( [ screenshotBlob ], `screenshot_${ locale }.png` )
			);
			formData.append( 'screenshot_locale', locale );
			formData.append(
				'screenshot_meta',
				JSON.stringify( {
					annotations: screenshot.annotations,
					offset,
					page,
					project: {
						project,
						width,
						height,
					},
				} )
			);

			if ( screenshot.id ) {
				formData.append( 'screenshot_id', screenshot.id );
			}

			if ( locale !== 'en' && parentScreenshot ) {
				formData.append( 'screenshot_parent', parentScreenshot );
			}

			const endpoint = screenshot.id ? 'update' : 'upload';
			const screenshotId = await (
				await fetch(
					`${ API_ROOT }/wp-json/localized-screenshots/v1/${ endpoint }/`,
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
	}, [ screenshots, getScreenshotWithAnnotationsBlob, offset ] );

	return (
		<>
			<button className="button" onClick={ uploadScreenshots }>
				Upload Screenshot
			</button>
			{ isLoading && 'Uploading...' }
		</>
	);
}
