import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";

export class UpdateProductUseCase {
  constructor(private respository: ProductRepositoryInterface) {}

  async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
    const product = await this.respository.find(input.id);

    if (!product) {
      throw new Error("Product not found");
    }

    product.changeName(input.name);
    product.changePrice(input.price);

    await this.respository.update(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    }
  }
}