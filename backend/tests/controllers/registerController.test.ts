import { Request, Response } from "express";
import { register } from "../../src/controllers/authController";
import { prisma } from "../../src/prisma";
import bcrypt from "bcrypt";

jest.mock("../../src/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

const mockReq = { body: {} } as unknown as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should register successfully", async () => {
    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "secret123",
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    (prisma.user.findFirst as jest.Mock).mockReturnValue(null);
    (prisma.user.create as jest.Mock).mockReturnValue({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      username: "john",
      email: "john@example.com",
      role: "user",
    });

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  test("should return 400 if missing fields", async () => {
    mockReq.body = { email: "john@example.com" };

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for invalid email format", async () => {
    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "invalid",
      password: "secret123",
    };

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 if user already exists", async () => {
    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "secret123",
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  test("should return 500 on server error", async () => {
    mockReq.body = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "secret123",
    };

    (prisma.user.findFirst as jest.Mock).mockRejectedValue(new Error("DB error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    consoleSpy.mockRestore();
  });
});
