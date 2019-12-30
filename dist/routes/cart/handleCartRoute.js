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
const Cart_1 = __importDefault(require("../../classes/Cart"));
const handleRoute_1 = __importDefault(require("../handleRoute"));
/**
 * Unified handling for cart API routes.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function: Promise<any | Error>} routeHandler? The resolved return of which is
 * sent through the res (express.Response) object back to the client.
 */
const handleCartRoute = (req, res, routeHandler) => __awaiter(void 0, void 0, void 0, function* () {
    yield handleRoute_1.default(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        if (typeof routeHandler === "function") {
            yield routeHandler();
        }
        const cart = new Cart_1.default(req.session.id);
        const baseAndPromoItems = yield cart.fetchBaseAndPromoItems();
        const subtotal = yield cart.fetchSubtotal();
        return Object.assign(Object.assign({}, baseAndPromoItems), { subtotal });
    }));
});
exports.default = handleCartRoute;
//# sourceMappingURL=handleCartRoute.js.map