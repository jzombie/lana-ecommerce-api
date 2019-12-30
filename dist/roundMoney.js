"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helps fix rounding issues with floating-point monetary calculations.
 *
 * @see https://stackoverflow.com/questions/2876536/precise-financial-calculation-in-javascript-what-are-the-gotchas
 *
 * @param {number} amount
 * @return {number} Rounded amount
 */
const roundMoney = (amount) => {
    return Math.round(amount * 100) / 100;
};
exports.default = roundMoney;
//# sourceMappingURL=roundMoney.js.map