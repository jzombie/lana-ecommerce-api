import { Sequelize } from "sequelize-typescript";
import logger from "../logger";

interface IModels {
  [key: string]: any;
}

const models: IModels = {};

/**
 * @param {boolean} shouldSync? [default = false] Whether or not the models
 * should sync to the database on init.
 * @return {Promise<Object[]>}
 */
async function initSequelize(shouldSync = false) {
  if (Object.keys(models).length) {
    return models;
  }

  const modelNames = [
    "product",
    "cart",
    "cart_product"
  ];

  const {
    MYSQL_DB,
    MYSQL_HOST,
    MYSQL_PASSWORD,
    MYSQL_PORT,
    MYSQL_USERNAME
  } = process.env;

  const sequelize = new Sequelize({
    define: {
      charset: "utf8",
      collate: "utf8_general_ci"
    },
    database: MYSQL_DB,
    dialect: "mysql",
    host: MYSQL_HOST,
    password: MYSQL_PASSWORD,
    port: parseInt(MYSQL_PORT, 10),
    username: MYSQL_USERNAME,
    logging: (...msg) => logger.info(msg[0])
  });

  for (const modelName of modelNames) {
    // @see https://sequelize.org/master/manual/models-definition.html#import
    const model = await sequelize.import(`./models/${modelName}`);

    if (shouldSync) {
      await model.sync({ force: false });
    }

    models[modelName] = model;
  }

  return models;
}

/**
 * Retrives cached list of models, loaded by initSequelize().
 *
 * @return {Object[]}
 */
function getModels() {
  if (!Object.keys(models).length) {
    throw new Error("initSequelize has not yet been initialized");
  }

  return models;
}

export {
  initSequelize,
  getModels
};
