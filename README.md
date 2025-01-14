# MERN Authentication System

## Introduction

This project implements a comprehensive user management system that demonstrates clean code, basic security practices, and frontend-backend integration. The system provides user registration, login, and profile management functionalities using the MERN stack (MongoDB, Express.js, React, Node.js) with TypeScript.

## Objective

To build a secure and functional user management system with:

- User registration with password hashing
- Secure login with JWT authentication
- Profile management for authenticated users
- Clean, well-structured codebase
- Frontend-backend integration

## Technologies Used

- Node.js & Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- React.js for frontend
- Docker for MongoDB container

## Prerequisites

- Node.js (v21.5.0 or higher)
- Docker (for MongoDB container)
- npm or yarn package manager
- Git

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone git@github.com:RichardKaranuMbuti/mern-auth.git
   ```

2. Set up MongoDB using Docker:

   ```bash
   # Pull MongoDB 4.4 image
   docker pull mongo:4.4

   # Run MongoDB container
   docker run -d --name mongodb -p 27017:27017 mongo:4.4

   # Verify MongoDB is running
   docker exec -it mongodb mongo
   ```

3. Backend Setup:

   ```bash
   # Navigate to backend directory
   cd mern-auth/backend

   # Install dependencies
   npm install

   # Create .env file with the following content:
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern_auth
   JWT_SECRET=your_generated_secret_here
   JWT_EXPIRE=24h

   # Generate JWT secret using Node.js:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Start development server
   npm run dev
   ```

4. Frontend Setup:

   ```bash
   # Open a new terminal
   cd mern-auth/frontend

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

5. Visit the application in your browser at the URL provided by the frontend development server.

## API Endpoints

### Authentication Routes

| Method | Endpoint            | Description         | Access  |
| ------ | ------------------- | ------------------- | ------- |
| POST   | /api/users/register | Register a new user | Public  |
| POST   | /api/users/login    | Login user          | Public  |
| GET    | /api/users/profile  | Get user profile    | Private |
| PUT    | /api/users/profile  | Update user profile | Private |

For protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Running Tests

To run the tests:

```bash
# Run tests once
npm test

# Run tests in watch mode (automatically rerun when files change)
npm run test:watch
```

### Test Coverage

The test suite covers:

1. User Registration
   - Successful registration
   - Duplicate email handling
2. User Login
   - Successful login
   - Incorrect password handling

### Testing Stack

- Jest as the test runner
- SuperTest for HTTP testing
- Separate test database to avoid affecting development database
- Database cleanup between tests

### Test Setup Features

1. Uses a separate test database (appends '\_test' to your MongoDB URI)
2. Cleans up the database between tests
3. Properly closes database connections after tests
4. Includes proper type definitions
5. Uses async/await for clean asynchronous testing

## MongoDB Docker Commands

### Accessing MongoDB Shell

```bash
# Connect to MongoDB container's shell
docker exec -it mongodb mongo
```

### Basic MongoDB Commands

```javascript
// Show all databases
show dbs

// Switch to your application database
use mern_auth

// Show all collections
show collections

// View all users (with hashed passwords)
db.users.find()

// View all users with formatted output
db.users.find().pretty()

// Find specific user by email
db.users.find({ email: "test@example.com" })

// Delete specific user
db.users.deleteOne({ email: "test@example.com" })

// Delete all users
db.users.deleteMany({})

// Drop entire collection
db.users.drop()

// Drop entire database
db.dropDatabase()

// Get count of users
db.users.count()

// Exit MongoDB shell
exit
```

### Checking Password Hashing

```javascript
// View user document to confirm password hashing
db.users.findOne();
// Should show something like:
// password: "$2b$10$XYZ123...ABC" (hashed string)
```

### Database Maintenance

```javascript
// Get database statistics
db.stats();

// Get collection statistics
db.users.stats();

// Repair database (if needed)
db.repairDatabase();

// Compact collection (reclaim space)
db.runCommand({ compact: "users" });
```

[Rest of the content remains the same...]

### Request/Response Examples

#### Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Login User

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Get Profile

```http
GET /api/users/profile
Authorization: Bearer your_jwt_token
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Update Profile

```http
PUT /api/users/profile
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "newusername",
    "email": "newemail@example.com"
  }
}
```

## Testing API Endpoints

You can test the endpoints using tools like:

- Postman
- cURL
- Thunder Client (VS Code extension)

Remember to include proper headers:

- Content-Type: application/json
- Authorization: Bearer your_jwt_token (for protected routes)

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error

Example error response:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Development Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the TypeScript project
- `npm start`: Start the production server

## Security Features

### Password Hashing

- Passwords are hashed using bcrypt before storage
- Salt rounds: 10

### JWT Authentication

- Tokens expire after 24 hours
- Protected routes require valid JWT token

### Input Validation

- Email format validation
- Required field validation
- Password minimum length: 6 characters

## Assumptions and Simplifications

- Email verification is not implemented
- Password reset functionality is not included
- Rate limiting is not implemented
- Session management is handled solely through JWTs
- MongoDB is assumed to be running locally or in a Docker container

## GitHub Repository

The complete source code is available at: https://github.com/RichardKaranuMbuti/mern-auth

## Contributing

Please feel free to submit issues and pull requests.
