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
const v4_1 = __importDefault(require("uuid/v4"));
const roundMoney_1 = __importDefault(require("../roundMoney"));
const sequelize_1 = require("../sequelize");
const Product_1 = __importDefault(require("./Product"));
class Cart {
    /**
     * @param {string} uuid? If no uuid is passed, one is created.
     */
    constructor(uuid = null) {
        this.uuid = !uuid ? v4_1.default() : uuid;
        const { cart, cart_product } = sequelize_1.getModels();
        this.sequelizeCartModel = cart;
        this.sequelizeCartProductModel = cart_product;
    }
    /**
     * Adds an item to the cart.
     *
     * @param {string} sku
     * @param {number} qty?
     * @return {Promise<void>}
     */
    addItem(sku, qty = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = new Product_1.default(sku);
            const productDbId = yield product.fetchDbId();
            const cartDbId = yield this.fetchDbId();
            const cartBaseItems = yield this.fetchBaseItems();
            const { cartQty: existingCartQty = 0 } = cartBaseItems.find((cartItem) => cartItem.sku === sku) || {};
            // Prevent cart quantity from being greater than inventory quantity
            const { inventoryQty } = yield product.fetchDetail();
            // If the new qty + the existing qty is greater than inventory qty...
            if (qty + existingCartQty > inventoryQty) {
                // Reduce the qty to how many are left in the inventory
                const reducedQty = inventoryQty - existingCartQty;
                if (reducedQty > 0) {
                    qty = reducedQty;
                }
                else {
                    throw new Error(`Cannot add additional items: ${sku}`);
                }
            }
            // For each new item, add it to the cart as a new row
            for (let i = 0; i < qty; i++) {
                yield this.sequelizeCartProductModel.create({
                    product_id: productDbId,
                    cart_id: cartDbId
                });
            }
        });
    }
    /**
     * Removes an item from the cart.
     *
     * @param {string} sku
     * @param {number} qty?
     * @return {Promise<void>}
     */
    removeItem(sku, qty = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = new Product_1.default(sku);
            const productDbId = yield product.fetchDbId();
            const cartDbId = yield this.fetchDbId();
            for (let i = 0; i < qty; i++) {
                const model = yield this.sequelizeCartProductModel.findOne({
                    where: {
                        product_id: productDbId,
                        cart_id: cartDbId
                    }
                });
                if (model === null) {
                    break;
                }
                yield model.destroy();
            }
        });
    }
    /**
     * Retrieves items, not including automatically added promotions.
     *
     * @return {Promise<ICartItem[]>}
     */
    fetchBaseItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const cartDbId = yield this.fetchDbId();
            const results = yield this.sequelizeCartProductModel.findAll({
                raw: true,
                attributes: ["product_id"],
                where: {
                    cart_id: cartDbId
                }
            });
            const products = yield Promise.all(results.map((result) => __awaiter(this, void 0, void 0, function* () { return yield Product_1.default.fetchProductWithDbId(result.product_id); })));
            const productDetails = yield Promise.all(products.map((product) => __awaiter(this, void 0, void 0, function* () { return yield product.fetchDetail(); })));
            const ret = [];
            for (const productDetail of productDetails) {
                const matched = ret.find((retProductDetail) => productDetail.sku === retProductDetail.sku);
                if (matched) {
                    // Update matched item w/ updated cartQty and inventoryQty
                    matched.cartQty++;
                    matched.inventoryQty--;
                }
                else {
                    // Pull item from stock and add into cart
                    // Note: The actual inventory qty stored in the database will not be
                    // updated until the purchase is made
                    const { sku, name, price, inventoryQty } = productDetail;
                    ret.push({
                        sku,
                        name,
                        price,
                        inventoryQty: inventoryQty - 1,
                        cartQty: 1
                    });
                }
            }
            return ret;
        });
    }
    /**
     * Retrieves automatically-added promotional items, along with the original items.
     *
     * @return {Promise<{ baseItems: ICartItem[], promoItems: ICartItem[] }>}
     */
    fetchBaseAndPromoItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const originalBaseItems = yield this.fetchBaseItems();
            const promoItems = [];
            let baseItems = [...originalBaseItems];
            for (const cartItem of baseItems) {
                // Buy 3 Google Homes for the price of 2
                // Expected retail price for toal is: $99.98
                if (cartItem.sku === "120P90") {
                    if (cartItem.cartQty >= 3) {
                        cartItem.cartQty--;
                        promoItems.push(Object.assign(Object.assign({}, cartItem), { cartQty: 1, price: 0 }));
                    }
                }
                // Buying more than 3 Alexa Speakers will have a 10% discount on all Alexa speakers
                // Expected retail price for 3 is: $295.65
                if (cartItem.sku === "A304SD") {
                    if (cartItem.cartQty >= 3) {
                        cartItem.price = roundMoney_1.default(cartItem.price * .9);
                    }
                }
                // Each sale of a MacBook Pro comes with a free Raspberry Pi B
                // Expected price for 1 MacBook Pro & 1 Raspberry Pi B: $5,399.99
                if (cartItem.sku === "43N23P") {
                    const promoSku = "234234";
                    for (let i = 0; i < cartItem.cartQty; i++) {
                        // Convert existing cart item, if the item has already been added as a main item
                        const convPromoItem = baseItems.find((item) => item.sku === promoSku);
                        if (convPromoItem && convPromoItem.cartQty > 0) {
                            convPromoItem.cartQty--;
                            if (convPromoItem.cartQty === 0) {
                                // Remove promo item from base items
                                baseItems = baseItems.filter((item) => item.sku !== promoSku);
                            }
                        }
                        // Determine if the promo item is already in the list of promo items
                        let promoItem = promoItems.find((item) => item.sku === promoSku);
                        if (promoItem) {
                            if (promoItem.inventoryQty > 0) {
                                promoItem.cartQty++;
                                promoItem.inventoryQty--;
                            }
                        }
                        else {
                            const raspPi = new Product_1.default(promoSku);
                            const raspPiDetail = yield raspPi.fetchDetail();
                            if (raspPiDetail.inventoryQty > 0) {
                                // Add the item to the list of promo items
                                promoItem = Object.assign(Object.assign({}, raspPiDetail), { price: 0, cartQty: 1, inventoryQty: raspPiDetail.inventoryQty - 1 });
                                promoItems.push(promoItem);
                            }
                        }
                    }
                }
            }
            return {
                baseItems,
                promoItems
            };
        });
    }
    /**
     * Fetches the cart's subtotal price.
     *
     * @return {Promise<number>}
     */
    fetchSubtotal() {
        return __awaiter(this, void 0, void 0, function* () {
            const { baseItems, promoItems } = yield this.fetchBaseAndPromoItems();
            let subtotal = 0;
            baseItems.forEach((item) => {
                subtotal += item.price * item.cartQty;
            });
            promoItems.forEach((item) => {
                subtotal += item.price * item.cartQty;
            });
            return roundMoney_1.default(subtotal);
        });
    }
    /**
     * Removes all items from the cart.
     *
     * @return {Promise<void>}
     */
    empty() {
        return __awaiter(this, void 0, void 0, function* () {
            const cartDbId = yield this.fetchDbId();
            yield this.sequelizeCartProductModel.destroy({
                where: {
                    cart_id: cartDbId
                }
            });
        });
    }
    /**
     * Creates the cart in the database, if it doesn't already exist, and
     * retrieves the db row id of the cart in the cart table.
     *
     * Note, this does not correspond to the product rows in the cart_product
     * table.
     *
     * @return {Promise<number>}
     */
    fetchDbId() {
        return __awaiter(this, void 0, void 0, function* () {
            let model = yield this.sequelizeCartModel.findOne({
                attributes: ["id"],
                where: {
                    uuid: this.uuid
                }
            });
            if (!model) {
                model = yield this.sequelizeCartModel.create({
                    uuid: this.uuid
                });
            }
            const { id } = model.dataValues;
            if (id === undefined || id === null) {
                // TODO: Convert to custom error
                throw new Error("Unable to acquire cart db id");
            }
            return id;
        });
    }
}
exports.default = Cart;
//# sourceMappingURL=Cart.js.map