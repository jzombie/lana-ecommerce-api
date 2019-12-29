import express from "express";
import routes from "./routes";
import { initSequelize } from "./sequelize";
const app = express();

/**
 * Initializes Express application.
 *
 * @return {Promise<express.Application>}
 */
const initExpressApp = async (): Promise<express.Application> => {
  await initSequelize(true);

  app.use("/", routes);

  return app;
};

export default initExpressApp;
