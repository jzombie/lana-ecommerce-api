import request from "supertest";
import initExpressApp from "../src/initExpressApp";

jest.setTimeout(20000);

describe("Test Express app routes", () => {
  it ("Retrieves a list of products", async (done) => {
    const app = await initExpressApp();

    request(app)
      .get("/products")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        const products = JSON.parse(res.text);
        for (const product of products) {
          expect(Object.keys(product)).toEqual(["sku", "name", "price", "inventory_qty"]);
        }

        done();
      });
  });

  it ("Retrieves a Google Home product", async (done) => {
    const app = await initExpressApp();

    request(app)
      .get("/product/120P90")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(JSON.parse(res.text)).toEqual({
          sku: "120P90",
          name: "Google Home",
          price: 49.99,
          inventory_qty: 10
        });

        done();
      });
  });

  it ("Retrieves a 404 error", async (done) => {
    const app = await initExpressApp();

    request(app)
      .get("/product/120P91__NOT_EXIST")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        expect(JSON.parse(res.text)).toEqual({
          err: `Product with SKU "120P91__NOT_EXIST" does not exist.`
        });

        done();
      })

  });
});