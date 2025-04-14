import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

      if (response.ok) {
        navigate('/login');
      }
      else {
        throw new Error("Ocurrio un error al llamar al endpoint /register");

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
      <h1 className="text-danger">SIGNUP</h1>
      <form>
        <div className="mt-5 text-warning">
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
          }} className="form-control" id="exampleInputPassword1" placeholder="Password" />
        </div>
        <button type="button" onClick={handleRegister} className="btn btn-primary">Signup</button>
      </form>
      </div>
    </div>

  );

}

export default Signup