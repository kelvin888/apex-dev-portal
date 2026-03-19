import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for side projects and experimentation.',
    cta: 'Start for Free',
    ctaHref: '/register',
    highlighted: false,
    features: [
      '5 published apps',
      '10,000 downloads / month',
      'Basic analytics',
      'Community support',
      'APEX CLI access',
    ],
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For indie developers and small teams shipping production apps.',
    cta: 'Start Pro Trial',
    ctaHref: '/register',
    highlighted: true,
    features: [
      'Unlimited apps',
      '500,000 downloads / month',
      'Advanced analytics & export',
      'Priority support',
      'Custom domains',
      'Webhook integrations',
      'Team members (up to 5)',
    ],
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'Custom solutions for large organisations and platforms.',
    cta: 'Contact Sales',
    ctaHref: '/support',
    highlighted: false,
    features: [
      'Everything in Pro',
      'Unlimited downloads',
      'SLA guarantee',
      'Dedicated support engineer',
      'SSO / SAML',
      'Audit logs',
      'On-premise deployment option',
    ],
  },
];

export default function PricingPage() {
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
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
              <Link href="/pricing" className="text-primary-600 font-medium">Pricing</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/register" className="btn-primary">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">Simple, transparent pricing</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border-2 ${
                plan.highlighted
                  ? 'border-primary-500 bg-white shadow-lg relative'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4">
                  {plan.price === null ? (
                    <span className="text-3xl font-bold text-gray-900">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      {plan.price > 0 && <span className="text-gray-500 ml-1">/month</span>}
                    </>
                  )}
                </div>
              </div>

              <Link
                href={plan.ctaHref}
                className={`block text-center py-2.5 rounded-lg font-medium transition-colors mb-8 ${
                  plan.highlighted
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-12">
          All plans include access to the APEX CLI, SDK, and developer portal.{' '}
          <Link href="/support" className="text-primary-600 hover:underline">Questions? Talk to us.</Link>
        </p>
      </div>
    </div>
  );
}
