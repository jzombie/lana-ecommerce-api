import express from "express";
import Product, { IProductDetail } from "../../classes/Product";
import handleRoute from "../handleRoute";
const router = express.Router();

/**
 * Retrieves a list of all products.
 */
router.get("/", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async (): Promise<IProductDetail[]> => {
    const products: Product[] = await Product.fetchAllProducts();

    return Promise.all(
      products.map(async (product) => await product.fetchDetail())
    );
  });
});

export default router;
