import { Request, Response } from "express";
import { createOrder } from "../controllers/orders-controller";
import {
  createOrder as databaseCreateOrder,
  getUserById,
  getOrderProducts,
} from "../services/database-service";
import OrderProduct from "../models/OrderProduct";
import User from "../models/user";

jest.mock("../services/database-service", () => ({
  createOrder: jest.fn(),
  getUserById: jest.fn(),
  getOrderProducts: jest.fn(),
}));
jest.mock("../services/logger-service");
jest.mock("../services/kafka-producer-service", () => ({
  producer: { send: jest.fn() },
}));

describe("orders controller", () => {
  test("createOrder", async () => {
    const mockUserId: number = 1;
    const mockOrderProducts: OrderProduct[] = [];
    const mockReq = {
      body: {
        userId: mockUserId,
        orderProducts: mockOrderProducts,
      },
    } as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;

    const mockOrderId = 2;
    const mockCreateOrder = databaseCreateOrder as jest.MockedFunction<
      typeof databaseCreateOrder
    >;
    mockCreateOrder.mockResolvedValue(mockOrderId);

    const mockUser: User = {
      id: mockUserId,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      email_verified: false,
    };
    const mockGetUserById = getUserById as jest.MockedFunction<
      typeof getUserById
    >;
    mockGetUserById.mockResolvedValue(mockUser);

    const mockDbOrderProducts: any[] = [];
    const mockGetOrderProducts = getOrderProducts as jest.MockedFunction<
      typeof getOrderProducts
    >;
    mockGetOrderProducts.mockResolvedValue(mockDbOrderProducts);

    await createOrder(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockOrderId);
    expect(mockCreateOrder).toHaveBeenCalledTimes(1);
    expect(mockCreateOrder).toHaveBeenCalledWith(mockUserId, mockOrderProducts);
    expect(mockGetUserById).toHaveBeenCalledWith(mockUserId);
    expect(mockGetOrderProducts).toHaveBeenCalledWith(mockOrderId);
  });
});
