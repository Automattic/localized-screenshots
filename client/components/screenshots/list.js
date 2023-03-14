import React from 'react';
import { useScreenshotsStore } from '/state';
import Screenshot from './screenshot';

export default function ScreenshotsList() {
	const { screenshots } = useScreenshotsStore();

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
