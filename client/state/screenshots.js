import { create } from 'zustand';
import { createStoreSetter } from '/state/utils';

export const useScreenshotsStore = create( ( set ) => ( {
	screenshots: [],
	setScreenshots: createStoreSetter( set, 'screenshots' ),
	selectedScreenshotIndex: null,
	setSelectedScreenshotIndex: createStoreSetter(
		set,
		'selectedScreenshotIndex'
	),
} ) );

export const useSelectedScreenshot = () =>
	useScreenshotsStore(
		( { screenshots, selectedScreenshotIndex } ) =>
			screenshots[ selectedScreenshotIndex ]
	);
