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
const express_session_1 = __importDefault(require("express-session"));
const v4_1 = __importDefault(require("uuid/v4"));
const routes_1 = __importDefault(require("./routes"));
const sequelize_1 = require("./sequelize");
// TODO: Utilize Express Session
/**
 * Initializes Express application.
 *
 * @return {Promise<express.Application>}
 */
const initExpressApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize_1.initSequelize(true);
    const app = express_1.default();
    const { EXPRESS_SESSION_SECRET } = process.env;
    // TODO: Replace this w/ hardened sess if utilizing in the real-world
    const sess = {
        secret: EXPRESS_SESSION_SECRET,
        genid: () => v4_1.default(),
        cookie: {}
    };
    app.use(express_session_1.default(sess));
    app.use("/", routes_1.default);
    return app;
});
exports.default = initExpressApp;
//# sourceMappingURL=initExpressApp.js.map