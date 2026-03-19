"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SecurityModelPage() {
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
            <span className="text-sm font-medium text-gray-900">Security Model</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Model</h1>
        <p className="text-lg text-gray-600 mb-10">Understand permissions, sandboxing, and the bridge protocol.</p>

        <div className="space-y-10">
          <section id="permissions">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Permissions</h2>
            <p className="text-gray-600 mb-4">Mini-apps declare required permissions in <code className="font-mono text-sm">app.json</code>. The host app prompts the user to grant them at install time.</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`"permissions": [
  "camera",
  "location",
  "contacts"
]`}</pre>
          </section>

          <section id="sandboxing">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sandboxing</h2>
            <p className="text-gray-600">Each mini-app runs in an isolated WebView. It has no direct access to the host app&apos;s native APIs — all communication goes through the bridge. The sandbox prevents cross-app data access and limits network requests to declared domains.</p>
          </section>

          <section id="bridge">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bridge Protocol</h2>
            <p className="text-gray-600 mb-4">The JavaScript bridge exposes a typed message-passing API between the mini-app and the native host. All calls are asynchronous and permission-checked:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`// Mini-app side
apex.call('getLocation', {}, (result) => {
  console.log(result.latitude, result.longitude);
});`}</pre>
          </section>
        </div>
      </div>
    </div>
  );
}
