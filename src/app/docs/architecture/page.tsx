"use client";

import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";

const sections = [
  {
    id: "pillars",
    title: "Four Pillars",
    items: [
      [
        "Native Host Apps",
        "iOS (Swift) and Android (Kotlin) shells that load, sandbox, and manage the lifecycle of mini-apps.",
      ],
      [
        "Mini-App Framework",
        "Dual-thread runtime: Logic Thread (JS engine) handles state and business logic; View Thread (WebView) renders UI. Communication via JSON patches.",
      ],
      [
        "Developer Tooling",
        "JavaScript SDK, CLI, VS Code extension with AXML/ACSS syntax support, simulator, and debugger.",
      ],
      [
        "Distribution Infrastructure",
        "Developer portal, package registry (PostgreSQL + S3), CDN with edge nodes across Nigeria, Kenya, South Africa, and Ghana.",
      ],
    ],
  },
  {
    id: "bridge",
    title: "Bridge Communication",
    items: [
      [
        "Message Format",
        "JSON envelope with version, callbackId, namespace, method, params, and timestamp fields.",
      ],
      [
        "Permission Checks",
        "Every call validated against the mini-app's declared manifest permissions before execution.",
      ],
      [
        "Transport",
        "postMessage (Web), WKScriptMessageHandler / evaluateJavaScript (iOS), WebMessagePort (Android).",
      ],
      [
        "Rate Limiting",
        "Bridge calls are rate-limited per namespace (default: 10 calls/minute) to prevent abuse.",
      ],
    ],
  },
  {
    id: "security",
    title: "Security Model",
    items: [
      [
        "Sandboxing",
        "Mini-apps run in isolated WebViews with no direct DOM manipulation or native API access.",
      ],
      [
        "Code Signing",
        "All .map packages are signed; the host verifies the full signature chain before launch.",
      ],
      [
        "Least Privilege",
        "Permissions must be declared in app.json and granted by the user at install time.",
      ],
      [
        "Biometric Confirmation",
        "High-risk APIs (payment, contacts) require Face ID / fingerprint before execution.",
      ],
    ],
  },
];

export default function ArchitecturePage() {
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
              Architecture
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          System Architecture
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Full architecture overview of the APEX platform — host apps, mini-app
          framework, bridge protocol, and distribution infrastructure.
        </p>

        <a
          href="/APEX_Architecture.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors mb-12"
        >
          <Download className="h-4 w-4" />
          Download Full PDF
        </a>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-500" />
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map(([term, desc]) => (
                  <div
                    key={term}
                    className="border border-gray-100 rounded-lg p-4 hover:border-primary-200 transition-colors"
                  >
                    <p className="font-medium text-gray-900 mb-1">{term}</p>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
