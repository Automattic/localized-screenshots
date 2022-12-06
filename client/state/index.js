import { CanvasContextProvider } from '/state/canvas';
import { SessionContextProvider } from '/state/session';
import { ScreenshotsContextProvider } from '/state/screenshots';

export { useCanvasContext } from '/state/canvas';
export { useSessionContext } from '/state/session';
export { useScreenshotsContext } from '/state/screenshots';

export function StateProvider( { children } ) {
	const providers = [
		CanvasContextProvider,
		SessionContextProvider,
		ScreenshotsContextProvider,
	];

	return providers.reduce( ( innerChildren, Provider ) => {
		return <Provider>{ innerChildren }</Provider>;
	}, children );
}
