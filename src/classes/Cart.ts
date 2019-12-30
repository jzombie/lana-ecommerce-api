import uuidv4 from "uuid/v4";
import logger from "../logger";
import { getModels } from "../sequelize";
import Product from "./Product";

class Cart {
  protected cartUuid: string;
  protected sequelizeCartModel: any;
  protected sequelizeCartProductModel: any;

  // If no cartUuid is passed, create one...
  constructor(cartUuid: string = null) {
    this.cartUuid = !cartUuid ? uuidv4() : cartUuid;

    const { cart, cart_product } = getModels();
    this.sequelizeCartModel = cart;
    this.sequelizeCartProductModel = cart_product;
  }

  public async addItem(sku: string, qty: number = 1): Promise<void> {
    logger.info("addItem");

    const product = new Product(sku);
    const productDbId = await product.fetchDbId();
    const cartDbId = await this.fetchDbId();

    // Prevent cart quantity from being greater than inventory quantity
    const { inventoryQty } = await product.fetchDetail();
    if (qty > inventoryQty /*+ cartQty*/) {
      throw new Error("Quantity cannot be greater than inventory quantity");
    }

    // TODO: Take inventoryQty into consideration before trying to add

    for (let i = 0; i < qty; i++) {
      await this.sequelizeCartProductModel.create({
        product_id: productDbId,
        cart_id: cartDbId
      });
    }
  }

  public async removeItem(sku: string, qty: number = 1): Promise<void> {
    const product = new Product(sku);
    const productDbId = await product.fetchDbId();
    const cartDbId = await this.fetchDbId();

    for (let i = 0; i < qty; i++) {
      const model = await this.sequelizeCartProductModel.findOne({
        where: {
          product_id: productDbId,
          cart_id: cartDbId
        }
      });

      if (model === null) {
        break;
      }

      await model.destroy();
    }
  }

  /**
   * Fetches all items, including automatically added promotions.
   */
  /*
  public async fetchItems(): Promise<Product[]> {
  }
  */

  /**
   * Retrieves items, not including automatically added promotions.
   */
  /*
  public async fetchBaseItems(): Promise<any> {
    const cartSkus = await this.sequelizeProductModel.findAll({
      raw: true,
      attributes: ["product.sku"],
      where: { ["cart.uuid"]: this.cartUuid }
    });

    console.log({
      cartSkus
    });
  }
  */

  /**
   * Retrieves automatically added promotions.
   */
  /*
  public async fetchPromoItems(): Promise<Product[]> {
  }
  */

  /*
  public async empty(): Promise<void> {
  }
  */

  /**
   * Creates the cart in the database, if it doesn"t already exist.
   */
  public async fetchDbId(): Promise<number> {
    let model = await this.sequelizeCartModel.findOne({
      attributes: ["id"],
      where: {
        uuid: this.cartUuid
      }
    });

    if (!model) {
      model = await this.sequelizeCartModel.create({
        uuid: this.cartUuid
      });
    }

    const { id } = model.dataValues;

    if (id === undefined || id === null) {
      // TODO: Convert to custom error
      throw new Error("Unable to acquire cart db id");
    }

    return id;
  }
}

export default Cart;
