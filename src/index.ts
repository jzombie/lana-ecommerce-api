import initExpressApp from "./initExpressApp";
import logger from "./logger";
const { EXPRESS_LISTEN_PORT: port } = process.env; // default port to listen

(async () => {
    const app = await initExpressApp();

    // start the Express server
    app.listen(port, () => {
        logger.log({
            level: "info",
            message: `server started at http://localhost:${port}`
        });
    });
})();

// TODO: Handle uncaught exceptions, etc.
