import express from "express";
import Cart from "../classes/Cart";
import Product, { IProductDetail } from "../classes/Product";
import logger from "../logger";
const router = express.Router();

router.get("/product/:sku", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async (): Promise<IProductDetail> => {
    const sku: string = req.params.sku;
    const product: Product = new Product(sku);

    return product.fetchDetail();
  });
});

router.get("/products", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async (): Promise<IProductDetail[]> => {
    const products: Product[] = await Product.fetchAllProducts();

    return Promise.all(
      products.map(async (product) => await product.fetchDetail())
    );
  });
});

router.get("/cart", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async () => {
    const cart = new Cart(req.session.id);

    const baseAndPromoItems = await cart.fetchBaseAndPromoItems();
  });
});

router.post("/cart/:sku", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async () => {
    const cart = new Cart(req.session.id);

    const { sku, qty } = req.params;

    await cart.addItem(sku, 1);

    const baseAndPromoItems = await cart.fetchBaseAndPromoItems();
    const subtotal = await cart.fetchSubtotal();

    return {
      ...baseAndPromoItems,
      subtotal
    };
  });
});

router.post("/cart/:sku/:qty", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async () => {
    const cart = new Cart(req.session.id);

    const { sku, qty } = req.params;

    await cart.addItem(sku, parseInt(qty, 10));

    const baseAndPromoItems = await cart.fetchBaseAndPromoItems();
    const subtotal = await cart.fetchSubtotal();

    return {
      ...baseAndPromoItems,
      subtotal
    };
  });
});

router.delete("/cart/:sku", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async () => {
    const cart = new Cart(req.session.id);

    const { sku } = req.params;

    await cart.removeItem(sku, 1);

    const baseAndPromoItems = await cart.fetchBaseAndPromoItems();
    const subtotal = await cart.fetchSubtotal();

    return {
      ...baseAndPromoItems,
      subtotal
    };
  });
});

router.delete("/cart/:sku/:qty", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async () => {
    const cart = new Cart(req.session.id);

    const { sku, qty } = req.params;

    await cart.removeItem(sku, parseInt(qty, 10));

    const baseAndPromoItems = await cart.fetchBaseAndPromoItems();
    const subtotal = await cart.fetchSubtotal();

    return {
      ...baseAndPromoItems,
      subtotal
    };
  });
});

router.delete("/cart", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async () => {
    const cart = new Cart(req.session.id);

    await cart.empty();

    const baseAndPromoItems = await cart.fetchBaseAndPromoItems();
    const subtotal = await cart.fetchSubtotal();

    return {
      ...baseAndPromoItems,
      subtotal
    };
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

    const result: any = await routeHandler() || {};

    if (typeof result === "object") {
      res.json(result);
    } else {
      throw new Error(`Unhandled response type: ${typeof result}`);
    }
  } catch (exc) {
    const errStack = exc.stack || null;
    if (errStack) {
      logger.error(JSON.stringify(errStack));
    }

    const errMsg: string = exc.message || exc.toString();
    const errName: string = exc.name || null;

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
