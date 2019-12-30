import express from "express";
import Product, { IProductDetail } from "../../classes/Product";
import handleRoute from "../handleRoute";
const router = express.Router();

/**
 * Retrieves a product by its SKU.
 */
router.get("/:sku", async (req: express.Request, res: express.Response) => {
  handleRoute(req, res, async (): Promise<IProductDetail> => {
    const sku: string = req.params.sku;
    const product: Product = new Product(sku);

    return product.fetchDetail();
  });
});

export default router;
