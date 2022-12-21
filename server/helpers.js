const fetch = require( 'node-fetch' );
const FormData = require( 'form-data' );

const API_ROOT = `${ process.env.API_URL }/wp-json/localized-screenshots/v1`;

/**
 * Make an authenticated API request.
 *
 * @param  {string} options.pathname API endpoint pathname
 * @param  {string} options.method   HTTP method
 * @param  {object} options.data     Request data payload
 * @param  {object} options.params   Query params
 * @return {object}                  JSON Response
 */
async function makeRequest( { pathname, method = 'GET', data, params } ) {
	const queryString = params ? `?${ new URLSearchParams( params ) }` : '';
	const response = await fetch(
		`${ API_ROOT }/${ pathname }${ queryString }`,
		{
			method,
			body: data,
		}
	);

	return await response.json();
}

exports.makeRequest = makeRequest;

/**
 * Get a screenshot entity data.
 *
 * @param  {number} id          Screenshot ID
 * @return {Promise<object>}    Screenshot data
 */
async function getScreenshot( id ) {
	return makeRequest( { pathname: 'get', method: 'GET', params: { id } } );
}

exports.getScreenshot = getScreenshot;

/**
 * Update a screenshot entry.
 *
 * @param  {number} id              Screenshot ID
 * @param  {object} fields          Screenshot data
 * @param  {object[]}  [screenshot] Screnshot file object
 * @return {Promise<object>}        Screenshot updated
 */
async function updateScreenshot( id, fields, [ screenshot ] = [] ) {
	if ( ! screenshot ) {
		return false;
	}

	const data = new FormData();

	for ( const key in fields ) {
		data.append( key, fields[ key ] );
	}

	data.append( screenshot.fieldname, screenshot.buffer, {
		filename: screenshot.originalname,
		contentType: screenshot.mimetype,
	} );

	return makeRequest( {
		pathname: 'update',
		method: 'POST',
		params: { id },
		data,
	} );
}

exports.updateScreenshot = updateScreenshot;

/**
 * Upload new screenshot entry.
 *
 * @param  {object} fields          Screenshot data
 * @param  {object[]}  [screenshot] Screnshot file object
 * @return {Promise<object>}        Screenshot data object
 */
async function uploadScreenshot( fields, [ screenshot ] ) {
	if ( ! screenshot ) {
		return false;
	}

	const data = new FormData();

	for ( const key in fields ) {
		data.append( key, fields[ key ] );
	}

	data.append( screenshot.fieldname, screenshot.buffer, {
		filename: screenshot.originalname,
		contentType: screenshot.mimetype,
	} );

	return makeRequest( {
		pathname: 'upload',
		method: 'POST',
		data,
	} );
}

exports.uploadScreenshot = uploadScreenshot;
