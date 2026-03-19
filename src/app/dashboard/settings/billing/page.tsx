"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRoleGuard } from "@/lib/auth-context";
import { CreditCard, Zap, ArrowUpRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface BillingInfo {
  plan: "free" | "pro" | "enterprise";
  appsUsed: number;
  appsLimit: number;
  nextBillingDate?: string;
  amount?: number;
  cardLast4?: string;
  cardBrand?: string;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["5 apps", "10k downloads/month", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    features: [
      "Unlimited apps",
      "500k downloads/month",
      "Priority support",
      "Analytics export",
      "Custom domains",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    features: [
      "Everything in Pro",
      "SLA guarantee",
      "Dedicated support",
      "SSO / SAML",
      "Audit logs",
    ],
  },
] as const;

function PriceDisplay({ price }: Readonly<{ price: number | null }>) {
  if (price === null)
    return <span className="text-lg font-semibold">Custom</span>;
  if (price === 0) return <>Free</>;
  return (
    <>
      ${price}
      <span className="text-sm font-normal text-gray-500">/mo</span>
    </>
  );
}

export default function BillingPage() {
  useRoleGuard("developer");
  const { data: billing, isLoading } = useQuery({
    queryKey: ["billing"],
    queryFn: () => api.get<BillingInfo>("/billing"),
  });

  const currentPlan = billing?.plan ?? "free";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/settings"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Settings
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
      </div>

      {isLoading ? (
        <div className="p-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Current plan summary */}
          <section className="card">
            <div className="card-header flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-500" />
              <h2 className="font-semibold">Current Plan</h2>
            </div>
            <div className="card-body flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900 capitalize">
                  {currentPlan} Plan
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {billing?.appsUsed ?? 0} of {billing?.appsLimit ?? 5} apps
                  used
                </div>
                {billing?.nextBillingDate && (
                  <div className="text-sm text-gray-500">
                    Next billing{" "}
                    {format(new Date(billing.nextBillingDate), "MMM d, yyyy")}
                    {billing.amount != null && ` — $${billing.amount}`}
                  </div>
                )}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, ((billing?.appsUsed ?? 0) / (billing?.appsLimit ?? 5)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* Payment method */}
          {billing?.cardLast4 && (
            <section className="card">
              <div className="card-header flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <h2 className="font-semibold">Payment Method</h2>
              </div>
              <div className="card-body flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {billing.cardBrand} •••• {billing.cardLast4}
                    </div>
                  </div>
                </div>
                <button className="btn-secondary text-sm">Update</button>
              </div>
            </section>
          )}

          {/* Plans */}
          <section className="card">
            <div className="card-header">
              <h2 className="font-semibold">Plans</h2>
            </div>
            <div className="card-body grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan) => {
                const isCurrent = plan.id === currentPlan;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border-2 p-5 flex flex-col gap-4 ${
                      isCurrent
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {plan.name}
                        </span>
                        {isCurrent && (
                          <span className="text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-gray-900">
                        <PriceDisplay price={plan.price} />
                      </div>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {!isCurrent && (
                      <button
                        className={`btn-${plan.id === "pro" ? "primary" : "secondary"} w-full flex items-center justify-center gap-1`}
                      >
                        {plan.price === null ? "Contact Sales" : "Upgrade"}
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
