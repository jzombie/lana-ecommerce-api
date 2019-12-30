import express from "express";
import Cart, { ICartItem } from "../../classes/Cart";
import handleRoute from "../handleRoute";

interface ICartRouteResponse {
  baseItems: ICartItem[];
  promoItems: ICartItem[];
  subtotal: number;
}

/**
 * Unified handling for cart API routes.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {function: Promise<any | Error>} routeHandler? The resolved return of which is
 * sent through the res (express.Response) object back to the client.
 */
const handleCartRoute = async (
  req: express.Request,
  res: express.Response,
  routeHandler?: () => Promise<any | Error>): Promise<void> => {
  await handleRoute(req, res, async (): Promise<ICartRouteResponse> => {
    if (typeof routeHandler === "function") {
      await routeHandler();
    }

    const cart = new Cart(req.session.id);

    const baseAndPromoItems = await cart.fetchBaseAndPromoItems();
    const subtotal = await cart.fetchSubtotal();

    return {
      ...baseAndPromoItems,
      subtotal
    };
  });
};

export default handleCartRoute;
