/**
 * Basic authentication middleware.
 */
function basicAuthentication( req, res, next ) {
	const authHeader = req.headers.authorization;
	const [ , authToken = '' ] = ( authHeader || '' ).split( ' ' );
	const auth = new Buffer.from( authToken, 'base64' ).toString();

	if ( auth !== process.env.AUTHENTICATION ) {
		res.setHeader( 'WWW-Authenticate', 'Basic' );
		res.send( 401 );

		return;
	}

	next();
}

module.exports = basicAuthentication;
