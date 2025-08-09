jest.mock("../services/password-service", () => ({
  hashPassword: jest.fn(),
}));

jest.mock("../services/database-service", () => ({
  createUser: jest.fn(),
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock("../services/logger-service");

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/users-controller";
import type { Request, Response } from "express";
import { hashPassword } from "../services/password-service";
import {
  createUser as databaseCreateUser,
  getUsers as databaseGetUsers,
  getUserById as databaseGetUserById,
  updateUser as databaseUpdateUser,
  deleteUser as databaseDeleteUser,
} from "../services/database-service";
import User from "../models/user";

describe("users controller", () => {
  test("create user with valid user successful", async () => {
    const mockPassword = "password123";
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: mockPassword,
    };
    const mockReq = {
      body: mockUser,
    } as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;
    const mockHashPassword = hashPassword as jest.MockedFunction<
      typeof hashPassword
    >;
    const mockHashedPassword = "hashedPassword123";
    mockHashPassword.mockResolvedValue(mockHashedPassword);

    await createUser(mockReq, mockRes);

    expect(hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(mockUser.password).toEqual(mockHashedPassword);
    expect(databaseCreateUser).toHaveBeenCalledWith(mockUser);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled;
  });

  test("get users successful", async () => {
    const mockUsers: User[] = [];
    const mockGetUsers = databaseGetUsers as jest.MockedFunction<
      typeof databaseGetUsers
    >;
    mockGetUsers.mockResolvedValue(mockUsers);

    const mockReq = {} as Request;
    const mockRes = {
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;

    await getUsers(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
  });

  test("getUserById valid user returns user", async () => {
    const mockReq = {
      params: {
        id: "1",
      },
    } as Partial<Request> as Request;
    const mockRes = {
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };
    const mockGetUserById = databaseGetUserById as jest.MockedFunction<
      typeof databaseGetUserById
    >;
    mockGetUserById.mockResolvedValue(mockUser);

    await getUserById(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockUser);
  });

  test("updateUser is successful", async () => {
    const mockPassword = "password123";
    const mockNewUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: mockPassword,
    };
    const mockReq = {
      params: {
        id: "1",
      },
      body: mockNewUser,
    } as Partial<Request> as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    const mockGetUserById = databaseGetUserById as jest.MockedFunction<
      typeof databaseGetUserById
    >;
    mockGetUserById.mockResolvedValue(mockUser);

    const mockHashPassword = hashPassword as jest.MockedFunction<
      typeof hashPassword
    >;
    const mockHashedPassword = "hashedPassword123";
    mockHashPassword.mockResolvedValue(mockHashedPassword);

    const mockUpdateUser = databaseUpdateUser as jest.MockedFunction<
      typeof databaseUpdateUser
    >;

    await updateUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockGetUserById).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(mockUpdateUser).toHaveBeenCalled();
  });

  test("deleteUser is successful", async () => {
    const mockReq = {
      params: {
        id: "1",
      },
    } as Partial<Request> as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;
    const mockGetUserById = databaseGetUserById as jest.MockedFunction<
      typeof databaseGetUserById
    >;
    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };
    mockGetUserById.mockResolvedValue(mockUser);
    const mockDeleteUser = databaseDeleteUser as jest.MockedFunction<
      typeof databaseDeleteUser
    >;

    await deleteUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockGetUserById).toHaveBeenCalled();
    expect(mockDeleteUser).toHaveBeenCalled();
  });
});
