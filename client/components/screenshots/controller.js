import React from 'react';
import wsClient from '/web-sockets';
import { useCanvasStore, useScreenshotsStore } from '/state';
import { getLanguageBySlug } from '/lib/languages';
import { realignShapesForRTL } from '/lib/helpers';
import { useEditorContext } from '/components/editor';

export default function ScreenshotsController() {
	const { setScreenshots } = useScreenshotsStore();
	const { annotations, offset } = useCanvasStore();
	const editorRef = useEditorContext();

	const screenshotsHandler = React.useCallback(
		( payload ) => {
			payload.annotations = JSON.parse( JSON.stringify( annotations ) );
			payload.offset = { ...offset };

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

			// Adjust crop offset for RTL locales.
			if ( getLanguageBySlug( payload?.meta?.locale )?.rtl ) {
				payload.offset.left = offset.right;
				payload.offset.right = offset.left;
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
		[ setScreenshots, annotations, offset ]
	);

	React.useEffect( () => {
		wsClient.on( 'page:localizedScreenshot', screenshotsHandler );
		return () =>
			wsClient.off( 'page:localizedScreenshot', screenshotsHandler );
	}, [ screenshotsHandler ] );

	return null;
}
