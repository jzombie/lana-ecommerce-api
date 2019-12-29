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
const UnknownProductError_1 = __importDefault(require("./UnknownProductError"));
exports.UnknownProductError = UnknownProductError_1.default;
class Product {
    constructor(sku) {
        this.sku = sku;
        this.sequelizeProductModel = sequelize_1.getModels().product;
    }
    fetchDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sku, name, price, inventory_qty } = yield this.sequelizeProductModel.findOne({
                    raw: true,
                    attributes: ["sku", "name", "price", "inventory_qty"],
                    where: { sku: this.sku }
                });
                return {
                    sku,
                    name,
                    price,
                    inventory_qty
                };
            }
            catch (exc) {
                logger_1.default.log({
                    level: "error",
                    message: exc.message || exc.toString()
                });
                throw new UnknownProductError_1.default(this.sku);
            }
        });
    }
}
exports.default = Product;
//# sourceMappingURL=Product.js.map