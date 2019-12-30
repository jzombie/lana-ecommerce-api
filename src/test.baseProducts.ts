import { IProductDetail } from "./classes/Product";

const baseProducts: IProductDetail[] = [
  {
    sku: "120P90",
    name: "Google Home",
    price: 49.99,
    inventoryQty: 10
  },
  {
    sku: "43N23P",
    name: "MacBook Pro",
    price: 5399.99,
    inventoryQty: 5
  },
  {
    sku: "A304SD",
    name: "Alexa Speaker",
    price: 109.50,
    inventoryQty: 10
  },
  {
    sku: "234234",
    name: "Raspberry Pi B",
    price: 30.00,
    inventoryQty: 2
  }
];

export default baseProducts;
