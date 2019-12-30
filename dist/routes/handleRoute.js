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
/**
 * Unified handling for API routes.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function: Promise<any | Error>} routeHandler The resolved return of which is
 * sent through the res (express.Response) object back to the client.
 */
const handleRoute = (req, res, routeHandler) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info(`HTTP Request | ${req.method} | ${req.url}`);
        const result = (yield routeHandler()) || {};
        if (typeof result === "object") {
            res.json(result);
        }
        else {
            throw new Error(`Unhandled response type: ${typeof result}`);
        }
    }
    catch (exc) {
        const errStack = exc.stack || null;
        if (errStack) {
            logger_1.default.error(JSON.stringify(errStack));
        }
        const errMsg = exc.message || exc.toString();
        const errName = exc.name || null;
        logger_1.default.error(errMsg);
        res
            .status(404)
            .json({
            error: errMsg,
            errorType: errName
        });
    }
});
exports.default = handleRoute;
//# sourceMappingURL=handleRoute.js.map