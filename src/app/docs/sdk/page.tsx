"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SdkReferencePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/docs" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Docs
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-medium text-gray-900">SDK Reference</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SDK Reference</h1>
        <p className="text-lg text-gray-600 mb-10">Full API reference for the APEX JavaScript SDK.</p>

        <div className="space-y-10">
          <section id="overview">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600 mb-4">Install the SDK in your mini-app:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">npm install @qt-test/apex-sdk</pre>
          </section>

          <section id="components">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Components</h2>
            <p className="text-gray-600 mb-4">The SDK provides core UI primitives via AXML tags:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-6 font-medium text-gray-900">Component</th>
                    <th className="text-left py-2 font-medium text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y">
                  {[["<view>", "Generic container (like div)"],["<text>", "Inline text node"],["<image>", "Image element with src prop"],["<input>", "Text input field"],["<button>", "Tappable button"],["<scroll-view>", "Scrollable container"],].map(([tag, desc]) => (
                    <tr key={tag}>
                      <td className="py-2 pr-6 font-mono text-primary-600">{tag}</td>
                      <td className="py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="hooks">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Hooks</h2>
            <div className="space-y-4">
              {[["useRouter()", "Navigate between pages"],["useQuery()", "Fetch and cache data"],["useStorage()", "Persistent key-value store"],["useAuth()", "Access current user session"],].map(([hook, desc]) => (
                <div key={hook} className="flex gap-4">
                  <code className="font-mono text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded shrink-0">{hook}</code>
                  <span className="text-gray-600 self-center">{desc}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
