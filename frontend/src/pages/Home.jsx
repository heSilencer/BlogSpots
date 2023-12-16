import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Card, Button, Container, Row, Col } from 'react-bootstrap';

function YourComponent() {
  const navigate = useNavigate();
  const [contentData, setcontentData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/content')
      .then((response) => response.json())
      .then((responseData) => {
        setcontentData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleReadMore = (contentId) => {
    // Navigate to the detailed view of the blog post
    navigate(`/BlogDetails`);
  };

  return (
    <>
      <Navbar style={{ backgroundColor: 'darkblue', color: 'darkblue' }} variant="dark" expand="lg" fixed="top" className='p-3'>
        <Navbar.Brand href="/"><strong>Ming Mingle</strong></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 justify-content-end">
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid className="mt-5 pt-5">
        <Row xs={2} md={3} lg={4} xl={5} xxl={6} className="g-4">
          {contentData.map((content, index) => (
            <Col key={index}>
              <Card style={{ width: '14rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Card.Img
                  variant="top"
                  src={content.image}
                  style={{ height: '50%', objectFit: 'cover' }}/>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{content.title}</Card.Title>
                  <Card.Text>{content.description}</Card.Text>
                  <div className="mt-auto d-sm-inline-block">
                    <Card.Text>Author:<br></br> {content.author}</Card.Text>
                    <Button variant="primary" onClick={() => handleReadMore(content.id)}> Read More
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default YourComponent;
