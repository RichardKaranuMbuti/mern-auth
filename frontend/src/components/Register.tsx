import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
    notSimilarToEmail: true
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string, email: string) => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const notSimilarToEmail = !email || !new RegExp(email.slice(0, 4), 'i').test(password);

    setPasswordValidation({
      length,
      uppercase,
      lowercase,
      number,
      specialChar,
      notSimilarToEmail
    });
  };

  const handlePasswordChange = (password: string, confirmPassword: string) => {
    setFormData({ ...formData, password });
    validatePassword(password, formData.email);
    setPasswordsMatch(password === confirmPassword);
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setFormData({ ...formData, confirmPassword });
    setPasswordsMatch(formData.password === confirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!Object.values(passwordValidation).every(Boolean)) {
      toast.error('Password does not meet all requirements');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading ||
    !formData.username ||
    !formData.email ||
    !Object.values(passwordValidation).every(Boolean) ||
    !passwordsMatch;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card style={{ paddingBottom: '20px' }}>
            <Card.Body>
              <Card.Title className="text-center">Register</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value, formData.confirmPassword)}
                    required
                  />
                  <div className="mt-2">
                    <ul>
                      <li style={{ color: passwordValidation.length ? 'green' : 'red' }}>
                        At least 8 characters
                      </li>
                      <li style={{ color: passwordValidation.uppercase ? 'green' : 'red' }}>
                        Contains an uppercase letter
                      </li>
                      <li style={{ color: passwordValidation.lowercase ? 'green' : 'red' }}>
                        Contains a lowercase letter
                      </li>
                      <li style={{ color: passwordValidation.number ? 'green' : 'red' }}>
                        Contains a number
                      </li>
                      <li style={{ color: passwordValidation.specialChar ? 'green' : 'red' }}>
                        Contains a special character (!@#$%^&*)
                      </li>
                      <li style={{ color: passwordValidation.notSimilarToEmail ? 'green' : 'red' }}>
                        Not too similar to email
                      </li>
                    </ul>
                  </div>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mt-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    required
                  />
                  <div className="mt-2" style={{ color: passwordsMatch ? 'green' : 'red' }}>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                </Form.Group>

                <Button type="submit" className="mt-4" disabled={isSubmitDisabled}>
                  {loading ? 'Loading...' : 'Register'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
