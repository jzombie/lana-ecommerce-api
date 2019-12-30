import logger from "../logger";
import { getModels } from "../sequelize";
import UnknownProductError from "./UnknownProductError";

interface IProductDetail {
  sku: string;
  name: string;
  price: number;
  inventoryQty: number;
}

class Product {
  public static async fetchAllProducts(): Promise<Product[]> {
    const sequelizeProductModel = getModels().product;

    const results: Array<{sku: string}> = await sequelizeProductModel.findAll({
      raw: true,
      attributes: ["sku"]
    });

    const products = results.map((result) => new Product(result.sku));

    return products;
  }

  protected sku: string;
  protected sequelizeProductModel: any;

  constructor(sku: string) {
    this.sku = sku;
    this.sequelizeProductModel = getModels().product;
  }

  public async fetchDetail(): Promise<IProductDetail> {
    try {
      const dbResp = await this.sequelizeProductModel.findOne({
        raw: true,
        attributes: ["sku", "name", "price", "inventory_qty"],
        where: { sku: this.sku }
      });

      const { sku, name, price } = dbResp;

      return {
        sku,
        name,
        price,
        inventoryQty: dbResp.inventory_qty
      };
    } catch (exc) {
      logger.log({
        level: "error",
        message: exc.message || exc.toString()
      });
      throw new UnknownProductError(this.sku);
    }
  }

  public async fetchDbId(): Promise<number> {
    const { id } = await this.sequelizeProductModel.findOne({
      raw: true,
      attributes: ["id"],
      where: {
        sku: this.sku
      }
    });

    if (id === undefined || id === null) {
      // TODO: Convert to custom error
      throw new Error("Unable to acquire product db id");
    }

    return id;
  }
}

export default Product;
export {
  UnknownProductError,
  IProductDetail
};
