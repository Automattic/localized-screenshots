import React from 'react';
import { StateProvider } from '/state';
import App from '/app';

export default function Root() {
	return (
		<React.StrictMode>
			<StateProvider>
				<App />
			</StateProvider>
		</React.StrictMode>
	);
}
