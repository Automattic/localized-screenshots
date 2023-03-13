import React from 'react';
import wsClient from '/web-sockets';
import { useCanvasStore, useScreenshotsStore } from '/state';
import { getLanguageBySlug } from '/lib/languages';
import { realignShapesForRTL } from '/lib/helpers';
import { useEditorContext } from '/components/editor';

export default function ScreenshotsController() {
	const { setScreenshots } = useScreenshotsStore();
	const { annotations } = useCanvasStore();
	const editorRef = useEditorContext();

	const screenshotsHandler = React.useCallback(
		( payload ) => {
			payload.annotations = annotations;

			// Re-align annotations for RTL locales.
			if (
				payload.annotations &&
				getLanguageBySlug( payload?.meta?.locale )?.rtl
			) {
				payload.annotations = realignShapesForRTL(
					payload.annotations,
					editorRef.current
				);
			}

			setScreenshots( ( screenshots ) => {
				const screenshotForLocaleIndex = screenshots.findIndex(
					( screenshot ) =>
						screenshot.meta.locale === payload.meta.locale
				);

				// Update existing screenshot entry for locale.
				if ( screenshotForLocaleIndex >= 0 ) {
					const updatedScreenshots = [ ...screenshots ];

					updatedScreenshots[ screenshotForLocaleIndex ] = {
						...updatedScreenshots[ screenshotForLocaleIndex ],
						data: payload.data,
						isUpdated: true,
					};

					return updatedScreenshots;
				}

				return screenshots.concat( payload );
			} );
		},
		[ setScreenshots, annotations ]
	);

	React.useEffect( () => {
		wsClient.on( 'page:localizedScreenshot', screenshotsHandler );
		return () =>
			wsClient.off( 'page:localizedScreenshot', screenshotsHandler );
	}, [ screenshotsHandler ] );

	return null;
}
