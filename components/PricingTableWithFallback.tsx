"use client";

import React from "react";
import { PricingTable } from "@clerk/nextjs";

type ClerkBillingError = Error & { code?: string };

class PricingErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback: React.ReactNode }>,
  { hasError: boolean; error?: ClerkBillingError }
> {
  state: { hasError: boolean; error?: ClerkBillingError } = { hasError: false };

  static getDerivedStateFromError(error: ClerkBillingError) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function PricingTableWithFallback() {
  return (
    <PricingErrorBoundary
      fallback={
        <div className="bg-white rounded-[14px] p-6 border border-(--border-subtle) text-center shadow-soft-sm">
          <h2 className="text-xl font-bold font-serif text-(--text-primary)">
            Billing isnt enabled yet
          </h2>
          <p className="text-(--text-secondary) mt-2">
            Clerks pricing table cant render until billing is enabled in the
            Clerk dashboard.
          </p>
          <p className="text-(--text-secondary) mt-2">
            Enable it at{" "}
            <span className="font-medium">Clerk Dashboard → Billing</span>, then
            reload this page.
          </p>
        </div>
      }
    >
      <PricingTable />
    </PricingErrorBoundary>
  );
}
