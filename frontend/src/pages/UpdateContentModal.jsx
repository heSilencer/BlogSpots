import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function UpdateContentModal({ content, handleUpdate }) {
  const [updatedValues, setUpdatedValues] = useState({
    title: content.title,
    description: content.description,
    author: content.author,
    image: content.image,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    handleUpdate(updatedValues);
  };
  

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mt-0">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={updatedValues.title}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={updatedValues.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label>Product Photo</Form.Label>
        <Form.Control
          type="text"
          name="image"
          value={updatedValues.image}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mt-2">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          name="author"
          value={updatedValues.author}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        Update Content
      </Button>
    </Form>
  );
}

export default UpdateContentModal;