"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-lg">APEX</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: March 17, 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the APEX developer portal and platform
              (&quot;Service&quot;), you agree to be bound by these Terms of
              Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Use of the Service
            </h2>
            <p>
              You may use the Service only for lawful purposes and in accordance
              with these Terms. You agree not to use the Service to publish apps
              that contain malware, violate intellectual property rights, or
              facilitate illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Developer Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials, including API keys. You are responsible for
              all activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. App Review
            </h2>
            <p>
              All apps submitted to the APEX platform are subject to review. We
              reserve the right to reject or remove any app that violates our
              policies, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Intellectual Property
            </h2>
            <p>
              You retain ownership of the apps and content you publish. By
              submitting an app, you grant APEX a non-exclusive licence to
              distribute and display it through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Termination
            </h2>
            <p>
              We may suspend or terminate your access to the Service at any time
              for violation of these Terms. You may delete your account at any
              time from the Settings page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, APEX shall not be liable
              for indirect, incidental, or consequential damages arising from
              your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Contact
            </h2>
            <p>
              For questions about these Terms, please contact us via the{" "}
              <Link
                href="/support"
                className="text-primary-600 hover:underline"
              >
                Support page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
