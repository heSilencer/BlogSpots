import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { registrationSchema } from '../validations/userController';
import '../App.css'

function Register() {
  const [values, setValues] = useState({
    name: '',
    username: '',
    email: '',
    birthdate: '',
    role: 'user',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await registrationSchema.validate(values, { abortEarly: false });
      // Validation successful, proceed with registration
      const response = await axios.post('http://localhost:3000/register', values);
      
      if (response && response.data && response.data.Status === 'Success') {
        navigate('/login');
      } else if (response && response.data && response.data.Status === "Email already exists") {
        alert(response.data.Status);
      } else if (response && response.data && response.data.Status === "Username already exists") {
        alert(response.data.Status);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        // console.log('Validation Errors:', validationErrors);
        alert(error.errors);
      } else {
        // Handle other types of errors
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <>
    <div className="home">
      <div className="row">
        <div className="col1">  
          <h2>Welcome Back!</h2>
          <p>To keep connected with us please sign up with your personal info</p>
        </div>
        <div className="col2">
          <h2>REGISTER</h2>
          <form onSubmit={handleSubmit}>
            <input
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="new-name"
            />
            <input
              onChange={(e) => setValues({ ...values, username: e.target.value })}
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
            />
            <input
              onChange={(e) => setValues({ ...values, birthdate: e.target.value })}
              type="date"
              name="birthdate"
              placeholder="Email"
              autoComplete="birthdate"
            />
            {/* <select
            onChange={(e) => setValues({ ...values, role: e.target.value })}
            name="role">
              <option defaultValue={""}>Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select> */}
            <input
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              type="text"
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
            <input
              onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
            />
            <input className="button" type="submit" value="Register" />
          </form>
          <a href="/login">Already have an account? Login Here</a>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;
