import React from 'react';

import { useCanvasContext } from '/state';
import wsClient from '/web-sockets';

function RecordActionsController() {
	const { setActions } = useCanvasContext();
	const recordActionsHandler = React.useCallback(
		( payload ) => {
			setActions( ( actions ) => actions.concat( payload ) );
		},
		[ setActions ]
	);

	React.useEffect( () => {
		wsClient.on( 'page:action', recordActionsHandler );
		return () => wsClient.off( 'page:action', recordActionsHandler );
	}, [ recordActionsHandler ] );

	return null;
}

export default function RecordActions() {
	const [ isRecording, setIsRecording ] = React.useState( false );
	const { actions, setActions } = useCanvasContext();

	const handleRecordActionsClick = () => {
		setIsRecording( ( isRecording ) => {
			wsClient.emit( 'request:recordActions', ! isRecording );
			return ! isRecording;
		} );
	};
	const createRemoveActionHandler = React.useCallback(
		( index ) => {
			return () =>
				setActions( ( actions ) =>
					actions
						.slice( 0, index )
						.concat( actions.slice( index + 1 ) )
				);
		},
		[ setActions ]
	);

	return (
		<>
			<button className="button" onClick={ handleRecordActionsClick }>
				{ isRecording && <i className="recoding-actions-indicator" /> }
				{ isRecording ? 'Stop Recording' : 'Record Actions' }
			</button>

			{ isRecording && <RecordActionsController /> }

			{ actions.length > 0 && (
				<ul className="list-actions">
					{ actions.map( ( action, index ) => (
						<li
							key={ `${ index }-${ action.type }-${ action.selector }` }
							className="list-actions__item"
						>
							<span className="list-actions__item-type">
								{ action.type }
							</span>

							<span className="list-actions__item-selector">
								{ action.selector }
							</span>

							<button
								className="list-actions__item-remove"
								onClick={ createRemoveActionHandler( index ) }
							>
								×
							</button>
						</li>
					) ) }
				</ul>
			) }
		</>
	);
}
