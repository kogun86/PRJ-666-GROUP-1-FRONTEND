import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';

const CourseForm = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Course Name</Form.Label>
        <Form.Control {...register('name')} placeholder="e.g. Web Development" />
      </Form.Group>

      <Button type="submit" className="profile-button">
        Save Course
      </Button>
    </Form>
  );
};

export default CourseForm;
