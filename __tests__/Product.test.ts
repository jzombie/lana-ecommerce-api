require("mysql2/node_modules/iconv-lite").encodingExists("foo"); // https://stackoverflow.com/questions/46227783/encoding-not-recognized-in-jest-js
import Product, { UnknownProductError } from "../src/classes/Product";
import { initSequelize } from "../src/sequelize";

describe("Fetch base products", async () => {
  it ("Errors on unknown product", async () => {
    await initSequelize(true);
  
    const product = new Product("120P91__NOT_EXIST");
  
    return expect(product.fetchDetail()).rejects.toThrow(UnknownProductError);
  });

  it ("Fetches Google Home", async () => {
    await initSequelize(true);
  
    const product = new Product("120P90");
  
    return expect(product.fetchDetail()).resolves.toEqual({
      sku: "120P90",
      name: "Google Home",
      price: 49.99,
      inventory_qty: 10
    });
  });
});