class UnknownSKUError extends Error {
  constructor(sku: string) {
    const message: string = `Product with SKU "${sku}" is not a known product`;

    super(message);
    this.name = "UnknownSKUError";
  }
}

export default UnknownSKUError;
