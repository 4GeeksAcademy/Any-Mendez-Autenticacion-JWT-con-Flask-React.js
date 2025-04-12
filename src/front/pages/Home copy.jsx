import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home3333 = () => {

	const { store, dispatch } = useGlobalReducer();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [infoData, setInfoData] = useState();
	const [infoMe, setInfoMe] = useState();



	const handleLogin = async () => {
		const data = {
			"email": email,
			"password": password
		};

		try {
			const response = await fetch('https://silver-zebra-q7p4949j94qjcvj-3001.app.github.dev/login', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				throw new Error("Ocurrio un error al llamar al endpoint /login");

			};

			const dataResponse = await response.json();
			sessionStorage.setItem("access_token", dataResponse.access_token)
			setInfoData(dataResponse)
		} catch (error) {
			console.error(error);

		}

	};

	const handleMe = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
				}
			});

			const data = await response.json()
			setInfoMe(data)
		} catch (error) {

		}
	}

	const handleRegister = async () => {
		const data = {
			"email": email,
			"password": password,
			"is_active": true
		};

		try {
			const response = await fetch('https://silver-zebra-q7p4949j94qjcvj-3001.app.github.dev/register', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				throw new Error("Ocurrio un error al llamar al endpoint /register");

			};
		} catch (error) {
			console.error(error);
		}
	};


	useEffect(() => {

	}, [])

	return (
		<div className="text-center mt-5">
			<form>
				<div className="mb-3">
					<label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
					<input type="email" onChange={(e) => {
						setEmail(e.target.value)
					}} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
					<div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
				</div>
				<div className="mb-3">
					<label htmlFor="exampleInputPassword1" className="form-label">Password</label>
					<input type="password" onChange={(e) => {
						setPassword(e.target.value)
					}} className="form-control" id="exampleInputPassword1" />
				</div>

					{/* <Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link> */}

				<button type="button" onClick={handleLogin} className="btn btn-primary">Login...</button>
				<button type="button" onClick={handleMe} className="btn btn-primary">Show my info...</button>
				<button type="button" onClick={handleRegister} className="btn btn-primary">Register</button>


			</form>
		</div>

	);
}; 