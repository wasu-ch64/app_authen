import { Request, Response } from "express";
import { allUser } from "../../src/controllers/getUserController";
import { prisma } from "../../src/prisma";

// Mock Prisma
jest.mock("../../src/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

// Create mock Express Request and Response
const mockReq = {} as Request;
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

describe("allUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return 200 and users", async () => {
    const fakeUser = [
      {
        id: 1,
        firstName: "Jhon",
        lastName: "Doe",
        email: "jhon@example.com",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValue(fakeUser);

    await allUser(mockReq, mockRes);

    // Verify Prisma call
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    // Verify response
    expect(mockRes.status).toHaveBeenCalledWith(200); // Fixed: Changed sendDate to status
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Get user is success",
      users: fakeUser,
    });
  });

  test("should return 500 when an error occurs", async () => {
    const error = new Error("DB error");
    (prisma.user.findMany as jest.Mock).mockRejectedValue(error);

    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await allUser(mockReq, mockRes);

    // Verify Prisma call
    expect(prisma.user.findMany).toHaveBeenCalled();

    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalledWith("Get user error: ", error);

    // Verify response
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ // Fixed: Check json, not status
      message: "Internal server error",
    });

    // Clean up
    consoleErrorSpy.mockRestore();
  });
});