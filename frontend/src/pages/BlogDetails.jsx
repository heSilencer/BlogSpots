import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Button, Card } from 'react-bootstrap';

function BlogDetail() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [content, setBlogDetails] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch blog details based on contentId
    fetch(`http://localhost:3000/content/${contentId}`)
      .then((response) => response.json())
      .then((responseData) => {
        setBlogDetails(responseData);
      })
      .catch((error) => {
        console.error('Error fetching blog details:', error);
      });

    // Fetch comments for the content
    // fetch(`http://localhost:3000/comments/${contentId}`)
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     setComments(responseData);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching comments:', error);
    //   });
  }, [contentId]);

  const handleGoBack = () => {
    // Navigate back to the dashboard
    navigate('/dashboard');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    // Send the comment to the server
    fetch(`http://localhost:3000/add_comment/${contentId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === 'Success') {
          // If the comment is successfully saved, update the comments state
          setComments([...comments, comment]);
          // Clear the comment input field
          setComment('');
        } else {
          console.error('Failed to add comment');
        }
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar bg="primary" variant="dark" fixed="top-left" className="mb-2" style={{ height: '50px' }}>
        <Container>
            <Navbar.Brand href="/dashboard">Go Back to Dashboard</Navbar.Brand>
        </Container>
    </Navbar>


      <Container>
        <h1 className="mt-4 mb-4">{content.title}</h1>
        <Card>
          <Card.Body>
            <Card.Text>{content.description}</Card.Text>
            <p>Author: {content.author}</p>
            <img src={content.image} alt={content.title} className="img-fluid mb-4" />
          </Card.Body>
        </Card>

        {/* Comment section */}
        <div className="mt-4">
          <h2>Comments</h2>
          <ul className="list-unstyled">
            {comments.map((comment, index) => (
              <li key={index} className="mb-2">{comment.comment_text}</li>
            ))}
          </ul>
          {/* Comment form */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="form-group">
              <label htmlFor="commentInput">Add a Comment:</label>
              <input
                type="text"
                id="commentInput"
                className="form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default BlogDetail;
