import express from "express";
import logger from "./logger";
import { initSequelize } from "./sequelize";
const app = express();
const { EXPRESS_LISTEN_PORT: port } = process.env; // default port to listen

(async () => {
    try {
        await initSequelize(true);

        // define a route handler for the default home page
        app.get("/", (req: any, res: any) => {
            res.send ("Hello world!!!");
        });

        // start the Express server
        app.listen(port, () => {
            logger.log({
                level: "info",
                message: `server started at http://localhost:${port}`
            });
        });
    } catch (exc) {
        logger.log({
            level: "error",
            message: exc.toString()
        });
    }
})();

// TODO: Handle uncaught exceptions, etc.
