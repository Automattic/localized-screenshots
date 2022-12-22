import React from 'react';
import { NavLink } from 'react-router-dom';

import Loader from '/components/loader';

export default function Browse() {
	const [ isLoading, setIsLoading ] = React.useState( false );
	const [ screenshots, setScreenshots ] = React.useState( [] );
	React.useEffect( () => {
		setIsLoading( true );
		fetch( '/api/all-screenshots' )
			.then( ( res ) => res.json() )
			.then( ( data ) => {
				setScreenshots( data );
				setIsLoading( false );
			} );
	}, [] );

	if ( isLoading ) {
		return <Loader />;
	}

	return (
		<ol className="browse-screenshots">
			{ screenshots.map( ( screenshot ) => (
				<li key={ screenshot.id }>
					<img src={ screenshot.url } />

					<NavLink
						className="button"
						to={ `/edit/${ screenshot.id }` }
					>
						Edit
					</NavLink>
				</li>
			) ) }
		</ol>
	);
}
