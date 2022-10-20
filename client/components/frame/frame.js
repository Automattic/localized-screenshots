import React from 'react';
import wsClient from '/web-sockets';
import throttle from 'lodash.throttle';

export default function Frame( { width = 1280, height = 720 } ) {
	const frame = React.useRef( null );

	React.useEffect( () => {
		if ( ! frame.current ) {
			return;
		}
		const frameCtx = frame.current.getContext( '2d' );

		const image = new Image();
		image.onload = function () {
			frameCtx.drawImage( image, 0, 0 );
		};
		wsClient.on( 'page:frame', ( data ) => {
			image.src = `data:image/jpeg;base64,${ data }`;
		} );

		frame.current.addEventListener(
			'mousemove',
			throttle(
				( event ) => {
					wsClient.emit( 'client:mouse', {
						type: 'move',
						x: event.offsetX,
						y: event.offsetY,
					} );
				},
				1000 / 30,
				{ leading: true, trailing: true }
			)
		);

		frame.current.addEventListener(
			'wheel',
			throttle(
				( event ) => {
					wsClient.emit( 'client:mouse', {
						type: 'wheel',
						x: event.deltaX,
						y: event.deltaY,
					} );
				},
				1000 / 30,
				{ leading: true, trailing: true }
			)
		);

		for ( const type of [ 'click', 'mouseup', 'mousedown' ] ) {
			frame.current.addEventListener( type, ( event ) => {
				wsClient.emit( 'client:mouse', {
					type: type.replace( 'mouse', '' ),
					x: event.offsetX,
					y: event.offsetY,
				} );
			} );
		}
	}, [ frame ] );

	return (
		<div style={ { textAlign: 'center' } }>
			<canvas ref={ frame } width={ width } height={ height }></canvas>
		</div>
	);
}
