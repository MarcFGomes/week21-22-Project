import { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';

import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries';
import { UPDATE_APPLICATION } from '../utils/mutations';

const EditApplication = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const loggedIn = Auth.loggedIn();

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    notes: '',
  });

  const [formReady, setFormReady] = useState(false);

  const { loading, error, data } = useQuery(GET_ME, {
    skip: !loggedIn,
  });

  const [updateApplication, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_APPLICATION, {
      refetchQueries: [GET_ME],
    });

  const application = data?.me?.applications?.find((app) => app._id === applicationId);

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company || '',
        role: application.role || '',
        status: application.status || 'Applied',
        notes: application.notes || '',
      });
      setFormReady(true);
    }
  }, [application]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await updateApplication({
        variables: {
          applicationId,
          company: formData.company,
          role: formData.role,
          status: formData.status,
          notes: formData.notes,
        },
      });

      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (!loggedIn) {
    return (
      <Container className="py-5">
        <Alert variant="danger">You must be logged in to edit an application.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5">
        <p>Loading application...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Failed to load application data.</Alert>
      </Container>
    );
  }

  if (!application && data?.me) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Application not found.</Alert>
        <Button as={Link} to="/" variant="dark">
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: '700px' }}>
        <Card.Body>
          <h1 className="mb-4">Edit Application</h1>

          {updateError && (
            <Alert variant="danger">Failed to update the application.</Alert>
          )}

          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                disabled={!formReady}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                disabled={!formReady}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={!formReady}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                disabled={!formReady}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                type="submit"
                variant="success"
                disabled={updateLoading || !formReady}
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button as={Link} to="/" variant="secondary">
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditApplication;