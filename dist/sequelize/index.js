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
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_typescript_1 = require("sequelize-typescript");
const logger_1 = __importDefault(require("../logger"));
const sleep_1 = __importDefault(require("../sleep"));
const test_baseProducts_1 = __importDefault(require("../test.baseProducts"));
const models = {};
/**
 * @param {boolean} shouldSync? [default = false] Whether or not the models
 * should sync to the database on init.
 * @return {Promise<Object[]>}
 */
function initSequelize(shouldSync = false) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (Object.keys(models).length) {
                return models;
            }
            const modelNames = [
                "product",
                "cart",
                "cart_product"
            ];
            const { NODE_ENV, MYSQL_DB, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USERNAME } = process.env;
            // Await database to exist before trying to continue
            yield (() => __awaiter(this, void 0, void 0, function* () {
                let connection = null;
                do {
                    try {
                        connection = yield promise_1.default.createConnection({
                            user: MYSQL_USERNAME,
                            password: MYSQL_PASSWORD,
                            host: MYSQL_HOST,
                            port: parseInt(MYSQL_PORT, 10)
                        });
                        // Create database, if in development
                        if (NODE_ENV === "development") {
                            yield connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`);
                        }
                    }
                    catch (exc) {
                        logger_1.default.info("Awaiting access to MySQL");
                        yield sleep_1.default(1000);
                    }
                } while (!connection);
            }))();
            const sequelize = new sequelize_typescript_1.Sequelize({
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
                logging: (...msg) => logger_1.default.info(msg[0])
            });
            for (const modelName of modelNames) {
                // @see https://sequelize.org/master/manual/models-definition.html#import
                const model = yield sequelize.import(`./models/${modelName}`);
                if (shouldSync) {
                    yield model.sync({ force: false });
                }
                models[modelName] = model;
            }
            // Create initial products, if in development
            if (NODE_ENV === "development") {
                for (const baseProduct of test_baseProducts_1.default) {
                    yield models.product.create(baseProduct)
                        .catch(() => logger_1.default.info(`Base product already exists with SKU: ${baseProduct.sku}`));
                }
            }
            return models;
        }
        catch (exc) {
            throw exc;
        }
    });
}
exports.initSequelize = initSequelize;
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
exports.getModels = getModels;
//# sourceMappingURL=index.js.map