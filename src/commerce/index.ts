// ─────────────────────────────────────────────────────────────────────────────
// Commerce core — public surface
// This is the reusable part. Build another e-commerce by keeping this folder and
// replacing src/storefront/. Nothing here imports from the storefront.
// ─────────────────────────────────────────────────────────────────────────────

export type {
  Product,
  CartItem,
  Order,
  CheckoutAsset,
  CheckoutStatus,
  CheckoutResult,
} from "./types";

export { CartProvider, useCart, useCartState, type UseCart } from "./useCart";
export { useCheckout, type UseCheckout, type UseCheckoutArgs } from "./useCheckout";
export {
  buildCheckoutPayment,
  type BuildCheckoutPaymentArgs,
  type BuildCheckoutPaymentResult,
} from "./buildCheckoutPayment";
