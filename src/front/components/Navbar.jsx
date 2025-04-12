import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'

export const Navbar = () => {
	const navigate = useNavigate();
	const [token ,setToken] = useState(sessionStorage.getItem('access_token'));
	
	useEffect(() => {

		if (!token) {
			return;
		}
	}, [token]);

	const handleLogout = () => {
        sessionStorage.removeItem('access_token');
        setToken(null);
        navigate('/'); 
    };

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Autenticación JWT</span>
				</Link>
				<div className="dropdown ml-auto">

					<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						Menu
					</button>
					<ul className="dropdown-menu">
						{!token && (
							<>
							<Link to="/signup">
							<li><a className="dropdown-item">Register</a></li>
							</Link>
							<Link to="/login">
							<li><a className="dropdown-item" href="/login">Login</a></li>
							</Link>
							</>
						)}
						<Link to="/"><li>
							<a className="dropdown-item" href="/">Back Home</a></li>
							</Link>
						{token && ( 
							<li>
								<button className="dropdown-item" onClick={handleLogout}>
									Logout
								</button>
							</li>
						)}
					</ul>
				</div>

			</div>
		</nav>
	);
};

