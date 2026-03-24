import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client/react';

import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = ({ handleModalClose }) => {
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [loginUser, { loading }] = useMutation(LOGIN_USER);

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
      const { data } = await loginUser({
        variables: { ...userFormData },
      });

      const token = data?.login?.token;

      if (!token) {
        throw new Error('No token returned');
      }

      setUserFormData({
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
        Something went wrong with your login credentials.
      </Alert>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Your email"
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
        />
        <Form.Control.Feedback type="invalid">
          Password is required.
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        disabled={loading || !(userFormData.email && userFormData.password)}
        type="submit"
        variant="success"
      >
        {loading ? 'Logging in...' : 'Submit'}
      </Button>
    </Form>
  );
};

export default LoginForm;