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
const logger_1 = __importDefault(require("../logger"));
const sequelize_1 = require("../sequelize");
const UnknownSKUError_1 = __importDefault(require("./UnknownSKUError"));
exports.UnknownSKUError = UnknownSKUError_1.default;
class Product {
    constructor(sku) {
        this.sku = sku;
        this.sequelizeProductModel = sequelize_1.getModels().product;
    }
    static fetchProductWithDbId(dbId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sequelizeProductModel = sequelize_1.getModels().product;
            const result = yield sequelizeProductModel.findOne({
                raw: true,
                attributes: ["sku"],
                where: {
                    id: dbId
                }
            });
            if (!result) {
                throw new Error(`Unable to locate product with DB id: ${dbId}`);
            }
            const product = new Product(result.sku);
            return product;
        });
    }
    static fetchAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const sequelizeProductModel = sequelize_1.getModels().product;
            const results = yield sequelizeProductModel.findAll({
                raw: true,
                attributes: ["sku"]
            });
            const products = results.map((result) => new Product(result.sku));
            return products;
        });
    }
    fetchDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbResp = yield this.sequelizeProductModel.findOne({
                    raw: true,
                    attributes: ["sku", "name", "price", "inventory_qty"],
                    where: { sku: this.sku }
                });
                const { sku, name, price } = dbResp;
                return {
                    sku,
                    name,
                    price,
                    inventoryQty: dbResp.inventory_qty
                };
            }
            catch (exc) {
                logger_1.default.log({
                    level: "error",
                    message: exc.message || exc.toString()
                });
                throw new UnknownSKUError_1.default(this.sku);
            }
        });
    }
    fetchDbId() {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = yield this.sequelizeProductModel.findOne({
                raw: true,
                attributes: ["id"],
                where: {
                    sku: this.sku
                }
            });
            if (id === undefined || id === null) {
                // TODO: Convert to custom error
                throw new Error("Unable to acquire product db id");
            }
            return id;
        });
    }
}
exports.default = Product;
//# sourceMappingURL=Product.js.map