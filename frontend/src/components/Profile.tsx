import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../utils/AuthContext';

const Profile: React.FC = () => {
  const { user, setUser } = useAuth();
  
  // Initialize with user data from context if available
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const userData = response.data.user; // Make sure to access the user object correctly
        setFormData({
          username: userData.username,
          email: userData.email
        });
        setUser(userData);
      } catch (error: any) {
        toast.error('Failed to fetch profile');
      }
    };

    // Only fetch if we don't have the data
    if (!user?.username || !user?.email) {
      fetchProfile();
    }
  }, [setUser, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put('/users/profile', formData);
      setUser(response.data.user); // Make sure to access the user object correctly
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h2>Profile</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </Form.Group>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;