import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button, Table, Modal, Form } from 'react-bootstrap';


function AdminPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleLogout = () => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.Status === 'Success') {
          console.log('Logout Successfully');
          navigate('/');
        } else {
          console.error('Logout failed');
        }
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  const handleDelete = (itemId) => {
    // Implement the logic for deleting an item
    console.log(`Deleting item with ID ${itemId}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [selectedItemData, setSelectedItemData] = useState(null);

  const handleUpdate = (itemId) => {
    setSelectedItemId(itemId);
    setShowModal(true);

    // Find the selected item data from the array
    const selectedItem = data.find((item) => item.id === itemId);
    setSelectedItemData(selectedItem);
  };

  useEffect(() => {
    // Make a GET request to fetch data from the server
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then((responseData) => {
        // Log the retrieved data to the console
        // console.log('Data from server:', responseData);

        // Set the retrieved data to the state
        setData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
    <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="p-3">
        <Navbar.Brand href="/">ShoPay</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Button variant="success" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
       
      </Navbar>

      <div className="container mt-4"><br /><br /><br />
        <h2>Data Table</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Birthdate</th>
              <th>Role</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.birthdate}</td>
                <td>{item.role}</td>
                <td>{item.email}</td>
                <td>
                  <Button variant="warning" onClick={() => handleUpdate(item.id)}>
                    Show Details
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Update */}
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Update Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Update form fields based on the selected item data */}
        {selectedItemData && (
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                readOnly
                value={selectedItemData.name} // Set the value from the selected item data
                onChange={(e) => {
                  // Update the state when the input changes (if needed)
                  setSelectedItemData({ ...selectedItemData, name: e.target.value });
                }}
              />
            </Form.Group>
            
            <Form.Group className='mt-2'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={selectedItemData.username}
                    placeholder="Username"
                    readOnly
                    onChange={(e) => {
                      // Update the state when the input changes (if needed)
                      setSelectedItemData({ ...selectedItemData, username: e.target.value });
                    }}
                  />
                </Form.Group>

                <Form.Group className='mt-2'>
                  <Form.Label>Birthdate</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthdate"
                    value={selectedItemData.birthdate}
                    placeholder="Birthdate"
                    readOnly
                    onChange={(e) => {
                      // Update the state when the input changes (if needed)
                      setSelectedItemData({ ...selectedItemData, birthdate: e.target.value });
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="formRole" className='mt-2'>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    value={selectedItemData.role}
                    onChange={(e) => {
                      setSelectedItemData({ ...selectedItemData, role: e.target.value });
                    }}
                    readOnly // Add the readOnly attribute
                  >
                    <option>Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className='mt-2'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={selectedItemData.email}
                    placeholder="Email"
                    readOnly
                    onChange={(e) => {
                      // Update the state when the input changes (if needed)
                      setSelectedItemData({ ...selectedItemData, email: e.target.value });
                    }}
                  />
                </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default AdminPage;


