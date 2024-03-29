import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useCanvasStore, useScreenshotsStore } from '/state';
import { svgToPNGBase64 } from '/lib/helpers';
import { useEditorContext } from '/components/editor';

export default function UploadScreenshots() {
	const { actions } = useCanvasStore();
	const { screenshots, setSelectedScreenshotIndex } = useScreenshotsStore();
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
			const offset = screenshots[ screenshotIndex ].offset;

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
		[ editorRef.current, screenshots ]
	);

	const uploadScreenshots = useCallback( async () => {
		setIsLoading( true );

		let parentScreenshot = screenshots.find(
			( screenshot ) => screenshot.meta.locale === 'en'
		)?.id;

		for ( const [ index, screenshot ] of screenshots.entries() ) {
			if ( screenshot.id && ! screenshot.isUpdated ) {
				continue;
			}

			setSelectedScreenshotIndex( index );

			// Wait for editor annotations to be updated.
			await new Promise( ( resolve ) =>
				window.requestAnimationFrame( resolve )
			);

			const screenshotBlob = await getScreenshotWithAnnotationsBlob(
				index
			);

			let screenshotMetaProject = {
				...screenshot.meta.project,
			};
			if ( project && resolution ) {
				let [ width, height ] = resolution.split( 'x' );
				width = parseInt( width ) || null;
				height = parseInt( height ) || null;

				screenshotMetaProject = {
					project,
					width,
					height,
				};
			}

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
					actions,
					offset: screenshot.offset,
					page,
					project: screenshotMetaProject,
				} )
			);

			if ( screenshot.id ) {
				formData.append( 'screenshot_id', screenshot.id );
			}

			if ( locale !== 'en' && parentScreenshot ) {
				formData.append( 'screenshot_parent', parentScreenshot );
			}

			const screenshotId = await (
				await fetch(
					`/api/screenshot${
						screenshot.id ? `/${ screenshot.id }` : ''
					}`,
					{
						method: screenshot.id ? 'PUT' : 'POST',
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
			<button className="button" onClick={ uploadScreenshots }>
				Upload Screenshot
			</button>
			{ isLoading && <p>Uploading...</p> }
		</>
	);
}
