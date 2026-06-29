// ─────────────────────────────────────────────────────────────────────────────
// Commerce core — types
// Channel-agnostic. No React, no Pollar, no storefront concerns live here.
// ─────────────────────────────────────────────────────────────────────────────

/** A sellable item. Priced in USDC (string, to avoid float drift). */
export interface Product {
  id: string;
  name: string;
  description: string;
  /** Price per unit in USDC, as a decimal string e.g. "12.50". */
  price: string;
  image: string;
}

/** A product plus the quantity in the cart. */
export interface CartItem {
  product: Product;
  quantity: number;
}

/** A finalized order ready to be paid. */
export interface Order {
  /** Stable id referenced in the payment memo and the confirmation. */
  id: string;
  items: CartItem[];
  /** Order total in USDC, as a decimal string. */
  total: string;
  createdAt: number;
}

/** The Pollar asset a checkout is charged in. "native" = XLM, otherwise issued. */
export type CheckoutAsset =
  | { type: "native" }
  | { type: "credit_alphanum4" | "credit_alphanum12"; code: string; issuer: string };

/** Discrete states the checkout flow can be in, the shell reacts to these. */
export type CheckoutStatus =
  | "idle" // nothing happening
  | "logged_out" // user must log in before paying
  | "unfunded" // wallet has no XLM reserve to operate
  | "insufficient_balance" // not enough of the checkout asset
  | "paying" // tx submitted, awaiting confirmation
  | "success" // paid, has a tx hash
  | "cancelled" // user backed out
  | "error"; // submit failed

export interface CheckoutResult {
  status: CheckoutStatus;
  order?: Order;
  /** Stellar transaction hash on success. */
  txHash?: string;
  /** Human-readable error when status === "error". */
  error?: string;
}
