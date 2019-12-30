"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = __importDefault(require("./cart"));
const product_1 = __importDefault(require("./product"));
const products_1 = __importDefault(require("./products"));
const router = express_1.default.Router();
router.use("/cart", cart_1.default);
router.use("/product", product_1.default);
router.use("/products", products_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map