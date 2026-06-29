"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Commerce core — useCheckout
// The checkout flow logic with its states, decoupled from any UI. The shell
// renders against `status` and calls `pay()`. Wallet/login is consumed from the
// Pollar SDK, never reimplemented.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useState } from "react";
import { usePollar } from "@pollar/react";
import { buildCheckoutPayment } from "./buildCheckoutPayment";
import type { CheckoutAsset, CheckoutResult, Order } from "./types";

export interface UseCheckoutArgs {
  /** Merchant address that receives the payment. */
  merchant: string;
  /** Asset to charge in (USDC when configured, else native). */
  asset: CheckoutAsset;
}

export interface UseCheckout extends CheckoutResult {
  /** True while a payment is in flight. */
  isPaying: boolean;
  /** Whether the user still needs to log in. */
  needsLogin: boolean;
  /** Run the full pay step for a frozen order. */
  pay: (order: Order) => Promise<CheckoutResult>;
  /** Reset back to idle (e.g. shell unmounts the confirmation). */
  reset: () => void;
  /** Mark the flow cancelled (user backed out). */
  cancel: () => void;
}

export function useCheckout({ merchant, asset }: UseCheckoutArgs): UseCheckout {
  const pollar = usePollar() as {
    isAuthenticated: boolean;
    walletAddress?: string;
    getClient: () => import("@pollar/core").PollarClient;
  };
  const [result, setResult] = useState<CheckoutResult>({ status: "idle" });

  const reset = useCallback(() => setResult({ status: "idle" }), []);
  const cancel = useCallback(() => setResult({ status: "cancelled" }), []);

  const pay = useCallback(
    async (order: Order): Promise<CheckoutResult> => {
      if (!pollar.isAuthenticated) {
        const r: CheckoutResult = { status: "logged_out", order };
        setResult(r);
        return r;
      }

      setResult({ status: "paying", order });
      try {
        const client = pollar.getClient();

        // Pre-flight: make sure the wallet can actually pay.
        if (pollar.walletAddress) {
          const { balances } = await client.getWalletBalance(
            pollar.walletAddress,
          );
          const native = balances.find((b) => b.code === "XLM");
          if (!native || parseFloat(native.balance) <= 0) {
            const r: CheckoutResult = { status: "unfunded", order };
            setResult(r);
            return r;
          }
          const payCode = asset.type === "native" ? "XLM" : asset.code;
          const payBal = balances.find((b) => b.code === payCode);
          if (!payBal || parseFloat(payBal.balance) < parseFloat(order.total)) {
            const r: CheckoutResult = { status: "insufficient_balance", order };
            setResult(r);
            return r;
          }
        }

        const { txHash } = await buildCheckoutPayment({
          client,
          to: merchant,
          amount: order.total,
          orderId: order.id,
          asset,
        });

        const r: CheckoutResult = { status: "success", order, txHash };
        setResult(r);
        return r;
      } catch (err) {
        const r: CheckoutResult = {
          status: "error",
          order,
          error: err instanceof Error ? err.message : "Payment failed",
        };
        setResult(r);
        return r;
      }
    },
    [pollar, merchant, asset],
  );

  return {
    ...result,
    isPaying: result.status === "paying",
    needsLogin: !pollar.isAuthenticated,
    pay,
    reset,
    cancel,
  };
}
