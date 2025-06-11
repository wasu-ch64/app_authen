import { allUser } from "../../src/controllers/getUserController";
import { prisma } from "../../src/prisma";
import { Request, Response } from "express";

// ✅ สร้าง mock ของ Express Request (ในเคสนี้ไม่ได้ใช้ req เลยส่ง {} ไปพอ)
const mockReq = {} as Request;

// ✅ สร้าง mock ของ Express Response
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

// ✅ mock Prisma
jest.mock("../../src/prisma.ts", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
    },
  },
}));

describe("allUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ส่ง 200 และ users", async () => {
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

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Get user is success",
      users: fakeUser,
    });
  });

  test("ส่ง 500 เมื่อเกิด error", async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));

    await allUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
