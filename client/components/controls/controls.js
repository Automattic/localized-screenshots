import React from 'react';
import wsClient from '/web-sockets';
import { useCanvasStore, useScreenshotsStore } from '/state';
import { languages } from '/lib/languages';
import LockedScreenController from './controller';
import UploadScreenshots from './upload-screenshots';
import RecordActions from './record-actions';

export default function Controls() {
	const { lockedScreen, actions } = useCanvasStore();
	const { screenshots } = useScreenshotsStore();
	const [ isLoading, setIsLoading ] = React.useState( false );
	const [ screenshotsQueue, setScreenshotsQueue ] = React.useState( {} );
	const [ locales, setLocales ] = React.useState( [] );
	const handleLocalesChange = ( event ) => {
		const selected = [ ...event.target.options ]
			.filter( ( option ) => option.selected )
			.map( ( option ) => option.value );
		setLocales( selected );
	};
	const generateLocalizedScreenshots = () => {
		if ( isLoading ) {
			return;
		}

		const { page } = lockedScreen;

		wsClient.emit( 'request:localizedScreenshots', {
			locales,
			page,
			actions,
		} );
		setScreenshotsQueue(
			locales.reduce( ( queue, locale ) => {
				queue[ locale ] = {};
				return queue;
			}, {} )
		);
		setIsLoading( true );

		const screenshotQueueHandler = ( { meta } ) => {
			setScreenshotsQueue( ( queue ) => {
				const updatedQueue = {
					...queue,
					[ meta.locale ]: { isReady: true },
				};
				const remainingScreenshots = Object.values(
					updatedQueue
				).filter( ( locale ) => ! locale.isReady );

				if ( remainingScreenshots.length === 0 ) {
					wsClient.off(
						'page:localizedScreenshot',
						screenshotQueueHandler
					);
					setIsLoading( false );
				}

				return updatedQueue;
			} );
		};
		wsClient.on( 'page:localizedScreenshot', screenshotQueueHandler );
	};
	const totalQueueCount = Object.values( screenshotsQueue ).length;
	const remainingQueueCount = Object.values( screenshotsQueue ).filter(
		( screenshot ) => ! screenshot.isReady
	).length;

	return (
		<ul className="controls">
			{ ! lockedScreen && (
				<>
					<li>
						<LockedScreenController />

						<button
							className="button"
							onClick={ () =>
								! isLoading &&
								wsClient.emit( 'request:screenshot' )
							}
							disabled={ isLoading }
						>
							Take Screenshot
						</button>
					</li>

					<li>
						<RecordActions />
					</li>
				</>
			) }

			{ lockedScreen && (
				<li>
					<select
						id="locales"
						onChange={ handleLocalesChange }
						value={ locales }
						multiple
					>
						{ languages.map( ( { slug, name } ) => (
							<option key={ slug } value={ slug }>
								{ !! screenshots.find(
									( screenshot ) =>
										screenshot?.meta?.locale === slug
								) && '[Update]' }{ ' ' }
								{ name }
							</option>
						) ) }
					</select>

					<button
						className="button"
						onClick={ generateLocalizedScreenshots }
						disabled={ isLoading }
					>
						Generate Localized Screenshots
					</button>
				</li>
			) }

			{ isLoading && (
				<li>
					<p>Generating screenshots...</p>
					<p>
						( { totalQueueCount - remainingQueueCount } /{ ' ' }
						{ totalQueueCount } )
					</p>
				</li>
			) }

			{ screenshots.length > 0 && ! isLoading && (
				<li>
					<UploadScreenshots />
				</li>
			) }
		</ul>
	);
}
