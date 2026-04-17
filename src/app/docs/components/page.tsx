"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const components = [
  {
    id: "view",
    name: "view",
    desc: "Generic container component, equivalent to <div> in HTML.",
    code: `<view class="container" style="padding: 20rpx;">
  <view class="inner">Content</view>
</view>`,
    attrs: [
      ["class", "string", "CSS class names"],
      ["style", "string", "Inline styles"],
      ["id", "string", "Element ID"],
      ["hidden", "boolean", "Hide element"],
      ["onTap", "handler", "Tap event"],
      ["onLongPress", "handler", "Long press event"],
    ],
  },
  {
    id: "scroll-view",
    name: "scroll-view",
    desc: "Scrollable container with scroll position control and boundary events.",
    code: `<scroll-view
  scroll-y
  style="height: 500rpx;"
  onScrollToLower="loadMore"
>
  <view a:for="{{items}}" a:key="id">{{item.name}}</view>
</scroll-view>`,
    attrs: [
      ["scroll-x", "boolean", "Enable horizontal scroll"],
      ["scroll-y", "boolean", "Enable vertical scroll"],
      ["scroll-top", "number", "Scroll position from top"],
      ["lower-threshold", "number", "Lower boundary threshold (px)"],
      ["onScroll", "handler", "Scroll event"],
      ["onScrollToLower", "handler", "Reached bottom"],
    ],
  },
  {
    id: "swiper",
    name: "swiper",
    desc: "Carousel / slider with autoplay and circular mode.",
    code: `<swiper indicator-dots autoplay circular interval="5000">
  <swiper-item a:for="{{banners}}" a:key="id">
    <image src="{{item.image}}" mode="aspectFill" />
  </swiper-item>
</swiper>`,
    attrs: [
      ["indicator-dots", "boolean", "Show dot indicators"],
      ["autoplay", "boolean", "Auto advance slides"],
      ["circular", "boolean", "Loop slides"],
      ["interval", "number", "Autoplay interval (ms)"],
      ["duration", "number", "Transition duration (ms)"],
      ["onChange", "handler", "Slide changed"],
    ],
  },
  {
    id: "text",
    name: "text",
    desc: "Inline text node. Supports selection and HTML entity decoding.",
    code: `<text selectable decode>Price: &amp;5,000</text>`,
    attrs: [
      ["selectable", "boolean", "Allow text selection"],
      ["decode", "boolean", "Decode HTML entities"],
      ["space", "string", "Space handling: ensp | emsp | nbsp"],
      ["numberOfLines", "number", "Max lines before truncation"],
    ],
  },
  {
    id: "button",
    name: "button",
    desc: "Tappable button with size, type, and loading state variants.",
    code: `<button
  type="primary"
  size="default"
  loading="{{isLoading}}"
  onTap="handleTap"
>
  Pay Now
</button>`,
    attrs: [
      ["type", "string", "primary | default | warn"],
      ["size", "string", "default | mini"],
      ["loading", "boolean", "Show loading spinner"],
      ["disabled", "boolean", "Disable interaction"],
      ["onTap", "handler", "Tap event"],
    ],
  },
  {
    id: "input",
    name: "input",
    desc: "Single-line text input with keyboard type and confirmation handling.",
    code: `<input
  type="number"
  placeholder="Enter amount"
  value="{{amount}}"
  onInput="handleInput"
  onConfirm="handleConfirm"
/>`,
    attrs: [
      ["type", "string", "text | number | idcard | digit"],
      ["placeholder", "string", "Placeholder text"],
      ["value", "string", "Controlled value"],
      ["maxlength", "number", "Max character count"],
      ["password", "boolean", "Mask input"],
      ["onInput", "handler", "Value changed"],
      ["onConfirm", "handler", "Keyboard confirm tapped"],
    ],
  },
  {
    id: "image",
    name: "image",
    desc: "Image component with crop and scale modes, and lazy loading.",
    code: `<image
  src="{{item.cover}}"
  mode="aspectFill"
  lazy-load
  onLoad="handleLoad"
/>`,
    attrs: [
      ["src", "string", "Image URL or local path"],
      ["mode", "string", "scaleToFill | aspectFit | aspectFill | widthFix"],
      ["lazy-load", "boolean", "Lazy load when in viewport"],
      ["onLoad", "handler", "Image loaded"],
      ["onError", "handler", "Load failed"],
    ],
  },
  {
    id: "navigator",
    name: "navigator",
    desc: "Declarative page navigation link.",
    code: `<navigator
  url="/pages/detail/index?id={{item.id}}"
  open-type="navigate"
>
  View Details
</navigator>`,
    attrs: [
      ["url", "string", "Target page path"],
      [
        "open-type",
        "string",
        "navigate | redirect | switchTab | reLaunch | navigateBack",
      ],
      ["delta", "number", "Steps back (navigateBack only)"],
    ],
  },
];

export default function ComponentReferencePage() {
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
              Component Reference
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Component Reference
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Built-in AXML components available to every APEX mini-app.
        </p>

        {/* Jump links */}
        <div className="flex flex-wrap gap-2 mb-10">
          {components.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="text-xs font-mono bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-700 px-2.5 py-1 rounded-full transition-colors"
            >
              {`<${c.name}>`}
            </a>
          ))}
        </div>

        <div className="space-y-14">
          {components.map((c) => (
            <section key={c.id} id={c.id}>
              <h2 className="text-xl font-semibold text-gray-900 mb-1 font-mono">
                {`<${c.name}>`}
              </h2>
              <p className="text-gray-600 mb-4">{c.desc}</p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-4">
                {c.code}
              </pre>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium text-gray-900">
                        Attribute
                      </th>
                      <th className="text-left py-2 pr-4 font-medium text-gray-900">
                        Type
                      </th>
                      <th className="text-left py-2 font-medium text-gray-900">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {c.attrs.map(([attr, type, desc]) => (
                      <tr key={attr}>
                        <td className="py-2 pr-4 font-mono text-xs text-gray-700">
                          {attr}
                        </td>
                        <td className="py-2 pr-4 font-mono text-xs text-primary-600">
                          {type}
                        </td>
                        <td className="py-2 text-gray-600">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
