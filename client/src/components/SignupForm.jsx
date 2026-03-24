import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client/react';

import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = ({ handleModalClose }) => {
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { loading }] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({
      ...userFormData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      const token = data?.addUser?.token;

      if (!token) {
        throw new Error('No token returned');
      }

      setUserFormData({
        username: '',
        email: '',
        password: '',
      });

      setShowAlert(false);
      setValidated(false);

      if (handleModalClose) {
        handleModalClose();
      }

      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      <Alert
        dismissible
        onClose={() => setShowAlert(false)}
        show={showAlert}
        variant="danger"
      >
        Something went wrong with your signup.
      </Alert>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Your username"
          name="username"
          value={userFormData.username}
          onChange={handleInputChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Username is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Your email address"
          name="email"
          value={userFormData.email}
          onChange={handleInputChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Email is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Your password"
          name="password"
          value={userFormData.password}
          onChange={handleInputChange}
          required
          minLength={6}
        />
        <Form.Control.Feedback type="invalid">
          Password must be at least 6 characters.
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        disabled={
          loading ||
          !(userFormData.username && userFormData.email && userFormData.password)
        }
        type="submit"
        variant="success"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </Form>
  );
};

export default SignupForm;