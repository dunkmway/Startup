import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { AuthState } from './pages/login/authState';
import './app.css';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { NewPlace } from './pages/new-place/new-place';
import { Place } from './pages/place/place';
import { Profile } from './pages/profile/profile';
import { getCurrentLocation } from './utils/scripts/_helpers.mjs';

function App() {
	const [user, setUser] = React.useState(localStorage.getItem('userName') || '');
	const currentAuthState = user ? AuthState.Authenticated : AuthState.Unauthenticated;
	const [authState, setAuthState] = React.useState(currentAuthState);
	const [currentLocation, setCurrentLocation] = React.useState();

	React.useEffect(() => {
		getCurrentLocation(true, 10000, 0)
		.then(position => {
			setCurrentLocation(position);
		})
		.catch(err => {
			console.log(err)
		})
	}, [])
    
	return (
		<BrowserRouter>
			<header>
				<NavLink to="home" className="logo">
					<img src="images/Logo.png"></img>
					<h1>There</h1>
				</NavLink>
				<nav>
					<menu>
						{authState === AuthState.Unauthenticated && (
							<li>
								<NavLink to='login'>Login</NavLink>
							</li>
						)}
						{authState === AuthState.Authenticated && (
							<li>
								<NavLink to='profile'>{user.username}</NavLink>
							</li>
						)}
					</menu>
				</nav>
			</header>
	
			<Routes>
				<Route path='/' element={<Home location={currentLocation} />}/>
				<Route path='/login' element={<Login />} />
				<Route path='/new-place' element={<NewPlace />} />
				<Route path='/place' element={<Place />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
	
			<footer>
				<p>Duncan Morais</p>
				<a href="https://github.com/dunkmway/Startup">GitHub</a>
			</footer>
		</BrowserRouter>
    );
}

function NotFound() {
  return <main>404: Return to sender. Address unknown.</main>;
}

export default App;
