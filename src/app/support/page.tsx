import Link from "next/link";
import { Mail, Book, MessageCircle, Github } from "lucide-react";

const channels = [
  {
    icon: Book,
    title: "Documentation",
    description: "Browse guides, API references, and tutorials.",
    cta: "Read the Docs",
    href: "/docs",
  },
  {
    icon: MessageCircle,
    title: "Community Forum",
    description:
      "Ask questions and share knowledge with other APEX developers.",
    cta: "Join the Forum",
    href: "https://community.apexplatform.dev",
  },
  {
    icon: Github,
    title: "GitHub Issues",
    description:
      "Report bugs or request features in our open-source repositories.",
    cta: "Open an Issue",
    href: "https://github.com/apex-platform",
  },
  {
    icon: Mail,
    title: "Email Support",
    description:
      "Direct support for Pro and Enterprise plans. We respond within 24 hours.",
    cta: "Send Email",
    href: "mailto:support@apexplatform.dev",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Docs
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">Support</h1>
          <p className="mt-4 text-lg text-gray-600">
            We&apos;re here to help. Choose the channel that works best for you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.title}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900">
                    {channel.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {channel.description}
                </p>
                <a
                  href={channel.href}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {channel.cta} →
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Quick Contact
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Send us a message and we&apos;ll get back to you as soon as
            possible.
          </p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="support-name" className="label">
                  Name
                </label>
                <input
                  id="support-name"
                  type="text"
                  className="input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="support-email" className="label">
                  Email
                </label>
                <input
                  id="support-email"
                  type="email"
                  className="input"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="support-subject" className="label">
                Subject
              </label>
              <input
                id="support-subject"
                type="text"
                className="input"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label htmlFor="support-message" className="label">
                Message
              </label>
              <textarea
                id="support-message"
                className="input min-h-[120px] resize-y"
                placeholder="Describe your issue or question..."
              />
            </div>
            <button type="submit" className="btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
