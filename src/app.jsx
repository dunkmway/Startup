import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './app.css';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { NewPlace } from './pages/new-place/new-place';
import { Place } from './pages/place/place';
import { Profile } from './pages/profile/profile';
import { NotFound } from './pages/NotFound/NotFound';

import { getCurrentLocation } from './utils/scripts/_helpers.mjs';
import { getCurrentUser } from './utils/scripts/_auth.mjs';
import { PublicAccess } from './components/PageAccess/PublicAccess';
import { Layout } from './components/layout/layout';
import { PrivateAccess } from './components/PageAccess/PrivateAccess';
import { NoLocation } from './pages/NoLocation/NoLocation';

function App() {
	const [user, setUser] = React.useState(null);
	const [location, setLocation] = React.useState();

	React.useEffect(() => {
		getCurrentLocation(true, 10000, 0)
		.then(position => setLocation(position))
		.catch(err => setLocation({}));

		getCurrentUser()
		.then(user => setUser(user))
		.catch(err => setUser({}));
	}, [])
    
	return (
		<>
			{location == null || location.coords != null ?
				<BrowserRouter>
					<Routes>
						<Route 
							path='/'
							exact
							element={
								<Layout user={user} setUser={setUser}>
									<Home location={location}/>
								</Layout>
							}
						/>
						<Route
							path='/login'
							element={
								<PublicAccess user={user}>
									<Login setUser={setUser}/>
								</PublicAccess>
							}
						/>
						<Route
							path='/new-place'
							element={
								<PrivateAccess user={user}>
									<Layout user={user} setUser={setUser}>
										<NewPlace user={user}/>
									</Layout>
								</PrivateAccess>
							}
						/>
						<Route
							path='/place'
							element={
								<Place user={user} location={location}/>
							}
						/>
						<Route
							path='/profile'
							element={
								<PrivateAccess user={user}>
									<Layout user={user} setUser={setUser}>
										<Profile user={user}/>
									</Layout>
								</PrivateAccess>
							}
						/>
						<Route
							path='*'
							element={
								<Layout user={user} setUser={setUser}>
									<NotFound/>
								</Layout>
							}
						/>
					</Routes>
				</BrowserRouter> :
				<NoLocation></NoLocation>
			}
		</>
    );
}

export default App;
