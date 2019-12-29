import logger from "../logger";
import { getModels } from "../sequelize";
import UnknownProductError from "./UnknownProductError";

interface IProductDetail {
  sku: string;
  name: string;
  price: number;
  inventory_qty: number;
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
      const { sku, name, price, inventory_qty }: IProductDetail = await this.sequelizeProductModel.findOne({
        raw: true,
        attributes: ["sku", "name", "price", "inventory_qty"],
        where: { sku: this.sku }
      });

      return {
        sku,
        name,
        price,
        inventory_qty
      };
    } catch (exc) {
      logger.log({
        level: "error",
        message: exc.message || exc.toString()
      });
      throw new UnknownProductError(this.sku);
    }
  }
}

export default Product;
export {
  UnknownProductError,
  IProductDetail
};
