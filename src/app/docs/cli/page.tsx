"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const commands = [
  { name: "apex create <name>", desc: "Scaffold a new mini-app project." },
  { name: "apex dev", desc: "Start a local development server with hot-reload." },
  { name: "apex build", desc: "Compile and bundle the app for production." },
  { name: "apex preview", desc: "Preview the production build locally." },
  { name: "apex login", desc: "Authenticate with the APEX registry." },
  { name: "apex logout", desc: "Clear stored credentials." },
  { name: "apex whoami", desc: "Show the currently authenticated account." },
  { name: "apex publish", desc: "Build and upload the app to the registry." },
  { name: "apex keys register <pubkey>", desc: "Register a signing certificate." },
  { name: "apex keys list", desc: "List registered signing certificates." },
  { name: "apex keys revoke <id>", desc: "Revoke a signing certificate." },
  { name: "apex doctor", desc: "Diagnose common environment issues." },
];

export default function CliReferencePage() {
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
            <span className="text-sm font-medium text-gray-900">CLI Reference</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CLI Reference</h1>
        <p className="text-lg text-gray-600 mb-10">Use the APEX CLI to build, test, and deploy mini-apps.</p>

        <div className="space-y-10">
          <section id="publish">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Commands</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-6 font-medium text-gray-900">Command</th>
                    <th className="text-left py-2 font-medium text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 divide-y">
                  {commands.map(({ name, desc }) => (
                    <tr key={name}>
                      <td className="py-2 pr-6 font-mono text-primary-600 whitespace-nowrap">{name}</td>
                      <td className="py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="dev">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Global Flags</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex gap-4"><code className="font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded shrink-0">--registry &lt;url&gt;</code><span className="self-center">Override the registry URL for all commands.</span></div>
              <div className="flex gap-4"><code className="font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded shrink-0">--version</code><span className="self-center">Print the current CLI version.</span></div>
              <div className="flex gap-4"><code className="font-mono text-primary-600 bg-primary-50 px-2 py-1 rounded shrink-0">--help</code><span className="self-center">Show help for any command.</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
