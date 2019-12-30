import express from "express";
import session from "express-session";
import uuidv4 from "uuid/v4";
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

  const { EXPRESS_SESSION_SECRET } = process.env;

  // TODO: Replace this w/ hardened sess if utilizing in the real-world
  const sess = {
    secret: EXPRESS_SESSION_SECRET,
    genid: () => uuidv4(), // use UUIDs for session IDs
    cookie: {}
  };

  app.use(session(sess));

  app.use("/", routes);

  return app;
};

export default initExpressApp;
