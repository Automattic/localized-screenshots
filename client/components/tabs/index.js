import React from 'react';

export default function Tabs( { tabs } ) {
	const [ activeIndex, setActiveIndex ] = React.useState( 0 );
	return (
		<div className="tabs">
			<nav className="tabs__nav">
				{ tabs.map( ( tab, index ) => (
					<button
						key={ tab.title }
						className={ index === activeIndex ? 'active' : '' }
						onClick={ () => setActiveIndex( index ) }
					>
						{ tab.title }
					</button>
				) ) }
			</nav>

			<div className="tabs__body">{ tabs[ activeIndex ].body }</div>
		</div>
	);
}
