const express = require( 'express' );
const multer = require( 'multer' );

const upload = multer();

const {
	getScreenshot,
	uploadScreenshot,
	updateScreenshot,
} = require( './helpers' );

const router = new express.Router();

// Parse application/json.
router.use( express.json() );

// Parse application/x-www-form-urlencoded.
router.use( express.urlencoded( { extended: true } ) );

router.get( '/screenshot/:id', ( req, res ) => {
	getScreenshot( req.params.id )
		.then( ( payload ) => res.json( payload ) )
		.catch( () => res.status( 500 ).send() );
} );

router.put( '/screenshot/:id', upload.any(), ( req, res ) => {
	updateScreenshot( req.params.id, req.body, req.files )
		.then( ( payload ) => res.json( payload ) )
		.catch( ( err ) => console.log( err ) || res.status( 500 ).send() );
} );

router.post( '/screenshot', upload.any(), ( req, res ) => {
	uploadScreenshot( req.body, req.files )
		.then( ( payload ) => res.json( payload ) )
		.catch( () => res.status( 500 ).send() );
} );

module.exports = router;
