import React from 'react';
import wsClient from '/web-sockets';
import { useCanvasContext, useScreenshotsContext } from '/state';
import { getLanguageBySlug } from '/lib/languages';
import { realignShapesForRTL } from '/lib/helpers';
import { useEditorContext } from '/components/editor';

export default function ScreenshotsController() {
	const { setScreenshots } = useScreenshotsContext();
	const { annotations } = useCanvasContext();
	const editorRef = useEditorContext();

	const screenshotsHandler = React.useCallback(
		( payload ) => {
			payload.annotations = annotations;

			// Re-align annotations for RTL locales.
			if ( getLanguageBySlug( payload?.meta?.locale )?.rtl ) {
				payload.annotations = realignShapesForRTL(
					payload.annotations,
					editorRef.current
				);
			}

			setScreenshots( ( screenshots ) => screenshots.concat( payload ) );
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
