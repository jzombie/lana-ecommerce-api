interface IProductDetail {
  sku: string,
  name: string,
  price: string
};

class Product {
  protected _sku:string;
  protected _name:string;
  protected _price:string;

  constructor(sku: string) {
    this._sku = sku;
  }

  async fetchDetail(): Promise<IProductDetail> {
    try {
      await // Fetch from DB

      return {
        sku: this._sku,
        name: this._name,
        price: this._price
      } 
    } catch (exc) {
      console.error(exc);
      // TODO: Handle exc
    }
  }

  async fetchInventoryQty(): Promise<number> {
    //
  }
}

export default Product;
