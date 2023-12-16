import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button, Table, Modal, Form, Tab, Tabs, Row, Container, Col, Card, InputGroup } from 'react-bootstrap';
import { productSchema } from '../validations/userController';
import UpdateContentModal from './UpdateContentModal';

function AdminPage() {
  const [userData, setUserData] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const [values, setValues] = useState({
        title: '',
        description: '',
        author: '',
        image: '',
  });

  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await productSchema.validate(values, { abortEarly: false });
      const response = await axios.post('http://localhost:3000/add_content', values);
  
      if (response && response.data && response.data.Status === 'Content added successfully') {
        alert(response.data.Status);
  
        setValues({
          title: '',
          description: '',
          author: '',
          image: '',
        });
  

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (response && response.data && response.data.Status === 'Content name already exists') {
        alert(response.data.Status);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        alert(Object.values(validationErrors).join('\n'));
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleEdit = (content) => {
    setSelectedContent(content);
    setShowUpdateModal(true);
  };
//update
  const handleUpdate = async (updatedValues) => {
    // Ensure you have the authentication token (yourAuthToken) before making the request
  
    try {
      const response = await axios.put(
        `http://localhost:3000/update_content/${selectedContent.id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Replace yourAuthToken with the actual authentication token
          },
        }
      );
      if (response && response.data && response.data.Status === 'Content updated successfully') {
        alert(response.data.Status);
        setShowUpdateModal(false);
        // Fetch updated content data
        fetchContentData();
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error updating content:', error);
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (itemId, itemType) => {
    try {
      const response = await axios.delete(`http://localhost:3000/delete/${itemType}/${itemId}`);
      
      if (response && response.data && response.data.Status === 'Item deleted successfully') {
        alert(response.data.Status);
  
        if (itemType === 'user') {
          const updatedUserData = userData.filter(user => user.id !== itemId);
          setUserData(updatedUserData);
        } else if (itemType === 'content') {
          const updatedContentData = contentData.filter(product => product.product_id !== itemId);
          setContentData(updatedContentData);
        }
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  

  useEffect(() => {
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then((responseData) => {
        setUserData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/content')
      .then((response) => response.json())
      .then((responseData) => {
        setContentData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchContentData();
  }, []);

  const fetchUserData = () => {
    fetch('http://localhost:3000/data')
      .then((response) => response.json())
      .then((responseData) => {
        setUserData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  const fetchContentData = () => {
    fetch('http://localhost:3000/content')
      .then((response) => response.json())
      .then((responseData) => {
        setContentData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching content data:', error);
      });
  };

  
  return (
    <>
        <Navbar style={{ backgroundColor: 'darkblue', color: 'darkblue' }} variant="dark" expand="lg" fixed="top" className='p-3'>

        <Navbar.Brand><strong>Admin Panel</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 justify-content-end">
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Tabs defaultActiveKey="user" id="uncontrolled-tab-example" className="mt-5 pl-5 pt-5" fill>
        <Tab eventKey="manageuser" title="Manage User"  className='pt-1'>
          <div className="container-fluid p-4 pt-0"><br /><br />
              <h2>Registered User</h2>
              <Table striped="columns" bordered hover responsive variant="primary">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Birthdate</th>
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
                      <td>{user.email}</td>
                      <td>
                        <Button variant="danger"  onClick={() => handleDelete(user.id, 'user')}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
        </Tab>
        
        <Tab eventKey="managecontent" title="Manage Blog" className='pt-4'>
  <div className="container-fluid p-4">
    <h2>Blog List</h2>
    <Table striped bordered hover responsive variant="primary">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Author</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {contentData.map((content, index) => (
          <tr key={index}>
            <td>{content.id}</td>
            <td>{content.title}</td>
            <td>{content.description}</td>
            <td>{content.author}</td>
            <td>
              <Button variant="danger" onClick={() => handleDelete(content.id, 'content')}>
                Delete
              </Button>
              {' '}
              <Button variant="primary" onClick={() => handleEdit(content)}>
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
</Tab>


        <Tab eventKey="manageccomment" title="Manage Comment" className='pt-4'>
        <div className="container-fluid p-4">
          <h2>Comment List</h2>
          <Table striped="columns" bordered hover responsive  variant="primary">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Comments</th>
                <th>Action</th>
              </tr>
            </thead>
            
          </Table>
        </div>
        </Tab>
        <Tab eventKey="addcontent" title="Add Blog">
          <Container className="mt-2 pt-5">
          <Row className="justify-content-md-center">
          <Col md={6}>
            <Card>
              <Card.Body>
              <h1>Add Blog</h1>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='mt-0'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Input title"
                      onChange={(e) => setValues({ ...values, title: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className='mt-2'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Input description"
                      onChange={(e) => setValues({ ...values, description: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className='mt-2'>
                    <Form.Label>Product Photo</Form.Label>
                    <Form.Control
                      type="text"
                      name="text"
                      placeholder="Input blog photo url"
                      onChange={(e) => setValues({ ...values, image: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group className='mt-2'>
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      type="text"
                      name="author"
                      placeholder="Input author"
                      onChange={(e) => setValues({ ...values, author: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className='mt-3'>
                    Add Blog
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </Container>
        </Tab>
      </Tabs>
       {/* Add UpdateContentModal here */}
       {showUpdateModal && (
        <UpdateContentModal
          show={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
          handleUpdate={handleUpdate}
          content={selectedContent}
        />
      )}
    </>
  );
}

export default AdminPage;


