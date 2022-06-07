import React from 'react';
import wsClient from '/web-sockets';
import { useCanvasContext } from '/state';

export default function LockedScreenController() {
	const { setLockedScreen } = useCanvasContext();
	const lockedScreenHandler = React.useCallback(
		( payload ) => {
			setLockedScreen( payload );
		},
		[ setLockedScreen ]
	);

	React.useEffect( () => {
		wsClient.on( 'page:screenshot', lockedScreenHandler );
		return () => wsClient.off( 'page:screenshot', lockedScreenHandler );
	}, [ lockedScreenHandler ] );

	return null;
}
