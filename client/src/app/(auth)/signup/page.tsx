'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Loader2, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/signup', {
        name,
        email,
        password,
      });

      const { token, user } = res.data;
      login(token, user);
      router.push('/apply');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to create account. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      {/* Decorative branding sidebar (visible on large screens) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_40%)]" />
        <div className="relative z-10 flex items-center gap-2 font-bold text-xl text-blue-400">
          <ShieldCheck className="h-6 w-6 text-blue-500" />
          <span>LMS Portal</span>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Flexible financing,<br />instant processing.
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            Our automated evaluation rules engine processes borrower profiles instantly to get your loan moving.
          </p>
        </div>
        <div className="relative z-10 text-xs text-slate-500">
          &copy; 2026 Loan Management Platform (LMS). Secure & encrypted platform.
        </div>
      </div>

      {/* Main Signup Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-slate-950/40 p-8 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <UserIcon className="h-5 w-5" />
                  </span>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xxs text-slate-500">Must be at least 8 characters</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-sm font-semibold rounded-xl text-white shadow-lg transition-colors duration-150"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
