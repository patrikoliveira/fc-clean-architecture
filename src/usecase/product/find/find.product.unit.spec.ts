import Product from "../../../domain/product/entity/product";
import { FindProductUseCase } from "./find.product.usecase";

const product = new Product("123", "Product 1", 10);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
};

describe("Unit test create product use case", () => {
  it("should be able find a product", async () => {
    const repository = MockRepository();
    const useCase = new FindProductUseCase(repository);
    const input = {
      id: "123",
    };

    const output = {
      id: "123",
      name: "Product 1",
      price: 10,
    };

    const result = await useCase.execute(input);

    expect(result).toStrictEqual(output);
    expect(repository.find).toHaveBeenCalledWith(input.id);
  });

  it("should not find a product", async () => {
    const repository = MockRepository();
    const err = new Error("Product not found");
    repository.find.mockRejectedValue(err);
    
    const useCase = new FindProductUseCase(repository);
    const input = {
      id: "123",
    };

    await expect(
      useCase.execute(input)
    ).rejects.toThrowError(err);

    expect(repository.find).toHaveBeenCalledWith(input.id);
  });
});