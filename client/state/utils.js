/**
 * Create a store setter action.
 *
 * @param  {Function} set Store set function
 * @param  {string}   key Store key
 * @return {Function}     Store setter action
 */
export function createStoreSetter( set, key ) {
	return ( payload ) => {
		if ( typeof payload === 'function' ) {
			set( ( state ) => ( {
				[ key ]: payload( state[ key ] ),
			} ) );
		} else {
			set( { [ key ]: payload } );
		}
	};
}
