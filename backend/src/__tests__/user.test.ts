import { beforeEach, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import User from '../models/User';
import app from '../server';

describe('User Authentication Tests', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  };

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('username', testUser.username);
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Verify user was created in database
      const user = await User.findOne({ email: testUser.email });
      expect(user).toBeTruthy();
      expect(user?.username).toBe(testUser.username);
    });

    it('should not register user with existing email', async () => {
      // First create a user
      await request(app)
        .post('/api/users/register')
        .send(testUser);

      // Try to create another user with same email
      const response = await request(app)
        .post('/api/users/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/users/register')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});