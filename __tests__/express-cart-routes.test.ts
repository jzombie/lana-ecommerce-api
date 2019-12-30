import request from "supertest";
import initExpressApp from "../src/initExpressApp";

jest.setTimeout(20000);

describe("Test Express app cart routes", () => {
  it ("Adds a MacBook Pro", async (done) => {
    const app = await initExpressApp();

    request(app)
      .post("/cart/43N23P")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        const result = JSON.parse(res.text);
        expect(result.subTotal).toEqual(5399.99);

        done();
      });
  });

  it ("Empties the cart after adding a MacbookPro", async (done) => {
    const app = await initExpressApp();

    request(app)
      .delete("/cart/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        const result = JSON.parse(res.text);
        expect(result.subTotal).toEqual(0);

        done();
      });
  });

  it ("Adds 3 Google Homes for the price of 2", async (done) => {
    const app = await initExpressApp();

    request(app)
      .post("/cart/120P90/3")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        const result = JSON.parse(res.text);
        expect(result.subTotal).toEqual(99.98);

        done();
      });
  });

  it ("Empties the cart after adding 3 Google Homes", async (done) => {
    const app = await initExpressApp();

    request(app)
      .delete("/cart/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        const result = JSON.parse(res.text);
        expect(result.subTotal).toEqual(0);

        done();
      });
  });

  it ("Adds 3 Alexa Speakers for a 10% discount", async (done) => {
    const app = await initExpressApp();

    request(app)
      .post("/cart/A304SD/3")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          throw err;
        }

        const result = JSON.parse(res.text);
        expect(result.subTotal).toEqual(295.65);

        done();
      });
  });
});