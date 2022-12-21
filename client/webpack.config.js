const webpack = require( 'webpack' );
const set = require( 'lodash.set' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// Load environment variables.
require( 'dotenv' ).config();

// Configure module resolve roots.
let config = set( defaultConfig, 'resolve.roots', [ __dirname ] );

// Define global constants.
config = set(
	defaultConfig,
	'plugins',
	config.plugins.concat(
		new webpack.DefinePlugin( {
			API_URL: JSON.stringify(
				process.env.API_URL ?? 'http://localhost:8888'
			),
		} )
	)
);

module.exports = config;
