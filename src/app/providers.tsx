"use client";

// ─────────────────────────────────────────────────────────────────────────────
// App-level providers: Pollar SDK + the commerce cart. The storefront shell and
// the commerce core both mount under here.
// ─────────────────────────────────────────────────────────────────────────────

import { PollarProvider } from "@pollar/react";
import "@pollar/react/styles.css";
import { CartProvider } from "@/commerce";
import { POLLAR_API_KEY } from "@/config";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // PollarProvider builds its client from a PollarClientConfig ({ apiKey }).
  return (
    <PollarProvider client={{ apiKey: POLLAR_API_KEY }}>
      <CartProvider>{children}</CartProvider>
    </PollarProvider>
  );
}
