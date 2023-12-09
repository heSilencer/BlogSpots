import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button, Table, Modal, Form, Tab, Tabs, Row, Container, Col, Card, InputGroup } from 'react-bootstrap';
import { productSchema } from '../validations/userController';

function AdminPage() {
  const [userData, setUserData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState({
    product_name: '',
    product_description: '',
    product_photo: '',
    product_qty: 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await productSchema.validate(values, { abortEarly: false });
      // Validation successful, proceed with product addition
      const response = await axios.post('http://localhost:3000/add_product', values);
  
      if (response && response.data && response.data.Status === 'Product added successfully') {
        // Product added successfully
        alert(response.data.Status);
  
        // Clear the input fields by resetting the state
        setValues({
          product_name: '',
          product_description: '',
          product_photo: '',
          product_qty: 0,
        });
  
        // Optionally, you can navigate to another page or perform other actions

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (response && response.data && response.data.Status === 'Product name already exists') {
        alert(response.data.Status);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        alert(Object.values(validationErrors).join('\n'));
      } else {
        // Handle other types of errors
        console.error('Unexpected error:', error);
      }
    }
  };
  
  const navigate = useNavigate();
  const [data, setData] = useState([]);

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
    console.log(`Deleting item with ID`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdate = (itemId) => {
    setSelectedItemId(itemId);
    setShowModal(true);
  
    // Find the selected item data from the userData array
    const selectedUserData = userData.find((user) => user.id === itemId);
  
    // If not found in userData, try finding in productData array
    const selectedItem = selectedUserData || productData.find((product) => product.id === itemId);
  
    setSelectedItemData(selectedItem);
  };

  useEffect(() => {
    // Make a GET request to fetch user data from the server
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then((responseData) => {
        // Set the retrieved user data to the state
        setUserData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    // Make a GET request to fetch product data from the server
    fetch('http://localhost:3000/product')
      .then((response) => response.json())
      .then((responseData) => {
        // Set the retrieved product data to the state
        setProductData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="p-3">
        <Navbar.Brand><strong>Admin Panel</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Button variant="success" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Tabs defaultActiveKey="user" id="uncontrolled-tab-example" className="mt-5 pl-5 pt-5" fill>
{/* Manage User */}
        <Tab eventKey="user" title="Manage User"  className='pt-1'>
          <div className="container-fluid p-4 pt-0"><br /><br />
              <h2>Registered User</h2>
              <Table striped="columns" bordered hover responsive variant="success">
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
                  {userData.map((user, index) => (
                    <tr key={index}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.birthdate}</td>
                      <td>{user.role}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button variant="danger">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
        </Tab>
{/* Manage Product */}
        <Tab eventKey="product" title="Manage Product" className='pt-4'>
        <div className="container-fluid p-4">
          <h2>Product List</h2>
          <Table striped="columns" bordered hover responsive  variant="success">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Product Description</th>
                <th>Product QTY</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((product, index) => (
                <tr key={index}>
                  <td>{product.product_id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.product_description}</td>
                  <td>{product.product_qty}</td>
                  <td>
                    <Button variant="danger">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        </Tab>
{/* Add Product */}
        <Tab eventKey="addproduct" title="Add Product">
          <Container className="mt-2 pt-5">
          <Row className="justify-content-md-center">
          <Col md={6}>
            <Card>
              <Card.Body>
              <h1>Add Product</h1>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='mt-0'>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter product name"
                      onChange={(e) => setValues({ ...values, product_name: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className='mt-2'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter product description"
                      onChange={(e) => setValues({ ...values, product_description: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className='mt-2'>
                    <Form.Label>Product Photo</Form.Label>
                    <Form.Control
                      type="text"
                      name="text"
                      placeholder="Enter product photo url"
                      onChange={(e) => setValues({ ...values, product_photo: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className='mt-2'>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      placeholder="Enter quantity"
                      onChange={(e) => setValues({ ...values, product_qty: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" className='mt-3'>
                    Add Product
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </Container>
        </Tab>
      </Tabs>
    </>
  );
}

export default AdminPage;


