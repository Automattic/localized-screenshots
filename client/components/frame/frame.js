import React from 'react';
import throttle from 'lodash.throttle';
import wsClient, { request } from '/web-sockets';

export default function Frame( { width = 1280, height = 720 } ) {
	const frame = React.useRef( null );
	const [ cursor, setCursor ] = React.useState( null );

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
		wsClient.on( 'page:cursor', ( payload ) => {
			setCursor( payload );
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

		for ( const type of [ 'keydown', 'keypress', 'keyup' ] ) {
			frame.current.addEventListener( type, ( event ) => {
				event.preventDefault();
				wsClient.emit( 'client:keyboard', {
					type: type.replace( 'key', '' ),
					key: event.key,
				} );
			} );
		}
	}, [ frame ] );

	React.useEffect( () => {
		request( 'screencast', true );

		return () => request( 'screencast', false );
	}, [] );

	return (
		<div style={ { textAlign: 'center' } }>
			<canvas
				ref={ frame }
				width={ width }
				height={ height }
				style={ { cursor } }
				tabIndex="0"
			></canvas>
		</div>
	);
}
