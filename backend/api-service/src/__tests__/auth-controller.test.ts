jest.mock("../services/password-service", () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));
jest.mock("../services/database-service", () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
}));
jest.mock("../services/logger-service");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

import { Request, Response } from "express";
import { login, register } from "../controllers/auth-controller";
import User from "../models/user";
import { hashPassword, verifyPassword } from "../services/password-service";
import { createUser, getUserByEmail } from "../services/database-service";
import { sign } from "jsonwebtoken";

describe("auth controller", () => {
  test("register", async () => {
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };
    const mockReq = {
      body: mockUser,
    } as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test("login", async () => {
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };
    const mockReq = {
      body: {
        email: mockUser.email,
        password: mockUser.password,
      },
    } as Request;
    const mockRes = {
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;
    const mockGetUserByEmail = getUserByEmail as jest.MockedFunction<
      typeof getUserByEmail
    >;
    mockGetUserByEmail.mockResolvedValue(mockUser);
    const mockVerifyPassword = verifyPassword as jest.MockedFunction<
      typeof verifyPassword
    >;
    mockVerifyPassword.mockResolvedValue(true);
    const mockSign = sign as jest.MockedFunction<typeof sign>;
    mockSign.mockImplementation(() => "mockToken");

    await login(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalled();
  });
});
