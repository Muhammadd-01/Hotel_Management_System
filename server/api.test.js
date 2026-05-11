import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/authRoutes';
import User from './models/User';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth API Tests', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'staff'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should not register user with existing email', async () => {
    await User.create({
      name: 'Existing User',
      email: 'test@example.com',
      password: 'password123',
      role: 'staff'
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: 'test@example.com',
        password: 'password123',
        role: 'staff'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
