import express from "express";
import session from "express-session";
import routes from "./routes";
import { initSequelize } from "./sequelize";
// TODO: Utilize Express Session

/**
 * Initializes Express application.
 *
 * @return {Promise<express.Application>}
 */
const initExpressApp = async (): Promise<express.Application> => {
  await initSequelize(true);

  const app = express();

  // TODO: Replace this w/ hardened sess if utilizing in the real-world
  const sess = {
    secret: "keyboard cat",
    cookie: {}
  };

  app.use(session(sess));

  app.use("/", routes);

  return app;
};

export default initExpressApp;
