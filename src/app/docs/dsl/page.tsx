"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DslSpecPage() {
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
            <span className="text-sm font-medium text-gray-900">DSL Specification</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DSL Specification</h1>
        <p className="text-lg text-gray-600 mb-10">AXML and ACSS language reference for building mini-app UIs.</p>

        <div className="space-y-10">
          <section id="axml">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AXML Syntax</h2>
            <p className="text-gray-600 mb-4">AXML is an XML-based template language. Use double-brace interpolation for data binding and <code className="font-mono text-sm">a:if</code> / <code className="font-mono text-sm">a:for</code> directives for control flow:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`<view class="container">
  <text>{{title}}</text>
  <view a:for="{{items}}" a:key="id">
    <text>{{item.name}}</text>
  </view>
  <button a:if="{{isLoggedIn}}" onTap="handleTap">
    Click me
  </button>
</view>`}</pre>
          </section>

          <section id="acss">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ACSS Styling</h2>
            <p className="text-gray-600 mb-4">ACSS is a subset of CSS with responsive units. Use <code className="font-mono text-sm">rpx</code> (responsive pixels) for dimensions — 750rpx equals the full screen width on any device:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">{`.page {
  padding: 0 32rpx 40rpx;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}`}</pre>
          </section>

          <section id="components">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Built-in Components</h2>
            <p className="text-gray-600 mb-4">See the <Link href="/docs/sdk#components" className="text-primary-600 hover:underline">SDK Reference → Components</Link> for the full list of built-in AXML components and their props.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
