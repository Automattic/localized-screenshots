import React from 'react';

import { useScreenshotsStore } from '/state';

export default function Screenshot( { screenshot, index } ) {
	const { selectedScreenshotIndex, setSelectedScreenshotIndex } =
		useScreenshotsStore();
	const { data, meta } = screenshot;
	const willBeUploaded = ! screenshot.id || screenshot.isUpdated;

	return (
		<li>
			<button
				className={ `button ${
					index === selectedScreenshotIndex ? 'is-active' : ''
				}` }
				onClick={ () => {
					setSelectedScreenshotIndex( index );
				} }
			>
				<img src={ data } />
				<span>{ meta.locale }</span>

				{ willBeUploaded && <i /> }
			</button>
		</li>
	);
}
