"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./logger"));
const app = express_1.default();
const { EXPRESS_LISTEN_PORT: port } = process.env; // default port to listen
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
//# sourceMappingURL=index.js.map