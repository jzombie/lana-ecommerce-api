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

  /**
   * @param {string} uuid? If no uuid is passed, one is created.
   */
  constructor(uuid: string = null) {
    this.uuid = !uuid ? uuidv4() : uuid;

    const { cart, cart_product } = getModels();
    this.sequelizeCartModel = cart;
    this.sequelizeCartProductModel = cart_product;
  }

  /**
   * Adds an item to the cart.
   *
   * @param {string} sku
   * @param {number} qty?
   * @return {Promise<void>}
   */
  public async addItem(sku: string, qty: number = 1): Promise<void> {
    const product = new Product(sku);
    const productDbId = await product.fetchDbId();
    const cartDbId = await this.fetchDbId();

    const cartBaseItems: ICartItem[] = await this.fetchBaseItems();

    const { cartQty: existingCartQty = 0 } = cartBaseItems.find((cartItem: ICartItem) => cartItem.sku === sku) || {};

    // Prevent cart quantity from being greater than inventory quantity
    const { inventoryQty } = await product.fetchDetail();

    // If the new qty + the existing qty is greater than inventory qty...
    if (qty + existingCartQty > inventoryQty) {
      // Reduce the qty to how many are left in the inventory
      const reducedQty: number = inventoryQty - existingCartQty;
      if (reducedQty > 0) {
        qty = reducedQty;
      } else {
        throw new Error(`Cannot add additional items: ${sku}`);
      }
    }

    // For each new item, add it to the cart as a new row
    for (let i = 0; i < qty; i++) {
      await this.sequelizeCartProductModel.create({
        product_id: productDbId,
        cart_id: cartDbId
      });
    }
  }

  /**
   * Removes an item from the cart.
   *
   * @param {string} sku
   * @param {number} qty?
   * @return {Promise<void>}
   */
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
   *
   * @return {Promise<ICartItem[]>}
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
   * Retrieves automatically-added promotional items, along with the original items.
   *
   * @return {Promise<{ baseItems: ICartItem[], promoItems: ICartItem[] }>}
   */
  public async fetchBaseAndPromoItems(): Promise<{ baseItems: ICartItem[], promoItems: ICartItem[] }> {
    const originalBaseItems = await this.fetchBaseItems();

    const promoItems: ICartItem[] = [];

    let baseItems = [...originalBaseItems];
    for (const cartItem of baseItems) {
      // Buy 3 Google Homes for the price of 2
      // Expected retail price for toal is: $99.98
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
      // Expected retail price for 3 is: $295.65
      if (cartItem.sku === "A304SD") {
        if (cartItem.cartQty >= 3) {
          cartItem.price = roundMoney(cartItem.price * .9);
        }
      }

      // Each sale of a MacBook Pro comes with a free Raspberry Pi B
      // Expected price for 1 MacBook Pro & 1 Raspberry Pi B: $5,399.99
      if (cartItem.sku === "43N23P") {
        const promoSku = "234234";

        for (let i = 0; i < cartItem.cartQty; i++) {
          // Convert existing cart item, if the item has already been added as a main item
          const convPromoItem = baseItems.find((item) => item.sku === promoSku);
          if (convPromoItem && convPromoItem.cartQty > 0) {
            convPromoItem.cartQty--;

            if (convPromoItem.cartQty === 0) {
              // Remove promo item from base items
              baseItems = baseItems.filter((item) => item.sku !== promoSku);
            }
          }

          // Determine if the promo item is already in the list of promo items
          let promoItem = promoItems.find((item) => item.sku === promoSku);
          if (promoItem) {
            if (promoItem.inventoryQty > 0) {
              promoItem.cartQty++;
              promoItem.inventoryQty--;
            }
          } else {
            const raspPi = new Product(promoSku);
            const raspPiDetail = await raspPi.fetchDetail();

            if (raspPiDetail.inventoryQty > 0) {
              // Add the item to the list of promo items
              promoItem = {
                ...raspPiDetail,
                price: 0,
                cartQty: 1,
                inventoryQty: raspPiDetail.inventoryQty - 1
              };

              promoItems.push(promoItem);
            }
          }
        }
      }
    }

    return {
      baseItems,
      promoItems
    };
  }

  /**
   * Fetches the cart's subtotal price.
   *
   * @return {Promise<number>}
   */
  public async fetchSubtotal(): Promise<number> {
    const { baseItems, promoItems } = await this.fetchBaseAndPromoItems();

    let subtotal = 0;
    baseItems.forEach((item) => {
      subtotal += item.price * item.cartQty;
    });
    promoItems.forEach((item) => {
      subtotal += item.price * item.cartQty;
    });

    return roundMoney(subtotal);
  }

  /**
   * Removes all items from the cart.
   *
   * @return {Promise<void>}
   */
  public async empty(): Promise<void> {
    const cartDbId = await this.fetchDbId();

    await this.sequelizeCartProductModel.destroy({
      where: {
        cart_id: cartDbId
      }
    });
  }

  /**
   * Creates the cart in the database, if it doesn't already exist, and
   * retrieves the db row id of the cart in the cart table.
   *
   * Note, this does not correspond to the product rows in the cart_product
   * table.
   *
   * @return {Promise<number>}
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
