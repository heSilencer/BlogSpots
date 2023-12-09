import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function Home() {
  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg" fixed="top" className='p-3'>
        <Navbar.Brand href="/"><strong>ShoPay</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default Home;
