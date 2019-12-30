"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param {number} sleepTime Number of milliseconds to wait until resolving.
 */
const sleep = (sleepTime = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), sleepTime);
    });
};
exports.default = sleep;
//# sourceMappingURL=sleep.js.map