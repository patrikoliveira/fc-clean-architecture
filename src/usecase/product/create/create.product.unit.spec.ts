import * as uuid from "uuid";
import Product from "../../../domain/product/entity/product";
import { CreateProductUseCase } from "./create.product.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
};

jest.mock('uuid');

describe("Unit test create product use case", () => {
  it("should be able create a product", async () => {
    jest.spyOn(uuid, 'v4').mockReturnValue('72b18e24-485a-47c9-bfe3-e8827d8b4d61');
    const input = {
      name: "Product 1",
      price: 10,
    }

    const repository = MockRepository();
    const productCreateUseCase = new CreateProductUseCase(repository);
    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
    const product = new Product('72b18e24-485a-47c9-bfe3-e8827d8b4d61', input.name, input.price);
    expect(repository.create).toHaveBeenCalledWith(product);
  });

  it("should throw an error when id is missing", async () => {
    jest.spyOn(uuid, 'v4').mockReturnValue('');
    const input = {
      name: "Product 1",
      price: 10,
    }
    const repository = MockRepository();
    const error = new Error("Id is required");
    const productCreateUseCase = new CreateProductUseCase(repository);

    await expect(
      productCreateUseCase.execute(input)
    ).rejects.toThrowError(error);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should throw an error when name is missing", async () => {
    jest.spyOn(uuid, 'v4').mockReturnValue('72b18e24-485a-47c9-bfe3-e8827d8b4d61');
    const input = {
      name: "",
      price: 10,
    }
    const repository = MockRepository();
    const error = new Error("Name is required");
    const productCreateUseCase = new CreateProductUseCase(repository);

    await expect(
      productCreateUseCase.execute(input)
    ).rejects.toThrowError(error);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should throw an error when price is missing", async () => {
    jest.spyOn(uuid, 'v4').mockReturnValue('72b18e24-485a-47c9-bfe3-e8827d8b4d61');
    
    const input = {
      name: "Product 1",
      price: -1,
    };

    const repository = MockRepository();
    const error = new Error("Price must be greater than zero");
    const productCreateUseCase = new CreateProductUseCase(repository);

    await expect(
      productCreateUseCase.execute(input)
    ).rejects.toThrowError(error);

    expect(repository.create).not.toHaveBeenCalled();
  });
});