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
const logger_1 = __importDefault(require("./logger"));
const sequelize_1 = require("./sequelize");
const app = express_1.default();
const { EXPRESS_LISTEN_PORT: port } = process.env; // default port to listen
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.initSequelize(true);
        // define a route handler for the default home page
        app.get("/", (req, res) => {
            res.send("Hello world!!!");
        });
        // start the Express server
        app.listen(port, () => {
            logger_1.default.log({
                level: "info",
                message: `server started at http://localhost:${port}`
            });
        });
    }
    catch (exc) {
        logger_1.default.log({
            level: "error",
            message: exc.toString()
        });
    }
}))();
// TODO: Handle uncaught exceptions, etc.
//# sourceMappingURL=index.js.map