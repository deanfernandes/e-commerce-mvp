import { Request, Response } from "express";
import { createOrder } from "../controllers/orders-controller";
import { createOrder as databaseCreateOrder } from "../services/database-service";
import OrderProduct from "../models/OrderProduct";

jest.mock("../services/database-service", () => ({
  createOrder: jest.fn(),
}));
jest.mock("../services/logger-service");

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
    const mockCreateOrder = databaseCreateOrder as jest.MockedFunction<
      typeof databaseCreateOrder
    >;
    mockCreateOrder.mockResolvedValue(mockUserId);

    await createOrder(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockUserId);
    expect(mockCreateOrder).toHaveBeenCalledTimes(1);
    expect(mockCreateOrder).toHaveBeenCalledWith(mockUserId, mockOrderProducts);
  });
});
