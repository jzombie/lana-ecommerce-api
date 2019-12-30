"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnknownSKUError extends Error {
    constructor(sku) {
        const message = `Product with SKU "${sku}" is not a known product`;
        super(message);
        this.name = "UnknownSKUError";
    }
}
exports.default = UnknownSKUError;
//# sourceMappingURL=UnknownSKUError.js.map