import { create } from 'zustand';
import { createStoreSetter } from '/state/utils';

export const useCanvasStore = create( ( set ) => ( {
	lockedScreen: null,
	setLockedScreen: createStoreSetter( set, 'lockedScreen' ),
	actions: [],
	setActions: createStoreSetter( set, 'actions' ),
	annotations: null,
	setAnnotations: createStoreSetter( set, 'annotations' ),
	size: { width: 1280, height: 720 },
	setSize: createStoreSetter( set, 'size' ),
	offset: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	setOffset: createStoreSetter( set, 'offset' ),
} ) );
