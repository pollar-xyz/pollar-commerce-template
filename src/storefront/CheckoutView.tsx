"use client";

// Storefront shell — checkout screen. This is the canonical example of a shell
// consuming the commerce core: it renders against useCheckout().status and calls
// pay(order). It never touches the Pollar SDK's payment logic directly — that
// lives in the core's buildCheckoutPayment.

import { useMemo, useState } from "react";
import Link from "next/link";
import { WalletButton, usePollar } from "@pollar/react";
import { useCart, useCheckout, type Order } from "@/commerce";
import { ASSET_LABEL, CHECKOUT_ASSET, EXPLORER_TX, MERCHANT_ADDRESS } from "@/config";

export function CheckoutView() {
  const { items, total, clear } = useCart();
  const { isAuthenticated } = usePollar() as { isAuthenticated: boolean };
  const checkout = useCheckout({ merchant: MERCHANT_ADDRESS, asset: CHECKOUT_ASSET });
  const [order, setOrder] = useState<Order | null>(null);

  // Freeze the cart into an order the first time we render with items.
  const frozen = useMemo<Order>(() => {
    const o: Order = {
      id: order?.id ?? `ord_${Math.floor(performance.now()).toString(36)}`,
      items,
      total,
      createdAt: Date.now(),
    };
    return o;
  }, [items, total, order?.id]);

  if (checkout.status === "success" && checkout.order) {
    return (
      <Confirmation
        orderId={checkout.order.id}
        total={checkout.order.total}
        txHash={checkout.txHash!}
        onDone={() => {
          clear();
          checkout.reset();
        }}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium">Nothing to check out</p>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-violet-600 px-4 py-2 text-white">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

      <div className="rounded-2xl border border-neutral-200 p-4">
        <p className="text-sm text-neutral-500">Paying</p>
        <p className="font-mono text-2xl font-bold">
          {total} <span className="text-base text-neutral-500">{ASSET_LABEL}</span>
        </p>
        <p className="mt-2 break-all text-xs text-neutral-400">
          to {MERCHANT_ADDRESS || "(set NEXT_PUBLIC_MERCHANT_ADDRESS)"}
        </p>
      </div>

      <StatusBanner status={checkout.status} error={checkout.error} />

      {!isAuthenticated ? (
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">Log in with Pollar to pay.</p>
          <WalletButton />
        </div>
      ) : (
        <button
          disabled={checkout.isPaying || !MERCHANT_ADDRESS}
          onClick={() => {
            setOrder(frozen);
            void checkout.pay(frozen);
          }}
          className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          {checkout.isPaying ? "Paying…" : `Pay ${total} ${ASSET_LABEL}`}
        </button>
      )}

      <Link href="/cart" className="block text-center text-sm text-neutral-500 hover:underline">
        Back to cart
      </Link>
    </div>
  );
}

function StatusBanner({ status, error }: { status: string; error?: string }) {
  const map: Record<string, { text: string; cls: string } | undefined> = {
    unfunded: {
      text: "Your wallet has no XLM yet — fund it on testnet (friendbot) before paying.",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    insufficient_balance: {
      text: "Not enough balance to cover this order.",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    error: {
      text: error ?? "Payment failed. Please try again.",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
    cancelled: {
      text: "Payment cancelled.",
      cls: "bg-neutral-50 text-neutral-600 border-neutral-200",
    },
  };
  const m = map[status];
  if (!m) return null;
  return <div className={`rounded-xl border px-4 py-3 text-sm ${m.cls}`}>{m.text}</div>;
}

function Confirmation({
  orderId,
  total,
  txHash,
  onDone,
}: {
  orderId: string;
  total: string;
  txHash: string;
  onDone: () => void;
}) {
  return (
    <div className="mx-auto max-w-md space-y-6 py-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <div>
        <h1 className="text-2xl font-bold">Payment confirmed</h1>
        <p className="text-neutral-500">
          Order <span className="font-mono">{orderId}</span> · {total} {ASSET_LABEL}
        </p>
      </div>
      <a
        href={EXPLORER_TX(txHash)}
        target="_blank"
        rel="noreferrer"
        className="inline-block break-all rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
      >
        View transaction ↗
      </a>
      <button
        onClick={onDone}
        className="block w-full rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700"
      >
        Done
      </button>
    </div>
  );
}
