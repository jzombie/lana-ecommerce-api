/**
 * Fixes issues with rounding money with floats.
 *
 * @see https://stackoverflow.com/questions/2876536/precise-financial-calculation-in-javascript-what-are-the-gotchas
 *
 * @param {number} amount
 * @return {number} Rounded amount
 */
const roundMoney = (amount: number): number => {
  return Math.round(amount * 100) / 100;
};

export default roundMoney;
