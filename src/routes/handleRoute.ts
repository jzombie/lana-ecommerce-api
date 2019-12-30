import express from "express";
import logger from "../logger";

/**
 * Unified handling for API routes.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function: Promise<any | Error>} routeHandler The resolved return of which is
 * sent through the res (express.Response) object back to the client.
 */
const handleRoute = async (
  req: express.Request,
  res: express.Response,
  routeHandler: () => Promise<any | Error>): Promise<void> => {
  try {
    logger.info(`HTTP Request | ${req.method} | ${req.url}`);

    const result: any = await routeHandler() || {};

    if (typeof result === "object") {
      res.json(result);
    } else {
      throw new Error(`Unhandled response type: ${typeof result}`);
    }
  } catch (exc) {
    const errStack = exc.stack || null;
    if (errStack) {
      logger.error(JSON.stringify(errStack));
    }

    const errMsg: string = exc.message || exc.toString();
    const errName: string = exc.name || null;

    logger.error(errMsg);

    (res as any)
      .status(404)
      .json({
        error: errMsg,
        errorType: errName
      });
  }
};

export default handleRoute;
