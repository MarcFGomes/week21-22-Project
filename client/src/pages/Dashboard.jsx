import { Container, Col, Form, Button, Card, Row, Badge, Alert } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';

import Auth from '../utils/auth';
import { GET_ME } from '../utils/queries';
import { ADD_APPLICATION, REMOVE_APPLICATION } from '../utils/mutations';
import { useState } from 'react';

const Dashboard = () => {
  const loggedIn = Auth.loggedIn();

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    appliedDate: '',
    notes: '',
    link: '',
  });

  const { loading, error, data } = useQuery(GET_ME, {
    skip: !loggedIn,
  });

  const [addApplication, { loading: addLoading }] = useMutation(ADD_APPLICATION, {
    refetchQueries: [GET_ME],
  });

  const [removeApplication] = useMutation(REMOVE_APPLICATION, {
    refetchQueries: [GET_ME],
  });

  const applications = data?.me?.applications || [];
  const username = data?.me?.username || '';

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!formData.company.trim() || !formData.role.trim()) return;

    try {
      await addApplication({
        variables: {
          company: formData.company,
          role: formData.role,
          status: formData.status,
          appliedDate: formData.appliedDate || null,
          notes: formData.notes,
          link: formData.link,
        },
      });

      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        appliedDate: '',
        notes: '',
        link: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await removeApplication({
        variables: { applicationId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!loggedIn) {
    return (
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Track your job applications</h1>
          <p className="mb-0">
            Log in or sign up to manage applications, statuses, notes, and links in one place.
          </p>
        </Container>
      </div>
    );
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>{username ? `${username}'s Dashboard` : 'Dashboard'}</h1>
          <p className="mb-0">Add and manage your job applications from one place.</p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={8}>
            <h2 className="mb-4">Add Application</h2>

            <Form onSubmit={handleFormSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </Col>

                <Col md={6}>
                  <Form.Control
                    type="text"
                    name="role"
                    placeholder="Role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </Col>

                <Col md={4}>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Col>

                <Col md={4}>
                  <Form.Control
                    type="date"
                    name="appliedDate"
                    value={formData.appliedDate}
                    onChange={handleInputChange}
                  />
                </Col>

                <Col md={4}>
                  <Form.Control
                    type="url"
                    name="link"
                    placeholder="Job link"
                    value={formData.link}
                    onChange={handleInputChange}
                  />
                </Col>

                <Col xs={12}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </Col>

                <Col xs={12}>
                  <Button
                    type="submit"
                    variant="success"
                    disabled={addLoading || !formData.company || !formData.role}
                  >
                    {addLoading ? 'Saving...' : 'Add Application'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <h2>
              Your Applications <Badge bg="secondary">{applications.length}</Badge>
            </h2>
          </Col>
        </Row>

        {loading && <p>Loading applications...</p>}

        {error && <Alert variant="danger">Failed to load your applications.</Alert>}

        {!loading && !applications.length && (
          <Alert variant="light">No applications yet. Add your first one above.</Alert>
        )}

        <Row>
          {applications.map((app) => (
            <Col md={6} lg={4} key={app._id} className="mb-4">
              <Card border="dark" className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex justify-content-between align-items-start gap-2">
                    <span>{app.company}</span>
                    <Badge bg="dark">{app.status || 'Applied'}</Badge>
                  </Card.Title>

                  <Card.Subtitle className="mb-2 text-muted">{app.role}</Card.Subtitle>

                  {app.appliedDate && (
                    <Card.Text className="small text-muted mb-2">
                      Applied: {new Date(app.appliedDate).toLocaleDateString()}
                    </Card.Text>
                  )}

                  {app.notes && <Card.Text>{app.notes}</Card.Text>}

                  <div className="mt-auto d-flex flex-column gap-2">
                    {app.link && (
                      <Button
                        variant="outline-dark"
                        href={app.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Job Post
                      </Button>
                    )}

                    <Button
                      as={Link}
                      to={`/applications/${app._id}`}
                      variant="outline-secondary"
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outline-danger"
                      onClick={() => handleDeleteApplication(app._id)}
                    >
                      Delete
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
};

export default Dashboard;