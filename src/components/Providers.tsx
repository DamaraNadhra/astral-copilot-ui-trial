// src/components/Providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { QueryParamProvider } from "use-query-params";
import NextAdapterApp from "next-query-params/app";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryParamProvider adapter={NextAdapterApp}>
        <TRPCReactProvider>
          <SessionProvider>{children}</SessionProvider>
        </TRPCReactProvider>
      </QueryParamProvider>
    </Suspense>
  );
}
