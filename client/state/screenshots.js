import React from 'react';

const ScreenshotsContext = React.createContext();

export function useScreenshotsContext() {
	return React.useContext( ScreenshotsContext );
}

export function ScreenshotsContextProvider( { children } ) {
	const [ screenshots, setScreenshots ] = React.useState( [] );
	const [ selectedScreenshotIndex, setSelectedScreenshotIndex ] =
		React.useState( null );
	const selectedScreenshot = screenshots[ selectedScreenshotIndex ];

	const context = React.useMemo(
		() => ( {
			screenshots,
			setScreenshots,
			selectedScreenshotIndex,
			setSelectedScreenshotIndex,
			selectedScreenshot,
		} ),
		[
			screenshots,
			setScreenshots,
			selectedScreenshotIndex,
			setSelectedScreenshotIndex,
		]
	);

	return (
		<ScreenshotsContext.Provider value={ context }>
			{ children }
		</ScreenshotsContext.Provider>
	);
}
