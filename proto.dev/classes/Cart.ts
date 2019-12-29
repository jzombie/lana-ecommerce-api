import uuidv4 from "uuid/v4";
import { getModels } from "../sequelize";

class Cart {
  protected cartId: string;
  protected sequelizeCartModel: any;

  constructor(cartId: string = null) {
    this.cartId = !cartId ? uuidv4() : cartId;
    this.sequelizeCartModel = getModels().cart;
  }

  public async addItem(sku: string, qty: number = 1): Promise<void> {

  }

  public async removeItem(sku: string, qty: number = 1): Promise<void> {
    
  }

  public async fetchItems(): Promise<Product[]> {
  }
}

export default Cart;
