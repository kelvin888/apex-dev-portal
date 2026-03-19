"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PackageFormatPage() {
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
            <span className="text-sm font-medium text-gray-900">Package Format</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Package Format</h1>
        <p className="text-lg text-gray-600 mb-10">Learn how APEX mini-app packages are structured.</p>

        <div className="space-y-10">
          <section id="manifest">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manifest (<code className="text-base font-mono">app.json</code>)</h2>
            <p className="text-gray-600 mb-4">Every mini-app requires an <code className="font-mono text-sm">app.json</code> at the root:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`{
  "appId": "com.example.myapp",
  "name": "My App",
  "version": "1.0.0",
  "description": "A brief description",
  "entryPage": "pages/index/index",
  "pages": [
    "pages/index/index",
    "pages/details/details"
  ],
  "permissions": []
}`}</pre>
          </section>

          <section id="assets">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Directory Structure</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`my-app/
├── app.json          # manifest
├── app.ts            # global lifecycle
├── app.acss          # global styles
├── assets/
│   └── images/
└── pages/
    └── index/
        ├── index.axml
        ├── index.ts
        └── index.acss`}</pre>
          </section>

          <section id="versioning">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Versioning</h2>
            <p className="text-gray-600">Use <a href="https://semver.org" className="text-primary-600 hover:underline" target="_blank" rel="noreferrer">semantic versioning</a>. Each <code className="font-mono text-sm">apex publish</code> creates an immutable version. Bump the <code className="font-mono text-sm">version</code> field in <code className="font-mono text-sm">app.json</code> before each publish.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
