import React from 'react';

import { useScreenshotsContext } from '/state';

export default function Screenshot( { screenshot, index } ) {
	const { selectedScreenshotIndex, setSelectedScreenshotIndex } =
		useScreenshotsContext();
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
