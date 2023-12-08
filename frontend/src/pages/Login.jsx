// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginSchema } from '../validations/userController';
import '../App.css'


function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await loginSchema.validate(values, { abortEarly: false });
    
      // Validation successful, proceed with login
      const response = await axios.post('http://localhost:3000/login', values);
    
      if (response.data.Status === 'Success') {
        console.log("Login Successfully");
        const userRole = response.data.Role;
    
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'user') {
          navigate('/dashboard');
        } else {
          alert("Invalid user role");
        }
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      // Validation failed, handle errors
      alert(error.errors);
    }
  };

  return (
    <>
    <div className="home">
      <div className="row">
        <div className="col1">
          <h2>Welcome Back!</h2>
          <p>To keep connected with us please login with your personal info</p>
        </div>
        <div className="col2">
          <h2>LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <input
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
            />
            <input
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
            />
            <button className="button" type="submit">
              Login
            </button>
            <a href="/register">No account yet? Click here to Register</a>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
