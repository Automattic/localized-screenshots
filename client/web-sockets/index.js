import io from 'socket.io-client';

/**
 * WebSockets client.
 */
export const client = io( 'http://localhost:3004' );

/**
 * Make WebSockets request.
 *
 * @param  {string} type    Request type.
 * @param  {any} payload    Request payload.
 * @param  {number} timeout Request timeout in ms.
 * @return {Promise<any>}   Response payload.
 */
export function request( type, payload, timeout = 10000 ) {
	return new Promise( ( resolve, reject ) => {
		const uuid = window?.crypto?.randomUUID?.();
		const handler = ( payload, responseUUID ) => {
			if ( responseUUID === uuid ) {
				resolve( payload );
				client.off( type, handler );
			}
		};

		client.on( `response:${ type }`, handler );
		client.emit( `request:${ type }`, payload, uuid );

		// Request timeout.
		if ( timeout > 0 ) {
			setTimeout( reject, timeout );
		}
	} );
}

export default client;
