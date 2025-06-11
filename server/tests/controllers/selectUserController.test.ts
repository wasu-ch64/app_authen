import { Request, Response } from "express";
import { prisma } from "../../src/prisma";
import { selectUser } from "../../src/controllers/getUserController";

// Mock Prisma
jest.mock("../../src/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// สร้าง mock สำหรับ Express Request และ Response
const mockReq = {
  params: { id: "1" },
} as unknown as Request;

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

describe("selectUser", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // ล้าง mock ทุกครั้งก่อนเริ่ม test ใหม่
  });

  test("should return 200 and users", async () => {
    // จำลองผู้ใข้
    const fakeUser = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock Prisma ให้คืนค่า fakeUser
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeUser);

    await selectUser(mockReq, mockRes);

    // ตรวจสอบว่า Prisma ถูกเรียกด้วยพารามิเตอร์ที่ถูกต้อง
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // ตรวจสอบ response
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Get user success",
      user: fakeUser,
    });
  });

  test("should return 404 users not found", async () => {
    // Mock Prisma ให้คืนค่า null (ไม่พบผู้ใช้)
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await selectUser(mockReq, mockRes);

    // ตรวจสอบว่า Prisma ถูกเรียกด้วยพารามิเตอร์ที่ถูกต้อง
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // ตรวจสอบ response
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "User not found",
    });
  });

  test("should return 500 Internal server error", async () => {
    // Mock Prisma ให้ throw error
    const error = new Error("Database error");
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

    // Spy บน console.error
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await selectUser(mockReq, mockRes);

    // ตรวจสอบว่า Prisma ถูกเรียก
    expect(prisma.user.findUnique).toHaveBeenCalled();

    // ตรวจสอบว่า console.error ถูกเรียก
    expect(consoleErrorSpy).toHaveBeenCalledWith("Select user error:", error);

    // ตรวจสอบ response
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });

    consoleErrorSpy.mockRestore();
  });
});
