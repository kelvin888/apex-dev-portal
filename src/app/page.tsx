"use client";

import Link from "next/link";
import { ArrowRight, Code, Rocket, Shield, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { PublicNavActions } from "@/components/public-nav-actions";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">APEX</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Documentation
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <PublicNavActions />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
            Build Mini-Apps for
            <span className="text-primary-500"> Africa</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            APEX is the leading super app platform for African markets. Build,
            deploy, and scale mini-apps that reach millions of users.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user ? "/dashboard" : "/register"}
              className="btn-primary text-base px-8 py-3"
            >
              {user ? "Go to Dashboard" : "Start Building Free"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/docs" className="btn-secondary text-base px-8 py-3">
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Everything you need to build great mini-apps
          </h2>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Code className="h-6 w-6" />}
              title="Familiar Stack"
              description="Build with JavaScript, AXML templates, and ACSS styles. If you know React, you'll feel right at home."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Blazing Fast"
              description="Dual-thread architecture delivers 60fps animations and instant interactions."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure by Design"
              description="Sandboxed execution, signed packages, and fine-grained permissions protect users."
            />
            <FeatureCard
              icon={<Rocket className="h-6 w-6" />}
              title="Easy Distribution"
              description="Publish to the APEX marketplace and reach millions of users instantly."
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <StatCard value="10M+" label="Monthly Active Users" />
            <StatCard value="5,000+" label="Mini-Apps Published" />
            <StatCard value="12" label="Countries" />
            <StatCard value="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to build the future?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of developers building on APEX.
          </p>
          <Link
            href={user ? "/dashboard" : "/register"}
            className="mt-8 btn-primary text-base px-8 py-3 inline-flex"
          >
            {user ? "Go to Dashboard" : "Create Your Account"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold">APEX</span>
              </div>
              <p className="mt-4 text-sm">
                Building Africa's native super app ecosystem.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/docs/sdk" className="hover:text-white">
                    SDK Reference
                  </Link>
                </li>
                <li>
                  <Link href="/docs/cli" className="hover:text-white">
                    CLI Tools
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
            &copy; {new Date().getFullYear()} Interswitch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold">{value}</div>
      <div className="mt-1 text-primary-200">{label}</div>
    </div>
  );
}
