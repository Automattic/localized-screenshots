const { Server } = require( 'socket.io' );
// const ProjectWordPressCom = require( './projects/project-wordpress-com' );
const ProjectWordPressCom = require( './projects/project-example-com' );

// Load environment variables.
require( 'dotenv' ).config();

// Start WebSockets server.
const io = new Server( 3004, {
	cors: {
		origin: '*',
	},
} );

// Handle WebSockets connections.
io.on( 'connection', ( socket ) => {
	new ProjectWordPressCom( socket );
} );
