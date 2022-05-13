/**
 * Convert SVG XML string to PNG Base64 Data string.
 *
 * @param  {string} svg SVG XML string
 * @return {Promise<string>} PNG Base64 string
 */
export const svgToPNGBase64 = ( svg ) => {
	return new Promise( ( resolve, reject ) => {
		const container = document.createElement( 'div' );
		container.innerHTML = svg;

		const svgEl = container.querySelector( 'svg' );
		svgEl.setAttribute( 'width', 1280 );
		svgEl.setAttribute( 'height', 768 );

		const canvas = document.createElement( 'canvas' );
		canvas.width = 1280;
		canvas.height = 768;

		const data = new XMLSerializer().serializeToString( svgEl );
		const imgEl = new Image();
		const blob = new Blob( [ data ], { type: 'image/svg+xml' } );
		const blobUrl = window.URL.createObjectURL( blob );
		imgEl.onload = function () {
			canvas.getContext( '2d' ).drawImage( imgEl, 0, 0 );
			window.URL.revokeObjectURL( blobUrl );

			resolve( canvas.toDataURL() );
		};
		imgEl.onerror = reject;
		imgEl.src = blobUrl;
	} );
};
