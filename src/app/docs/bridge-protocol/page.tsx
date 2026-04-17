"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BridgeProtocolPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link
              href="/docs"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Docs
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-medium text-gray-900">
              Bridge Protocol
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bridge Protocol
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Secure, two-way communication between mini-app JavaScript and native
          device APIs.
        </p>

        <div className="space-y-10">
          <section id="overview">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Overview
            </h2>
            <p className="text-gray-600 mb-4">
              The JS Bridge (JSB) is the most critical component of the
              platform. All bridge calls are asynchronous, permission-checked,
              and versioned. The mini-app never has direct access to native
              APIs — every call goes through the bridge.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-gray-900">
                      Principle
                    </th>
                    <th className="text-left py-2 font-medium text-gray-900">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Async First", "All bridge calls are Promise-based"],
                    [
                      "Type Safe",
                      "Strongly typed request/response schemas",
                    ],
                    [
                      "Permission Aware",
                      "Every API checks against granted permissions",
                    ],
                    [
                      "Versioned",
                      "Protocol version negotiated at runtime",
                    ],
                    [
                      "Auditable",
                      "All calls logged for debugging and security",
                    ],
                  ].map(([principle, desc]) => (
                    <tr key={principle}>
                      <td className="py-2 pr-4 font-medium text-gray-700">
                        {principle}
                      </td>
                      <td className="py-2 text-gray-600">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="message-format">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Message Format
            </h2>
            <p className="text-gray-600 mb-4">
              Every bridge call serialises to a JSON envelope:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`{
  "version": "1.0.0",
  "callbackId": "cb_1678901234567_001",
  "namespace": "device",
  "method": "vibrate",
  "params": { "duration": 100, "pattern": "light" },
  "timestamp": 1678901234567
}`}</pre>
          </section>

          <section id="namespaces">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              API Namespaces
            </h2>
            <p className="text-gray-600 mb-4">
              Bridge APIs are grouped by namespace:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                "device",
                "storage",
                "network",
                "payment",
                "location",
                "media",
                "ui",
                "auth",
              ].map((ns) => (
                <code
                  key={ns}
                  className="block bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm font-mono text-gray-700"
                >
                  {ns}
                </code>
              ))}
            </div>
          </section>

          <section id="example">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Example Call
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`// Mini-app side
const result = await apex.payment.request({
  amount: 5000,
  currency: 'NGN',
  description: 'Order #1234',
});

if (result.success) {
  console.log('Transaction ID:', result.data.transactionId);
}`}</pre>
          </section>

          <section id="errors">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Error Codes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-gray-900">
                      Code
                    </th>
                    <th className="text-left py-2 font-medium text-gray-900">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    [
                      "PERMISSION_DENIED",
                      "Mini-app does not have the required permission",
                    ],
                    [
                      "UNKNOWN_NAMESPACE",
                      "Namespace not registered on this host",
                    ],
                    [
                      "INVALID_PARAMS",
                      "Request parameters failed schema validation",
                    ],
                    [
                      "RATE_LIMITED",
                      "Call frequency exceeded the allowed limit",
                    ],
                    [
                      "USER_CANCELLED",
                      "User dismissed the native permission prompt",
                    ],
                  ].map(([code, meaning]) => (
                    <tr key={code}>
                      <td className="py-2 pr-4 font-mono text-sm text-red-600">
                        {code}
                      </td>
                      <td className="py-2 text-gray-600">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
