// ─────────────────────────────────────────────────────────────────────────────
// Commerce core — buildCheckoutPayment
// THE single isolated payment function. Every storefront on top of this core
// pays through here. To move to a different Pollar adapter later, change ONLY
// this file: the shell and the checkout flow never touch the SDK directly.
// ─────────────────────────────────────────────────────────────────────────────

import type { PollarClient } from "@pollar/core";
import type { CheckoutAsset } from "./types";

export interface BuildCheckoutPaymentArgs {
  /** Pollar client obtained from usePollar().getClient(). */
  client: PollarClient;
  /** Merchant destination address (G...). */
  to: string;
  /** Amount in the checkout asset, as a decimal string. */
  amount: string;
  /** Order id — written to the tx memo so the payment references the order. */
  orderId: string;
  /** Asset to charge in. Defaults to USDC if configured, else native XLM. */
  asset: CheckoutAsset;
}

export interface BuildCheckoutPaymentResult {
  /** Stellar transaction hash. */
  txHash: string;
}

/**
 * Build + submit a single payment via the Pollar SDK. Pollar signs custodially
 * server-side; we only call `runTx`. Memo carries the order id (≤28 bytes for a
 * MEMO_TEXT, so we truncate defensively).
 */
export async function buildCheckoutPayment({
  client,
  to,
  amount,
  orderId,
  asset,
}: BuildCheckoutPaymentArgs): Promise<BuildCheckoutPaymentResult> {
  await client.ready();

  // MEMO_TEXT is capped at 28 bytes; the order id is the payment reference.
  const memo = orderId.slice(0, 28);

  // runTx builds + custodially signs + submits in one call, returning a
  // SubmitOutcome discriminated union ({ status: 'success' | 'pending' | 'error' }).
  // params carry { destination, amount, asset }; the memo lives in options.
  const res = await client.runTx(
    "payment",
    { destination: to, amount, asset },
    { memo: { type: "text", value: memo } },
  );

  if (res.status === "error") {
    throw new Error(res.details ?? res.resultCode ?? "Payment failed on submit.");
  }

  // success | pending both carry the tx hash.
  return { txHash: res.hash };
}
