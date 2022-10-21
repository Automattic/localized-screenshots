import React from 'react';
import { NavLink } from 'react-router-dom';

const PROJECTS = [
	{ id: 'wpcom', title: 'WordPress.com' },
	{ id: 'example', title: 'Example.com' },
];

const RESOLUTIONS = [
	{ width: 375, height: 667 },
	{ width: 768, height: 1024 },
	{ width: 1024, height: 768 },
	{ width: 1280, height: 720 },
	{ width: 1920, height: 1080 },
];

export default function PageHome() {
	const [ selectedProject, setProject ] = React.useState( '' );
	const [ selectedResolution, setResolution ] = React.useState( '' );
	const handleSetProject = ( event ) => setProject( event.target.value );
	const handleSetResolution = ( event ) =>
		setResolution( event.target.value );

	return (
		<div class="init-panel">
			<label htmlFor="project">Project: </label>
			<select
				id="project"
				value={ selectedProject }
				onChange={ handleSetProject }
			>
				<option />
				{ PROJECTS.map( ( project ) => (
					<option key={ project.id } value={ project.id }>
						{ project.title }
					</option>
				) ) }
			</select>

			<label htmlFor="resolution">Resolution: </label>
			<select
				id="resolution"
				value={ selectedResolution }
				onChange={ handleSetResolution }
			>
				<option />
				{ RESOLUTIONS.map( ( resolution ) => (
					<option
						key={ `${ resolution.width }x${ resolution.height }` }
						value={ `${ resolution.width }x${ resolution.height }` }
					>
						{ resolution.width }x{ resolution.height }
					</option>
				) ) }
			</select>

			{ selectedProject && selectedResolution && (
				<NavLink
					className="button"
					to={ `/create/${ selectedProject }/${ selectedResolution }` }
				>
					Start Session
				</NavLink>
			) }
		</div>
	);
}
