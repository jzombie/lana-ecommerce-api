import express from "express";
const router = express.Router();
import Product from "../classes/Product";
import logger from "../logger";

router.get("/product/:sku", async (req: Express.Request, res: Express.Response) => {
  handleRoute(req, res, async () => {
    const sku = (req as any).params.sku; // res.params does not exist on Express.Response (?)
    const product = new Product(sku);

    return product.fetchDetail();
  });
});

router.get("/products", async (req: Express.Request, res: Express.Response) => {
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
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {function: Promise<object>} routeHandler
 */
const handleRoute = async (
  req: Express.Request,
  res: Express.Response,
  routeHandler: () => Promise<object>): Promise<void> => {
  try {
    const result = await routeHandler();

    if (typeof result === "object") {
      (res as any).json(result); // res.json does not exist on Express.Response (?)
    } else {
      throw new Error(`Unhandled response type: ${typeof result}`);
    }
  } catch (exc) {
    const errMsg = exc.message || exc.toString();
    const errName = exc.name || null;

    logger.error(errMsg);

    (res as any) // res.status does not exist on Express.Response (?)
      .status(404)
      .json({
        error: errMsg,
        errorType: errName
      });
  }
};

export default router;
