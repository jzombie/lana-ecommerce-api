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
const Product_1 = __importDefault(require("../../classes/Product"));
const handleRoute_1 = __importDefault(require("../handleRoute"));
const router = express_1.default.Router();
/**
 * Retrieves a list of all products.
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    handleRoute_1.default(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield Product_1.default.fetchAllProducts();
        return Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () { return yield product.fetchDetail(); })));
    }));
}));
exports.default = router;
//# sourceMappingURL=index.js.map