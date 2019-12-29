import express from "express";
import routes from "./routes";
import { initSequelize } from "./sequelize";
const app = express();

const initExpressApp = async (): Promise<any /*Express.Application*/> => {
  await initSequelize(true);

  app.use("/", routes);

  return app;
};

export default initExpressApp;
