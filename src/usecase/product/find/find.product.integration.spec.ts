import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { FindProductUseCase } from "./find.product.usecase";

describe("Test find product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const repository = new ProductRepository();
    const useCase = new FindProductUseCase(repository);
    const product = new Product("123", "Product 1", 10);

    await repository.create(product);

    const input = {
      id: "123",
    }

    const output = {
      id: "123",
      name: "Product 1",
      price: 10,
    }

    const result = await useCase.execute(input);

    expect(result).toStrictEqual(output);
  });

  it("should not find a product", async () => {
    const repository = new ProductRepository();
    const useCase = new FindProductUseCase(repository);
    const product = new Product("123", "Product 1", 10);

    await repository.create(product);

    const input = {
      id: "456",
    }
    await expect(useCase.execute(input)).rejects.toThrowError("Product not found");
  });
});