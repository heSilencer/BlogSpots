import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'

function Dashboard() {
  const navigate = useNavigate();

    const handleLogout = () => {
        // Make a POST request to the logout endpoint
        fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include', // Include credentials (cookies) in the request
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.Status === 'Success') {
                // Redirect to the home page after successful logout
                console.log('Logout Successfully');
                navigate('/');
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
    };

  return (
    <div>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
