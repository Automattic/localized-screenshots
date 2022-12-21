const express = require( 'express' );
const path = require( 'path' );
const { Server } = require( 'socket.io' );

// Load environment variables.
require( 'dotenv' ).config();

// Create the Expresss app.
const app = express();

// Use API Router.
const restAPIRouter = require( './rest-api' );
app.use( '/api', restAPIRouter );

// Register static files directory.
app.use( '/assets', express.static( path.join( 'public', 'client' ) ) );

// Handle all routes requests.
app.get( '*', ( _req, res ) => {
	res.sendFile( path.join( __dirname, '..', 'public', 'index.html' ) );
} );

// Start the HTTP server.
const server = app.listen( process.env.PORT, () =>
	console.log(
		`Localized Screenshots is listening on port ${ process.env.PORT }.`
	)
);

// Start WebSockets server.
const io = new Server( server );

// Require projects.
const ProjectExampleCom = require( './projects/project-example-com' );
const ProjectWordPressCom = require( './projects/project-wordpress-com' );

// Projects ids mapping.
const projectsMap = {
	example: ProjectExampleCom,
	wpcom: ProjectWordPressCom,
};

// Handle WebSockets connections.
io.on( 'connection', ( socket ) => {
	socket.on(
		'request:startSession',
		( { project, width, height } = {}, uuid ) => {
			const config = { uuid };

			if ( Number.isInteger( width ) ) {
				config.width = width;
			}

			if ( Number.isInteger( height ) ) {
				config.height = height;
			}

			const Project = projectsMap[ project ];

			if ( Project ) {
				new Project( socket, config );
			}
		}
	);
} );
