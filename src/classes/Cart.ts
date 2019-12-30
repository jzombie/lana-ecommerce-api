import uuidv4 from "uuid/v4";
import roundMoney from "../roundMoney";
import { getModels } from "../sequelize";
import Product, { IProductDetail } from "./Product";

interface ICartItem extends IProductDetail {
  cartQty: number;
}

class Cart {
  protected uuid: string;
  protected sequelizeCartModel: any;
  protected sequelizeCartProductModel: any;

  // If no uuid is passed, create one...
  constructor(uuid: string = null) {
    this.uuid = !uuid ? uuidv4() : uuid;

    const { cart, cart_product } = getModels();
    this.sequelizeCartModel = cart;
    this.sequelizeCartProductModel = cart_product;
  }

  public async addItem(sku: string, newQty: number = 1): Promise<void> {
    const product = new Product(sku);
    const productDbId = await product.fetchDbId();
    const cartDbId = await this.fetchDbId();

    const cartBaseItems: ICartItem[] = await this.fetchBaseItems();
    // Where cartQty is how many are currently in the cart before adding
    const { cartQty = 0 } = cartBaseItems.find((cartItem: ICartItem) => cartItem.sku === sku) || {};

    // Prevent cart quantity from being greater than inventory quantity
    const { inventoryQty } = await product.fetchDetail();

    if (newQty + cartQty > inventoryQty) {
      const adjustedNewQty: number = inventoryQty - cartQty;
      if (adjustedNewQty > 0) {
        newQty = adjustedNewQty;
      } else {
        throw new Error(`Cannot add additional items: ${sku}`);
      }
    }

    // For each new item, add it to the cart as a new row
    for (let i = 0; i < newQty; i++) {
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
   * Retrieves items, not including automatically added promotions.
   */
  public async fetchBaseItems(): Promise<ICartItem[]> {
    const cartDbId = await this.fetchDbId();
    const results: Array<{ product_id: number }> = await this.sequelizeCartProductModel.findAll({
      raw: true,
      attributes: ["product_id"],
      where: {
        cart_id: cartDbId
      }
    });

    const products = await Promise.all(
      results.map(async (result) => await Product.fetchProductWithDbId(result.product_id))
    );

    const productDetails = await Promise.all(
      products.map(async (product) => await product.fetchDetail())
    );

    const ret: ICartItem[] = [];

    for (const productDetail of productDetails) {
      const matched = ret.find((retProductDetail) => productDetail.sku === retProductDetail.sku);

      if (matched) {
        // Update matched item w/ updated cartQty and inventoryQty

        matched.cartQty++;
        matched.inventoryQty--;
      } else {
        // Pull item from stock and add into cart
        // Note: The actual inventory qty stored in the database will not be
        // updated until the purchase is made

        const { sku, name, price, inventoryQty } = productDetail;
        ret.push({
          sku,
          name,
          price,
          inventoryQty: inventoryQty - 1,
          cartQty: 1
        });
      }
    }

    return ret;
  }

  /**
   * Retrieves automatically added promotions.
   */
  public async fetchBaseAndPromoItems(): Promise<{ baseItems: ICartItem[], promoItems: ICartItem[] }> {
    const originalBaseItems = await this.fetchBaseItems();

    const promoItems: ICartItem[] = [];

    const baseItems = [...originalBaseItems];
    for (const cartItem of baseItems) {
      // Each sale of a MacBook Pro comes with a free Raspberry Pi B
      if (cartItem.sku === "43N23P") {
        const promoSku = "234234";

        for (let i = 0; i < cartItem.cartQty; i++) {
          let cartPromoItem =
            baseItems.find((item) => item.sku === promoSku) ||
            promoItems.find((item) => item.sku === promoSku);

          if (cartPromoItem) {
            cartPromoItem.price = 0 - cartPromoItem.price;
            if (cartPromoItem.inventoryQty > 0) {
              cartPromoItem.cartQty++;
              cartPromoItem.inventoryQty--;
            }
          } else {
            const product = new Product(promoSku);
            const productDetail = await product.fetchDetail();

            if (productDetail.inventoryQty > 0) {
              cartPromoItem = {
                ...productDetail,
                price: 0,
                cartQty: 1,
                inventoryQty: productDetail.inventoryQty - 1
              };

              promoItems.push(cartPromoItem);
            }
          }
        }
      }

      // Buy 3 Google Homes for the price of 2
      if (cartItem.sku === "120P90") {
        if (cartItem.cartQty >= 3) {
          cartItem.cartQty--;
          promoItems.push({
            ...cartItem,
            cartQty: 1,
            price: 0
          });
        }
      }

      // Buying more than 3 Alexa Speakers will have a 10% discount on all Alexa speakers
      if (cartItem.sku === "A304SD") {
        if (cartItem.cartQty >= 3) {
          cartItem.price = roundMoney(cartItem.price * .9);
        }
      }
    }

    return {
      baseItems,
      promoItems
    };
  }

  public async fetchSubtotal(): Promise<number> {
    const { baseItems, promoItems } = await this.fetchBaseAndPromoItems();

    let subTotal = 0;
    baseItems.forEach((item) => {
      subTotal += roundMoney(item.price * item.cartQty);
    });
    promoItems.forEach((item) => {
      subTotal += roundMoney(item.price * item.cartQty);
    });

    return subTotal;
  }

  public async empty(): Promise<void> {
    const cartDbId = await this.fetchDbId();

    await this.sequelizeCartProductModel.destroy({
      where: {
        cart_id: cartDbId
      }
    });
  }

  /**
   * Creates the cart in the database, if it doesn"t already exist.
   */
  public async fetchDbId(): Promise<number> {
    let model = await this.sequelizeCartModel.findOne({
      attributes: ["id"],
      where: {
        uuid: this.uuid
      }
    });

    if (!model) {
      model = await this.sequelizeCartModel.create({
        uuid: this.uuid
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
export {
  ICartItem
};
