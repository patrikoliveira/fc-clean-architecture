import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should be able create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10,
      });
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(10);
  });

  it("should not be able create a product", async () => {
    const response = await request(app)
      .post('/product')
      .send({
        price: 10,
      });
    
    expect(response.status).toBe(500);
  });

  it("should be able list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10,
      });
    expect(response.status).toBe(200);

    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Product 2",
        price: 20,
      });
    expect(response2.status).toBe(200);

    const listProductsResponse = await request(app).get('/product').send();

    expect(listProductsResponse.status).toBe(200);
    expect(listProductsResponse.body.products.length).toBe(2);
    const product = listProductsResponse.body.products[0];
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(10);

    const product2 = listProductsResponse.body.products[1];
    expect(product2.name).toBe("Product 2");
    expect(product2.price).toBe(20);
  });
});