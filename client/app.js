import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PageHome from '/pages/home';
import PageCreate from '/pages/create';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={ <PageHome /> } />
				<Route
					path="/create/:project/:resolution"
					element={ <PageCreate /> }
				/>
			</Routes>
		</BrowserRouter>
	);
}
