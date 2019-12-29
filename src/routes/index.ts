import express from "express";
const router = express.Router();
import Product from "../classes/Product";
import logger from "../logger";

router.get("/product/:sku", async (req: any, res: any) => {
  const sku = req.params.sku;

  try {
    const product = new Product(sku);

    const productDetails = await product.fetchDetail();

    res.json(productDetails);
  } catch (exc) {
    // TODO: Unify as route handler
    logger.error(exc.message || exc.toString());

    res.status(404).json({err: `Product with SKU "${sku}" does not exist.`});
  }
});

router.get("/products", async (req: any, res: any) => {
  try {
    const products = await Product.fetchAllProducts();

    const productDetails = await Promise.all(
      products.map(async (product) => await product.fetchDetail())
    );

    res.json(productDetails);
  } catch (exc) {
    // TODO: Unify as route handler
    logger.error(exc.message || exc.toString());
  }
});

export default router;
