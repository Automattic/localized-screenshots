import React from 'react';
import wsClient from '/web-sockets';
import { useCanvasStore } from '/state';

export default function LockedScreenController() {
	const { setLockedScreen } = useCanvasStore();
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
