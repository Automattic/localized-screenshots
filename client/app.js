import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ErrorHandler from '/components/error-handler';
import PageHome from '/pages/home';
import PageCreate from '/pages/create';
import PageEdit from '/pages/edit';
import PageMockups from '/pages/mockups';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={ <PageHome /> } />
				<Route
					path="/create/:project/:resolution"
					element={ <PageCreate /> }
				/>
				<Route path="/edit/:screenshotId" element={ <PageEdit /> } />
				<Route path="/mockups/*" element={ <PageMockups /> } />
			</Routes>

			<ErrorHandler />
		</BrowserRouter>
	);
}
