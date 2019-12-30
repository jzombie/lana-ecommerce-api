"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Cart_1 = __importDefault(require("../../classes/Cart"));
const handleCartRoute_1 = __importDefault(require("./handleCartRoute"));
const router = express_1.default.Router();
/**
 * Fetches the entire cart.
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleCartRoute_1.default(req, res);
}));
/**
 * Adds a single item to the cart.
 */
router.post("/:sku", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleCartRoute_1.default(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        const cart = new Cart_1.default(req.session.id);
        const { sku } = req.params;
        yield cart.addItem(sku, 1);
    }));
}));
/**
 * Adds an item with the given quantity to the cart.
 */
router.post("/:sku/:qty", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleCartRoute_1.default(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        const cart = new Cart_1.default(req.session.id);
        const { sku, qty } = req.params;
        yield cart.addItem(sku, parseInt(qty, 10));
    }));
}));
/**
 * Deletes a single item from the cart.
 */
router.delete("/:sku", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleCartRoute_1.default(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        const cart = new Cart_1.default(req.session.id);
        const { sku } = req.params;
        yield cart.removeItem(sku, 1);
    }));
}));
/**
 * Deletes an item with the given quantity from the cart.
 */
router.delete("/:sku/:qty", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleCartRoute_1.default(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        const cart = new Cart_1.default(req.session.id);
        const { sku, qty } = req.params;
        yield cart.removeItem(sku, parseInt(qty, 10));
    }));
}));
/**
 * Empties the cart.
 */
router.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleCartRoute_1.default(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        const cart = new Cart_1.default(req.session.id);
        yield cart.empty();
    }));
}));
exports.default = router;
//# sourceMappingURL=index.js.map