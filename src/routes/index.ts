import express from "express";
import Product from "../classes/Product";
import logger from "../logger";
const router = express.Router();

router.get("/product/:sku", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async () => {
    const sku = req.params.sku;
    const product = new Product(sku);

    return product.fetchDetail();
  });
});

router.get("/products", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async () => {
    const products = await Product.fetchAllProducts();

    return Promise.all(
      products.map(async (product) => await product.fetchDetail())
    );
  });
});

/**
 * Unified handling for API routes.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function: Promise<any | Error>} routeHandler The resolved return of which is
 * sent through the res (express.Response) object back to the client.
 */
const handleRoute = async (
  req: express.Request,
  res: express.Response,
  routeHandler: () => Promise<any | Error>): Promise<void> => {
  try {
    logger.info(`HTTP Request | ${req.method} | ${req.url}`);

    const result = await routeHandler();

    if (typeof result === "object") {
      res.json(result);
    } else {
      throw new Error(`Unhandled response type: ${typeof result}`);
    }
  } catch (exc) {
    const errMsg = exc.message || exc.toString();
    const errName = exc.name || null;

    logger.error(errMsg);

    (res as any)
      .status(404)
      .json({
        error: errMsg,
        errorType: errName
      });
  }
};

export default router;
