// ─────────────────────────────────────────────────────────────────────────────
// App configuration. Everything here is public by design (publishable key,
// merchant address). No secrets, no sk_.
// ─────────────────────────────────────────────────────────────────────────────

import type { CheckoutAsset } from "@/commerce";

/** Publishable Pollar key, `pub_testnet_...`. Public by design. */
export const POLLAR_API_KEY = process.env.NEXT_PUBLIC_POLLAR_API_KEY ?? "";

/** Merchant address that receives checkout payments (G...). */
export const MERCHANT_ADDRESS = process.env.NEXT_PUBLIC_MERCHANT_ADDRESS ?? "";

/**
 * Asset the shop charges in. Set the three USDC vars to charge in USDC;
 * leave them empty to fall back to native XLM (handy for a no-trustline demo).
 */
export const CHECKOUT_ASSET: CheckoutAsset =
  process.env.NEXT_PUBLIC_USDC_CODE && process.env.NEXT_PUBLIC_USDC_ISSUER
    ? {
        type: "credit_alphanum4",
        code: process.env.NEXT_PUBLIC_USDC_CODE,
        issuer: process.env.NEXT_PUBLIC_USDC_ISSUER,
      }
    : { type: "native" };

export const ASSET_LABEL = CHECKOUT_ASSET.type === "native" ? "XLM" : CHECKOUT_ASSET.code;

/** testnet vs mainnet is inferred from the key prefix. */
export const NETWORK =
  POLLAR_API_KEY.split("_")[1] === "mainnet" ? "mainnet" : "testnet";

export const EXPLORER_TX = (hash: string) =>
  `https://stellar.expert/explorer/${NETWORK}/tx/${hash}`;
