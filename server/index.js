const { Server } = require( 'socket.io' );
const ProjectExampleCom = require( './projects/project-example-com' );
const ProjectWordPressCom = require( './projects/project-wordpress-com' );

// Load environment variables.
require( 'dotenv' ).config();

// Start WebSockets server.
const io = new Server( 3004, {
	cors: {
		origin: '*',
	},
} );

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
