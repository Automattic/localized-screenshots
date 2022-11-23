/**
 * Convert SVG XML string to PNG Base64 Data string.
 *
 * @param  {string} svg SVG XML string
 * @return {Promise<string>} PNG Base64 string
 */
export function svgToPNGBase64( svg, width = 1280, height = 768 ) {
	return new Promise( ( resolve, reject ) => {
		const container = document.createElement( 'div' );
		container.innerHTML = svg;

		const editorPadding = 16; // tldraw hardcoded padding value
		const svgEl = container.querySelector( 'svg' );
		svgEl.setAttribute( 'width', width + editorPadding );
		svgEl.setAttribute( 'height', height + editorPadding );
		svgEl.removeAttribute( 'viewBox' );

		const canvas = document.createElement( 'canvas' );
		canvas.width = width;
		canvas.height = height;

		const data = new XMLSerializer().serializeToString( svgEl );
		const imgEl = new Image();
		const blob = new Blob( [ data ], { type: 'image/svg+xml' } );
		const blobUrl = window.URL.createObjectURL( blob );
		imgEl.onload = function () {
			canvas
				.getContext( '2d' )
				.drawImage( imgEl, -editorPadding, -editorPadding );
			window.URL.revokeObjectURL( blobUrl );

			resolve( canvas.toDataURL() );
		};
		imgEl.onerror = reject;
		imgEl.src = blobUrl;
	} );
}

/**
 * Re-align annotation editor shapes for RTL languages.
 *
 * @param  {array} shapes
 * @return {array}
 */
export function realignShapesForRTL( shapes, editor ) {
	const { width } = editor.rendererBounds;
	const shapesClone = JSON.parse( JSON.stringify( shapes ) );

	return shapesClone.map( ( shape ) => {
		if ( shape.type === 'rectangle' ) {
			shape.point[ 0 ] = width - shape.point[ 0 ] - shape.size[ 0 ];
		}
		if ( shape.type === 'ellipse' ) {
			shape.point[ 0 ] = width - shape.point[ 0 ] - shape.radius[ 0 ];
		}
		if ( shape.type === 'triangle' ) {
			shape.point[ 0 ] = width - shape.point[ 0 ] - shape.size[ 0 ];
		}

		if ( shape.type === 'arrow' ) {
			const startX = shape.handles.start.point[ 0 ];
			shape.handles.start.point[ 0 ] = shape.handles.end.point[ 0 ];
			shape.handles.end.point[ 0 ] = startX;

			shape.point[ 0 ] =
				width -
				shape.point[ 0 ] -
				Math.max(
					shape.handles.start.point[ 0 ],
					shape.handles.end.point[ 0 ]
				);
		}

		return shape;
	} );
}

export function imageToDataURL( src ) {
	return new Promise( ( resolve ) => {
		const image = new Image();

		image.crossOrigin = 'Anonymous';
		image.onload = () => {
			const canvas = document.createElement( 'canvas' );
			const context = canvas.getContext( '2d' );

			canvas.height = image.naturalHeight;
			canvas.width = image.naturalWidth;
			context.drawImage( image, 0, 0 );

			const dataURL = canvas.toDataURL();

			resolve( dataURL );
		};
		image.src = src;
	} );
}
