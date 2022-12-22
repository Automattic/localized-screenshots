/**
 * Whether the auth header is authorized.
 *
 * @param  {string}  authHeader Authorization header
 * @return {Boolean}
 */
function isAuthorized( authHeader = '' ) {
	if ( ! process.env.AUTHENTICATION ) {
		return true;
	}

	const [ , authToken = '' ] = authHeader.split( ' ' );
	const auth = new Buffer.from( authToken, 'base64' ).toString();

	return auth === process.env.AUTHENTICATION;
}

exports.isAuthorized = isAuthorized;

/**
 * Authentication middleware.
 */
function authMiddleware( req, res, next ) {
	if ( isAuthorized( req?.headers?.authorization ) ) {
		next();
	} else {
		res.setHeader( 'WWW-Authenticate', 'Basic' );
		res.send( 401 );
	}
}

exports.authMiddleware = authMiddleware;
