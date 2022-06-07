import { CanvasContextProvider } from './canvas';
import { ScreenshotsContextProvider } from './screenshots';

export { useCanvasContext } from './canvas';
export { useScreenshotsContext } from './screenshots';

export function StateProvider( { children } ) {
	const providers = [ CanvasContextProvider, ScreenshotsContextProvider ];

	return providers.reduce( ( innerChildren, Provider ) => {
		return <Provider>{ innerChildren }</Provider>;
	}, children );
}
