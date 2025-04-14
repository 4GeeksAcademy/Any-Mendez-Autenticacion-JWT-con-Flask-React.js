import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [infoData, setInfoData] = useState();

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

      if (response.ok) {
        const dataResponse = await response.json();
        sessionStorage.setItem("access_token", dataResponse.access_token)
        setInfoData(dataResponse)
        navigate('/private');
        window.location.reload();
      }
      else {
        throw new Error("Ocurrio un error al llamar al endpoint /login");
      };

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

  }, [])

  return (
    <div className="container-fluid">
      <div className="container text-center mt-5 mb-5">
        <h1 className="text-danger">LOGIN</h1>
        <form>
          <div className="mt-5 mb-5 text-warning">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" onChange={(e) => {
              setEmail(e.target.value)
            }} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="email@example.com" />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mt-5 mb-5 text-warning">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" onChange={(e) => {
              setPassword(e.target.value)
            }} className="form-control" id="exampleInputPassword1" placeholder="password" />
          </div>
          <button type="button" onClick={handleLogin} className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>

  );

}

export default Login