interface IDbBaseProduct {
  sku: string;
  name: string;
  price: number;
  inventory_qty: number;
}

const baseProducts: IDbBaseProduct[] = [
  {
    sku: "120P90",
    name: "Google Home",
    price: 49.99,
    inventory_qty: 10
  },
  {
    sku: "43N23P",
    name: "MacBook Pro",
    price: 5399.99,
    inventory_qty: 5
  },
  {
    sku: "A304SD",
    name: "Alexa Speaker",
    price: 109.50,
    inventory_qty: 10
  },
  {
    sku: "234234",
    name: "Raspberry Pi B",
    price: 30.00,
    inventory_qty: 2
  }
];

export default baseProducts;
