# Pollar Commerce Template

The **base e-commerce template** every other Pollar storefront builds on: a small but real shop (catalog → product → cart → checkout → confirmation) that charges in **USDC** with [Pollar](https://pollar.xyz) on Stellar testnet.

The point isn't the shop — it's the **architecture**. A reusable, channel-agnostic **commerce core** (`src/commerce/`) is kept cleanly separate from a swappable **storefront shell** (`src/storefront/`). Other commerce templates (a Telegram Mini App shop, an embedded checkout widget) are built on top of this by replacing only the shell.

```
src/
├── commerce/        ← the reusable core (keep this)
│   ├── types.ts            Product, CartItem, Order, CheckoutAsset, states
│   ├── useCart.tsx         add / remove / update qty / total / clear
│   ├── buildCheckoutPayment.ts   the ONE isolated pay function (uses the SDK)
│   ├── useCheckout.tsx     checkout flow + states (login → pay → confirm)
│   └── index.ts            public surface
└── storefront/      ← the reference shell (replace this for a new shop)
    ├── StoreHeader, ProductCard, ProductDetail, CartView, CheckoutView
    └── catalog.ts          loads the static JSON catalog
```

The whole app is **client-side**. The publishable key (`pub_testnet_...`, public by design) goes in `NEXT_PUBLIC_POLLAR_API_KEY`. No backend, no secret key, no orders database — the catalog is a static JSON file.

---

## Run the shop

**Requirements:** Node ≥ 20, a Pollar publishable key, a merchant testnet address.

1. **Get a key** — self-serve at [dashboard.pollar.xyz](https://dashboard.pollar.xyz). It looks like `pub_testnet_...` and is public by design.
2. **Get a merchant address** — your own testnet `G...` address to receive the USDC.
3. **Configure**

   ```bash
   cp .env.example .env.local
   ```

   ```dotenv
   NEXT_PUBLIC_POLLAR_API_KEY=pub_testnet_xxx
   NEXT_PUBLIC_MERCHANT_ADDRESS=G...
   # optional — charge in USDC instead of native XLM:
   # NEXT_PUBLIC_USDC_CODE=USDC
   # NEXT_PUBLIC_USDC_ISSUER=G...
   ```

4. **Install & run**

   ```bash
   pnpm install
   pnpm dev
   ```

5. Open <http://localhost:3000> → browse → add to cart → checkout → **log in with Pollar** → pay → confirmation with the tx link.

> **Funds:** use [friendbot](https://friendbot.stellar.org) for XLM on testnet. To charge in USDC, set the buyer up with a testnet USDC trustline + balance; otherwise leave the USDC vars empty and the shop charges native XLM (no trustline needed — ideal for a quick demo).

---

## Build another e-commerce on top

This is the whole reason the code is split the way it is. To build a different storefront (a Telegram Mini App, an embedded widget, a one-product landing page…):

1. **Keep `src/commerce/` untouched.** You get the cart, the order model, the isolated payment, and the full checkout flow with all its states for free.
2. **Replace `src/storefront/`** with your own shell. Your shell only needs to:
   - render products however it likes (different catalog source, different layout);
   - call `useCart()` for cart state;
   - render against `useCheckout({ merchant, asset })` — read `status` / `isPaying` and call `pay(order)`.

A minimal new shell is just:

```tsx
import { useCart, useCheckout } from "@/commerce";

function MyCheckout() {
  const { total, toOrder } = useCart();
  const { status, isPaying, pay } = useCheckout({ merchant: MERCHANT, asset: ASSET });

  return (
    <button disabled={isPaying} onClick={() => pay(toOrder())}>
      Pay {total}
    </button>
  );
  // status walks through: logged_out → paying → success | error | unfunded | …
}
```

You never touch the Pollar payment logic. If Pollar's payment API changes, only `src/commerce/buildCheckoutPayment.ts` changes — every shell keeps working.

---

## What the SDK provides (and we don't reimplement)

- **Login** — `WalletButton` / `usePollar().login()`.
- **Custodial signing & submit** — `getClient().runTx("payment", { destination, asset, amount, memo })`.
- **Balances** — `getClient().getWalletBalance(address)`.

`PollarProvider` is mounted once in `src/app/providers.tsx`; everything consumes `usePollar()`.

## Tech

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind 4 · `@pollar/core@^0.9.0` · `@pollar/react@^0.9.0`. No extra runtime deps, no state library — `useCart` is plain React context.

## Demo

A short testnet walkthrough (browse → cart → checkout → login → pay → confirmation) is linked in the PR / submission.
