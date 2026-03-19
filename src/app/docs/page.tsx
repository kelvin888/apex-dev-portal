import Link from 'next/link';
import { ArrowRight, Book, Code, Terminal, Package, Shield, Zap } from 'lucide-react';

const sections = [
  {
    icon: Zap,
    title: 'Getting Started',
    description: 'Set up your environment and publish your first mini-app in minutes.',
    href: '/docs/getting-started',
    links: [
      { label: 'Quick Start', href: '/docs/getting-started' },
      { label: 'Installation', href: '/docs/getting-started#install' },
      { label: 'Your First App', href: '/docs/getting-started#first-app' },
    ],
  },
  {
    icon: Code,
    title: 'SDK Reference',
    description: 'Full API reference for the APEX JavaScript SDK.',
    href: '/docs/sdk',
    links: [
      { label: 'Overview', href: '/docs/sdk' },
      { label: 'Components', href: '/docs/sdk#components' },
      { label: 'Hooks', href: '/docs/sdk#hooks' },
    ],
  },
  {
    icon: Terminal,
    title: 'CLI Tools',
    description: 'Use the APEX CLI to build, test, and deploy mini-apps.',
    href: '/docs/cli',
    links: [
      { label: 'CLI Reference', href: '/docs/cli' },
      { label: 'apex publish', href: '/docs/cli#publish' },
      { label: 'apex dev', href: '/docs/cli#dev' },
    ],
  },
  {
    icon: Package,
    title: 'Package Format',
    description: 'Learn how APEX mini-app packages are structured.',
    href: '/docs/package-format',
    links: [
      { label: 'Manifest', href: '/docs/package-format#manifest' },
      { label: 'Assets', href: '/docs/package-format#assets' },
      { label: 'Versioning', href: '/docs/package-format#versioning' },
    ],
  },
  {
    icon: Shield,
    title: 'Security Model',
    description: 'Understand permissions, sandboxing, and the bridge protocol.',
    href: '/docs/security',
    links: [
      { label: 'Permissions', href: '/docs/security#permissions' },
      { label: 'Sandboxing', href: '/docs/security#sandboxing' },
      { label: 'Bridge Protocol', href: '/docs/security#bridge' },
    ],
  },
  {
    icon: Book,
    title: 'DSL Specification',
    description: 'AXML and ACSS language reference for building UIs.',
    href: '/docs/dsl',
    links: [
      { label: 'AXML Syntax', href: '/docs/dsl#axml' },
      { label: 'ACSS Styling', href: '/docs/dsl#acss' },
      { label: 'Built-in Components', href: '/docs/dsl#components' },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">APEX</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/docs" className="text-primary-600 font-medium">Docs</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/register" className="btn-primary">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">Documentation</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale APEX mini-apps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="border border-gray-200 rounded-xl p-6 hover:border-primary-300 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900">{section.title}</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                <ul className="space-y-1">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
