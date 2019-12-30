import express from "express";
import cartRoutes from "./cart";
import productRoutes from "./product";
import productsRoutes from "./products";
const router = express.Router();

router.use("/cart", cartRoutes);
router.use("/product", productRoutes);
router.use("/products", productsRoutes);

export default router;
