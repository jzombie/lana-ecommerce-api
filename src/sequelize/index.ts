import mysql from "mysql2/promise";
import { Sequelize } from "sequelize-typescript";
import logger from "../logger";
import sleep from "../sleep";
import baseProducts from "../test.baseProducts";

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
  try {
    if (Object.keys(models).length) {
      return models;
    }

    const modelNames = [
      "product",
      "cart",
      "cart_product"
    ];

    const {
      NODE_ENV,
      MYSQL_DB,
      MYSQL_HOST,
      MYSQL_PASSWORD,
      MYSQL_PORT,
      MYSQL_USERNAME
    } = process.env;

    // Await database to exist before trying to continue
    await (async () => {
      let connection = null;

      do {
        try {
          connection = await mysql.createConnection({
            user: MYSQL_USERNAME,
            password: MYSQL_PASSWORD,
            host: MYSQL_HOST,
            port: parseInt(MYSQL_PORT, 10)
          });

          // Create database, if in development
          if (NODE_ENV === "development") {
            await connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`);
          }
        } catch (exc) {
          logger.info("Awaiting access to MySQL");

          await sleep(1000);
        }
      } while (!connection);
    })();

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

    // Create initial products, if in development
    if (NODE_ENV === "development") {
      for (const baseProduct of baseProducts) {
        await models.product.create(
          baseProduct).catch(
            () => logger.info(`Base product already exists with SKU: ${baseProduct.sku}`
          )
        );
      }
    }

    return models;
  } catch (exc) {
    throw exc;
  }
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
