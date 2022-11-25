import React from 'react';
import { useParams } from 'react-router-dom';

import Controls from '/components/controls';
import Editor, { EditorProvider } from '/components/editor';
import Screenshots from '/components/screenshots';
import { useScreenshotsContext, useCanvasContext } from '/state';
import { imageToDataURL } from '/lib/helpers';
import wsClient from '/web-sockets';

function SessionController( { project, width, height } ) {
	React.useEffect( () => {
		wsClient.emit( 'session:start', {
			project,
			width,
			height,
		} );
	}, [] );

	return null;
}

function ScreenshotsRequestController() {
	const { screenshotId } = useParams();
	const { setScreenshots, setSelectedScreenshotIndex } =
		useScreenshotsContext();
	const { setLockedScreen, setAnnotations } = useCanvasContext();

	React.useEffect( () => {
		fetch(
			`${ API_ROOT }/wp-json/localized-screenshots/v1/get?${ new URLSearchParams(
				{ id: screenshotId }
			) }`,
			{
				method: 'GET',
			}
		)
			.then( ( response ) => response.json() )
			.then( async ( payload ) => {
				return Promise.all(
					payload.map( async ( { meta, locale, url, id } ) => {
						const data = await imageToDataURL( url );

						return {
							id,
							data,
							meta: {
								locale,
								page: meta.page,
								offset: meta.offset,
							},
							annotations: meta.annotations,
						};
					} )
				).then( ( screenshots ) => {
					const parentScreenshot = screenshots[ 0 ];
					const { annotations, meta } = parentScreenshot;
					const { page } = meta;

					setLockedScreen( { page } );
					setAnnotations( annotations );
					setScreenshots( screenshots );
					setSelectedScreenshotIndex( 0 );
				} );
			} );
	}, [ screenshotId ] );

	return null;
}

export default function PageEdit() {
	const { selectedScreenshot } = useScreenshotsContext();
	const projectProps = selectedScreenshot?.meta?.project;

	return (
		<EditorProvider>
			{ projectProps && <SessionController { ...projectProps } /> }

			<ScreenshotsRequestController />

			<div className="nav">
				<Controls />
				<Screenshots />
			</div>

			<Editor />
		</EditorProvider>
	);
}
