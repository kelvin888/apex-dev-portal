'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: (emailAddress: string) =>
      api.post('/auth/forgot-password', { email: emailAddress }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="font-semibold text-xl">APEX</span>
        </Link>

        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-200">
          {mutation.isSuccess ? (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-success-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-600 mb-6">
                If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link.
              </p>
              <Link href="/login" className="text-sm text-primary-600 hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="label">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-9"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                {mutation.isError && (
                  <div className="bg-error-50 border border-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
                    {(mutation.error as { message?: string })?.message ?? 'Something went wrong. Please try again.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending || !email}
                  className="btn-primary w-full justify-center"
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-primary-600 hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
