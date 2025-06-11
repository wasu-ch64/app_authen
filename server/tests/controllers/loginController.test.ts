import { Request, Response } from "express";
import { login } from "../../src/controllers/authController";
import { prisma } from "../../src/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../src/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock('../../src/config/env', () => ({
  env: {
    JWT_SECRET: "test-secret",
    NODE_ENV: 'test',
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockReq = {} as unknown as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  cookie: jest.fn(),
} as unknown as Response;

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if identifier or password is missing', async () => {
    mockReq.body = {
      identifier: '',
      password: ''
    };

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Please provide username or email and password',
    });
  });

  test('should return 401 if user not found', async () => {
    mockReq.body = {
      identifier: 'unknow@example.com',
      password: 'password123',
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid username/email or password",
    });
  });

  test('should return 401 if password is incorrect', async () => {
    mockReq.body = {
      identifier: 'jane@example.com',
      password: 'wrongpass',
    };

    (prisma.user.findUnique as jest.Mock).mockReturnValue({
      id: 1,
      username: 'jane',
      email: 'jane@example.com',
      password: 'hashed',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'user',
    });

    (bcrypt.compare as jest.Mock).mockReturnValue(false);

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid username/email or password',
    });
  });

  test('should return 200 and set cookie if login is successful', async () => {
    const fakeUser = {
      id: 1,
      username: 'jane',
      email: 'jane@example.com',
      password: 'hashed',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'user',
    };

    mockReq.body = {
      identifier: 'jane@example.com',
      password: 'hashed',
    };
    
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('fake.jwt.token');

    process.env.JWT_SECRET = 'test-secret';

    await login(mockReq, mockRes);

    expect(mockRes.cookie).toHaveBeenCalledWith('auth_token', 'fake.jwt.token', expect.any(Object));
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: {
        userId: fakeUser.id,
        userUsername: fakeUser.username,
        userEmail: fakeUser.email,
        role: fakeUser.role,
      },
    });
  });

  test('should return 500 if JWT_SECRET is not defined', async () => {
    jest.resetModules();

    // Mock env WITHOUT JWT_SECRET
    jest.doMock('../../src/config/env', () => ({
      env: {
        JWT_SECRET: undefined,
        NODE_ENV: 'test',
      },
    }));

    // Mock prisma
    jest.doMock('../../src/prisma', () => ({
      prisma: {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 1,
            username: 'jane',
            email: 'jane@example.com',
            password: 'hashed',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'user',
          }),
        },
      },
    }));

    // Mock bcrypt
    jest.doMock('bcrypt', () => ({
      compare: jest.fn().mockResolvedValue(true),
    }));

    // Mock JWT
    jest.doMock('jsonwebtoken', () => ({
      sign: jest.fn(),
    }));

    // Import login AFTER mocks
    const { login } = await import('../../src/controllers/authController');

    const mockReq = {
      body: {
        identifier: 'jane@example.com',
        password: 'password123',
      },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;

    await login(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Server configuration error',
    });
  });
});