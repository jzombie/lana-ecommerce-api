/**
 *
 * @param {number} sleepTime Number of milliseconds to wait until resolving.
 */
const sleep = (sleepTime: number = 1000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), sleepTime);
  });
};

export default sleep;
