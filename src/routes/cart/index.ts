import express from "express";
import Cart from "../../classes/Cart";
import handleCartRoute from "./handleCartRoute";

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
  handleCartRoute(req, res, async (): Promise<void> => {
    const cart = new Cart(req.session.id);
    const { sku, qty } = req.params;
    await cart.removeItem(sku, parseInt(qty, 10));
  });
});

/**
 * Empties the cart.
 */
router.delete("/", async (req: express.Request, res: express.Response) => {
  handleCartRoute(req, res, async (): Promise<void> => {
    const cart = new Cart(req.session.id);
    await cart.empty();
  });
});

export default router;
