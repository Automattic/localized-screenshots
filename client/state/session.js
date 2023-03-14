import { create } from 'zustand';
import { createStoreSetter } from '/state/utils';

export const useSessionStore = create( ( set ) => ( {
	isReady: false,
	setIsReady: createStoreSetter( set, 'isReady' ),
} ) );
