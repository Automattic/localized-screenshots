import React from 'react';

import Controls from '/components/controls';
import Screenshots from '/components/screenshots';

export default function Nav() {
	const [ navHidden, setNavHidden ] = React.useState( false );

	return (
		<div className={ `nav ${ navHidden ? 'is-hidden' : '' }` }>
			<button
				className="nav__toggle"
				onClick={ () => setNavHidden( ! navHidden ) }
			/>

			<Controls />

			<Screenshots />
		</div>
	);
}
