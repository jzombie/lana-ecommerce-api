"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnknownProductError extends Error {
    constructor(sku) {
        const message = `Product with SKU "${sku}" is not a known product`;
        super(message);
        this.name = "UnknownProductError";
    }
}
exports.default = UnknownProductError;
//# sourceMappingURL=UnknownProductError.js.map