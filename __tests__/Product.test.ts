require("mysql2/node_modules/iconv-lite").encodingExists("foo"); // https://stackoverflow.com/questions/46227783/encoding-not-recognized-in-jest-js
import Product, { UnknownProductError } from "../src/classes/Product";
import { initSequelize } from "../src/sequelize";

jest.setTimeout(20000);

describe("Fetch base products", () => {
  it ("Errors on unknown product", async () => {
    await initSequelize(true);
  
    const product = new Product("120P91__NOT_EXIST");
  
    return expect(product.fetchDetail()).rejects.toThrow(UnknownProductError);
  });

  it ("Fetches Google Home with preset inventory qty", async () => {
    await initSequelize(true);
  
    const product = new Product("120P90");
  
    return expect(product.fetchDetail()).resolves.toEqual({
      sku: "120P90",
      name: "Google Home",
      price: 49.99,
      inventoryQty: 10
    });
  });

  it ("Fetches MacBook Pro with preset inventory qty", async () => {
    await initSequelize(true);
  
    const product = new Product("43N23P");
  
    return expect(product.fetchDetail()).resolves.toEqual({
      sku: "43N23P",
      name: "MacBook Pro",
      price: 5399.99,
      inventoryQty: 5
    });
  });

  it ("Fetches Alexa Speaker with preset inventory qty", async () => {
    await initSequelize(true);
  
    const product = new Product("A304SD");
  
    return expect(product.fetchDetail()).resolves.toEqual({
      sku: "A304SD",
      name: "Alexa Speaker",
      price: 109.50,
      inventoryQty: 10
    });
  });

  it ("Fetches Raspberry Pi B with preset inventory qty", async () => {
    await initSequelize(true);
  
    const product = new Product("234234");
  
    return expect(product.fetchDetail()).resolves.toEqual({
      sku: "234234",
      name: "Raspberry Pi B",
      price: 30.00,
      inventoryQty: 2
    });
  });
});