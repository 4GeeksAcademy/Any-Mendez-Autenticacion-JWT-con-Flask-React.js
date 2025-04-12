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
        navigate('/private');
      }
      else {
        throw new Error("Ocurrio un error al llamar al endpoint /login");
      };

      const dataResponse = await response.json();
      sessionStorage.setItem("access_token", dataResponse.access_token)
      setInfoData(dataResponse)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

  }, [])

  return (
    <div className="text-center mt-5">
      <h1>LOGIN</h1>
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
        <button type="button" onClick={handleLogin} className="btn btn-primary">Login</button>
      </form>
    </div>

  );

}

export default Login