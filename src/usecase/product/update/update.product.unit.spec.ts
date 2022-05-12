import Product from "../../../domain/product/entity/product";
import { UpdateProductUseCase } from "./update.product.usecase";

const product = new Product("123", "Product 1", 10);

const input = {
  id: product.id,
  name: "Product 1 Updated",
  price: 20,
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe("Unit Test for update product use case", () => {
  it("should be able update a product", async () => {
    const repository = MockRepository();
    const usecase = new UpdateProductUseCase(repository);

    const output = await usecase.execute(input);

    expect(output).toEqual(input);
  });
});