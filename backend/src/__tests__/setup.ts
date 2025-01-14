import { afterAll, beforeAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Connect to a test database before running tests
beforeAll(async () => {
  const testMongoURI = process.env.MONGODB_URI + '_test';
  await mongoose.connect(testMongoURI);
});

// Clean up the test database after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Clear all collections before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});