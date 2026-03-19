"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GettingStartedPage() {
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
            <span className="text-sm font-medium text-gray-900">Getting Started</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Getting Started</h1>
        <p className="text-lg text-gray-600 mb-10">Set up your environment and publish your first mini-app in minutes.</p>

        <div className="prose prose-gray max-w-none space-y-10">
          <section id="install">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Installation</h2>
            <p className="text-gray-600 mb-4">Install the APEX CLI globally via npm:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">npm install -g @qt-test/apex-cli</pre>
            <p className="text-gray-600 mt-4">Verify the installation:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">apex --version</pre>
          </section>

          <section id="first-app">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your First App</h2>
            <p className="text-gray-600 mb-4">Create a new mini-app project:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`apex create my-app
cd my-app
npm install`}</pre>

            <p className="text-gray-600 mt-6 mb-4">Start the development server:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">apex dev</pre>

            <p className="text-gray-600 mt-6 mb-4">When ready, authenticate and publish:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`apex login
apex publish`}</pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/docs/cli" className="text-primary-600 hover:underline">CLI Reference</Link> — full command documentation</li>
              <li><Link href="/docs/sdk" className="text-primary-600 hover:underline">SDK Reference</Link> — APIs and components</li>
              <li><Link href="/docs/dsl" className="text-primary-600 hover:underline">DSL Specification</Link> — AXML and ACSS syntax</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
