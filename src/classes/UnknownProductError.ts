class UnknownProductError extends Error {
  constructor(sku: string) {
    const message: string = `Product with SKU "${sku}" is not a known product`;

    super(message);
    this.name = "UnknownProductError";
  }
}

export default UnknownProductError;
