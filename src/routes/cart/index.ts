import express from "express";
import Cart from "../../classes/Cart";
import handleRoute from "../handleRoute";
const router = express.Router();

/**
 * Fetches the entire cart.
 */
router.get("/", async (req: express.Request, res: express.Response) => {
  handleCartRoute(req, res);
});

/**
 * Adds a single item to the cart.
 */
router.post("/:sku", async (req: express.Request, res: express.Response) => {
  handleCartRoute(req, res, async (): Promise<void> => {
    const cart = new Cart(req.session.id);
    const { sku, qty } = req.params;
    await cart.addItem(sku, 1);
  });
});

/**
 * Adds an item with the given quantity to the cart.
 */
router.post("/:sku/:qty", async (req: express.Request, res: express.Response) => {
  handleCartRoute(req, res, async (): Promise<void> => {
    const cart = new Cart(req.session.id);
    const { sku, qty } = req.params;
    await cart.addItem(sku, parseInt(qty, 10));
  });
});

/**
 * Deletes a single item from the cart.
 */
router.delete("/:sku", async (req: express.Request, res: express.Response) => {
  handleCartRoute(req, res, async (): Promise<void> => {
    const cart = new Cart(req.session.id);
    const { sku } = req.params;
    await cart.removeItem(sku, 1);
  });
});

/**
 * Deletes an item with the given quantity from the cart.
 */
router.delete("/:sku/:qty", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async (): Promise<void> => {
    const cart = new Cart(req.session.id);
    const { sku, qty } = req.params;
    await cart.removeItem(sku, parseInt(qty, 10));
  });
});

/**
 * Empties the cart.
 */
router.delete("/", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async (): Promise<void> => {
    const cart = new Cart(req.session.id);
    await cart.empty();
  });
});

/**
 * Unified handling for cart API routes.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function: Promise<any | Error>} routeHandler? The resolved return of which is
 * sent through the res (express.Response) object back to the client.
 */
const handleCartRoute = async (
  req: express.Request,
  res: express.Response,
  routeHandler?: () => Promise<any | Error>): Promise<void> => {
  await handleRoute(req, res, async () => {
    if (typeof routeHandler === "function") {
      await routeHandler();
    }

    const cart = new Cart(req.session.id);

    const baseAndPromoItems = await cart.fetchBaseAndPromoItems();
    const subtotal = await cart.fetchSubtotal();

    return {
      ...baseAndPromoItems,
      subtotal
    };
  });
};

export default router;
