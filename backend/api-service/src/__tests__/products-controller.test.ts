jest.mock("../services/database-service", () => ({
  createProduct: jest.fn(),
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

jest.mock("../services/logger-service");

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/products-controller";
import type { Request, Response } from "express";
import * as databaseService from "../services/database-service";
import Product from "../models/product";

describe("products controller", () => {
  test("createProduct", async () => {
    const mockProduct: Partial<Product> = {
      title: "Hat",
      description: "Baseball cap",
      price: 14.0,
    };
    const mockReq = {
      body: mockProduct,
    } as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;
    const mockCreateProduct =
      databaseService.createProduct as jest.MockedFunction<
        typeof databaseService.createProduct
      >;
    mockCreateProduct.mockResolvedValue(mockProduct as Product);

    await createProduct(mockReq, mockRes);

    expect(mockCreateProduct).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test("getProducts", async () => {
    const mockProducts: Product[] = [];
    const mockGetProducts = databaseService.getProducts as jest.MockedFunction<
      typeof databaseService.getProducts
    >;
    mockGetProducts.mockResolvedValue(mockProducts);

    const mockReq = { query: {} } as Request;
    const mockRes = {
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;

    await getProducts(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
  });

  test("getProductById", async () => {
    const mockReq = {
      params: {
        id: "1",
      },
    } as Partial<Request> as Request;
    const mockRes = {
      json: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;
    const mockProduct: Product = {
      id: 1,
      title: "Hat",
      description: "Baseball cap",
      price: 14.0,
    };
    const mockGetProductById =
      databaseService.getProductById as jest.MockedFunction<
        typeof databaseService.getProductById
      >;
    mockGetProductById.mockResolvedValue(mockProduct);

    await getProductById(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
  });

  test("updateProduct", async () => {
    const mockId: number = 1;
    const mockNewProduct: Partial<Product> = {
      id: mockId,
      title: "Hat",
      description: "Baseball cap",
      price: 14.0,
    };
    const mockReq = {
      params: {
        id: mockId.toString(),
      },
      body: mockNewProduct,
    } as Partial<Request> as Request;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;
    const mockProduct: Product = {
      id: mockId,
      title: "Hat",
      description: "Baseball cap",
      price: 16.0,
    };

    const mockGetProductById =
      databaseService.getProductById as jest.MockedFunction<
        typeof databaseService.getProductById
      >;
    mockGetProductById.mockResolvedValue(mockProduct);

    const mockUpdateProduct =
      databaseService.updateProduct as jest.MockedFunction<
        typeof databaseService.updateProduct
      >;

    await updateProduct(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockGetProductById).toHaveBeenCalled();
    expect(mockUpdateProduct).toHaveBeenCalled();
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
    const mockGetProductById =
      databaseService.getProductById as jest.MockedFunction<
        typeof databaseService.getProductById
      >;
    const mockProduct: Product = {
      id: 1,
      title: "Hat",
      description: "Baseball cap",
      price: 14.0,
    };
    mockGetProductById.mockResolvedValue(mockProduct);
    const mockDeleteProduct =
      databaseService.deleteProduct as jest.MockedFunction<
        typeof databaseService.deleteProduct
      >;

    await deleteProduct(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockGetProductById).toHaveBeenCalled();
    expect(mockDeleteProduct).toHaveBeenCalled();
  });
});
