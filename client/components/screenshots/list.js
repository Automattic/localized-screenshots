import React from 'react';
import { useScreenshotsContext } from '/state';
import Screenshot from './screenshot';

export default function ScreenshotsList() {
	const { screenshots } = useScreenshotsContext();

	if ( screenshots.length === 0 ) {
		return;
	}

	return (
		<ul className="localized-screenshots">
			{ screenshots.map( ( screenshot, index ) => (
				<Screenshot
					key={ index }
					index={ index }
					screenshot={ screenshot }
				/>
			) ) }
		</ul>
	);
}
