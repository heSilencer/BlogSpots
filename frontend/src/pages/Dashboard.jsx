import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button, Table, Modal, Form } from 'react-bootstrap';

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
    <>
    <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="p-2">
        <Navbar.Brand href="/"><strong>ShoPay</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Button variant="light" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="container mt-4"><br /><br /><br />
        <h1>DASHBOARD</h1>
      </div>
    </>
  )
}

export default Dashboard
