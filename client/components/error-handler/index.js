import React from 'react';
import wsClient from '/web-sockets';

export default function ErrorHandler() {
	const [ shouldReload, setShouldReload ] = React.useState( false );
	const wsDisconnectHandler = React.useMemo( () => {
		return () => setShouldReload( true );
	}, [ setShouldReload ] );

	React.useEffect( () => {
		wsClient.on( 'disconnect', wsDisconnectHandler );

		return () => wsClient.off( 'disconnect', wsDisconnectHandler );
	} );

	return (
		shouldReload && (
			<div className="error-handler">
				<h2>Something went wrong.</h2>
				<button className="button" onClick={ () => location.reload() }>
					Reload Page
				</button>
			</div>
		)
	);
}
