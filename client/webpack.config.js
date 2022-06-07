const set = require( 'lodash.set' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = set( defaultConfig, 'resolve.roots', [ __dirname ] );
