'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // Default dark theme as borrower's template style

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [loanAmount, setLoanAmount] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(5.3);
  const [tenureDays, setTenureDays] = useState<number>(61);

  const [amountInput, setAmountInput] = useState<string>('10000');
  const [interestInput, setInterestInput] = useState<string>('5.3');
  const [tenureInput, setTenureInput] = useState<string>('61');

  // Calculations:
  // Interest = (P * R * Days) / 3000 (R is monthly rate)
  // Total Interest = Math.floor(Interest)
  // Total Amount = P + Total Interest
  // EMI = (P + Interest) / (Days / 30)
  const interestVal = (loanAmount * interestRate * tenureDays) / 3000;
  const totalInterest = Math.floor(interestVal);
  const totalAmount = loanAmount + totalInterest;
  const emi = (loanAmount + interestVal) / (tenureDays / 30);

  const handleAmountSlider = (val: number) => {
    setLoanAmount(val);
    setAmountInput(val.toString());
  };

  const handleAmountInput = (val: string) => {
    setAmountInput(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed)) {
      setLoanAmount(Math.min(500000, Math.max(10000, parsed)));
    }
  };

  const handleAmountBlur = () => {
    let val = parseInt(amountInput);
    if (isNaN(val) || val < 10000) {
      val = 10000;
    } else if (val > 500000) {
      val = 500000;
    }
    setLoanAmount(val);
    setAmountInput(val.toString());
  };

  const handleInterestSlider = (val: number) => {
    setInterestRate(val);
    setInterestInput(val.toString());
  };

  const handleInterestInput = (val: string) => {
    setInterestInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setInterestRate(Math.min(20, Math.max(1, parsed)));
    }
  };

  const handleInterestBlur = () => {
    let val = parseFloat(interestInput);
    if (isNaN(val) || val < 1) {
      val = 1.0;
    } else if (val > 20) {
      val = 20.0;
    }
    val = Math.round(val * 10) / 10;
    setInterestRate(val);
    setInterestInput(val.toString());
  };

  const handleTenureSlider = (val: number) => {
    setTenureDays(val);
    setTenureInput(val.toString());
  };

  const handleTenureInput = (val: string) => {
    setTenureInput(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed)) {
      setTenureDays(Math.min(365, Math.max(30, parsed)));
    }
  };

  const handleTenureBlur = () => {
    let val = parseInt(tenureInput);
    if (isNaN(val) || val < 30) {
      val = 30;
    } else if (val > 365) {
      val = 365;
    }
    setTenureDays(val);
    setTenureInput(val.toString());
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-[#F9FAFB] text-[#111827]'
    }`}>
      
      {/* ─── NAVBAR (height 56px, fully premium template & responsive links) ──── */}
      <header className={`h-[56px] border-b sticky top-0 z-50 transition-colors duration-300 ${
        theme === 'dark' ? 'border-slate-800 bg-slate-950/60 backdrop-blur' : 'border-[#E5E7EB] bg-white/80 backdrop-blur'
      }`}>
        <div className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Shield Check Icon */}
            <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-500' : 'text-[#2563EB]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span style={{ fontWeight: 600 }} className={`text-[18px] tracking-tight transition-colors duration-300 ${
              theme === 'dark' ? 'text-blue-400' : 'text-[#2563EB]'
            }`}>
              Loan Management System
            </span>
          </div>

          {/* Middle Navigation Links (as requested matching the template) */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-[13px] font-semibold text-[#FF6A00] hover:text-[#e05d00] transition-colors">
              Home
            </Link>
            <a href="#about" className={`text-[13px] font-medium transition-colors duration-200 ${
              theme === 'dark' ? 'text-slate-350 hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
            }`}>
              About
            </a>
            <a href="#solutions" className={`text-[13px] font-medium transition-colors duration-200 flex items-center gap-1 ${
              theme === 'dark' ? 'text-slate-350 hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
            }`}>
              Solutions
              <svg className="w-3 h-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a href="#why-choose-us" className={`text-[13px] font-medium transition-colors duration-200 ${
              theme === 'dark' ? 'text-slate-350 hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
            }`}>
              Why Choose Us
            </a>
            <a href="#contact" className={`text-[13px] font-medium transition-colors duration-200 ${
              theme === 'dark' ? 'text-slate-350 hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
            }`}>
              Contact
            </a>
          </div>
          
          <div className="flex items-center gap-3.5">
            {/* Orange Contact Us Button */}
            <a 
              href="#contact" 
              className="inline-flex h-[34px] items-center justify-center bg-[#FF6A00] hover:bg-[#e05d00] text-white text-[13px] font-semibold px-4 rounded-[8px] transition-colors shadow"
            >
              Contact Us
            </a>

            {/* Dark & Light Theme Changer Button */}
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-1.5 rounded-lg transition-colors duration-250 border ${
                theme === 'dark' 
                  ? 'border-slate-800 text-yellow-400 hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-650 hover:bg-slate-100'
              }`}
            >
              {theme === 'dark' ? (
                // Sun Icon (when in dark mode, click to go light)
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                // Moon Icon (when in light mode, click to go dark)
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* ─── HERO SECTION (two-column grid, 55% / 45%, dark-slate style) ──────── */}
      <section id="about" className="max-w-6xl w-full mx-auto px-5 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* Left Column (55% space mapped as col-span-7) */}
          <div className="md:col-span-7 space-y-6">
            <h1 
              style={{ letterSpacing: '-0.02em', lineHeight: 1.15 }}
              className={`text-[42px] font-semibold transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-[#111827]'
              }`}
            >
              Apply, review, approve, and manage loans in one system.
            </h1>
            
            <p 
              style={{ lineHeight: 1.6 }}
              className={`text-[16px] max-w-[420px] transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'
              }`}
            >
              Built for borrowers and operations teams. Complete the application journey from eligibility checks to loan closure.
            </p>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {user.role === 'borrower' ? (
                    <Link
                      href="/status"
                      className="inline-flex h-11 items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-[14px] font-semibold px-5 rounded-[8px] transition-colors shadow shadow-blue-950/50"
                    >
                      Track Application
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="inline-flex h-11 items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-[14px] font-semibold px-5 rounded-[8px] transition-colors shadow shadow-blue-950/50"
                    >
                      Officer Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className={`text-[14px] font-medium underline transition-colors ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-[#374151] hover:text-[#111827]'
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/apply"
                    className={`inline-flex h-11 items-center justify-center text-[14px] font-semibold px-5 rounded-[8px] transition-colors shadow-md ${
                      theme === 'dark' 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/50' 
                        : 'bg-[#111827] hover:bg-[#1f2937] text-white shadow-slate-200'
                    }`}
                  >
                    Start Application
                  </Link>
                  
                  <Link
                    href="/login"
                    className={`text-[14px] font-medium underline transition-colors ${
                      theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-[#374151] hover:text-[#111827]'
                    }`}
                  >
                    Officer Portal &rarr;
                  </Link>
                </>
              )}
            </div>

            {/* Trust Signals */}
            <div className={`flex flex-col gap-2 pt-4 text-[13px] transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-500' : 'text-[#9CA3AF]'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${theme === 'dark' ? 'text-[#10B981]' : 'text-[#16A34A]'}`}>&nbsp;&#x2713;&nbsp;</span>
                <span>Server-side BRE checks (age, salary, PAN, employment)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${theme === 'dark' ? 'text-[#10B981]' : 'text-[#16A34A]'}`}>&nbsp;&#x2713;&nbsp;</span>
                <span>Secure salary slip uploads via Multer</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${theme === 'dark' ? 'text-[#10B981]' : 'text-[#16A34A]'}`}>&nbsp;&#x2713;&nbsp;</span>
                <span>Role-based access control &mdash; 6 roles enforced on API</span>
              </div>
            </div>
          </div>

          {/* Right Column (45% space mapped as col-span-5) */}
          <div className="md:col-span-5">
            <div 
              style={{ boxShadow: theme === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)' }}
              className={`border rounded-[16px] overflow-hidden transition-colors duration-300 ${
                theme === 'dark' ? 'bg-slate-955 border-slate-800 shadow-2xl' : 'bg-white border-[#E5E7EB]'
              }`}
            >
              <img 
                src="/banking-hero.png" 
                alt="Secure Loan & Modern Digital Banking" 
                className="w-full h-auto object-cover opacity-95 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className={`border-t mx-10 transition-colors duration-300 ${theme === 'dark' ? 'border-slate-850' : 'border-[#F3F4F6]'}`} />

      {/* ─── LOAN EMI CALCULATOR SECTION ─────────────────────────────────────── */}
      <section className="max-w-6xl w-full mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <h2 className={`text-[32px] font-semibold tracking-tight transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-[#111827]'
          }`}>
            Loan EMI Calculator
          </h2>
          <p className={`text-[15px] mt-2 transition-colors duration-300 ${
            theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'
          }`}>
            Plan and Understand Your Loan!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Sliders Column */}
          <div className="md:col-span-7 space-y-8">
            
            {/* Slider 1: Loan Amount */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={`text-[15px] font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-[#374151]'}`}>Loan Amount</label>
                <div className={`flex items-center border rounded-[8px] px-3 py-1.5 transition-colors duration-300 ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-950/50 focus-within:border-blue-500' : 'border-[#E5E7EB] bg-white focus-within:border-[#2563EB]'
                }`}>
                  <input 
                    type="text" 
                    value={amountInput} 
                    onChange={(e) => handleAmountInput(e.target.value)}
                    onBlur={handleAmountBlur}
                    className={`w-[70px] bg-transparent text-right outline-none font-semibold text-[13px] transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-[#111827]'
                    }`}
                  />
                  <span className="text-slate-500 text-[11px] font-medium ml-1.5">Rs.</span>
                </div>
              </div>
              <input 
                type="range" 
                min={10000} 
                max={500000} 
                step={1000} 
                value={loanAmount} 
                onChange={(e) => handleAmountSlider(parseInt(e.target.value))}
                className={`w-full h-[6px] rounded-lg appearance-none cursor-pointer transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-slate-800 accent-blue-500' : 'bg-[#E5E7EB] accent-[#2563EB]'
                }`}
              />
            </div>

            {/* Slider 2: Interest (In Months) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={`text-[15px] font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-[#374151]'}`}>
                  Interest <span className="text-[12px] text-slate-550 font-normal">(In Months)</span>
                </label>
                <div className={`flex items-center border rounded-[8px] px-3 py-1.5 transition-colors duration-300 ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-950/50 focus-within:border-blue-500' : 'border-[#E5E7EB] bg-white focus-within:border-[#2563EB]'
                }`}>
                  <input 
                    type="text" 
                    value={interestInput} 
                    onChange={(e) => handleInterestInput(e.target.value)}
                    onBlur={handleInterestBlur}
                    className={`w-[50px] bg-transparent text-right outline-none font-semibold text-[13px] transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-[#111827]'
                    }`}
                  />
                  <span className="text-slate-500 text-[11px] font-medium ml-1.5">%</span>
                </div>
              </div>
              <input 
                type="range" 
                min={1} 
                max={20} 
                step={0.1} 
                value={interestRate} 
                onChange={(e) => handleInterestSlider(parseFloat(e.target.value))}
                className={`w-full h-[6px] rounded-lg appearance-none cursor-pointer transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-slate-800 accent-blue-500' : 'bg-[#E5E7EB] accent-[#2563EB]'
                }`}
              />
            </div>

            {/* Slider 3: Tenure */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className={`text-[15px] font-medium transition-colors duration-300 ${theme === 'dark' ? 'text-slate-300' : 'text-[#374151]'}`}>Tenure</label>
                <div className={`flex items-center border rounded-[8px] px-3 py-1.5 transition-colors duration-300 ${
                  theme === 'dark' ? 'border-slate-800 bg-slate-950/50 focus-within:border-blue-500' : 'border-[#E5E7EB] bg-white focus-within:border-[#2563EB]'
                }`}>
                  <input 
                    type="text" 
                    value={tenureInput} 
                    onChange={(e) => handleTenureInput(e.target.value)}
                    onBlur={handleTenureBlur}
                    className={`w-[50px] bg-transparent text-right outline-none font-semibold text-[13px] transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-[#111827]'
                    }`}
                  />
                  <span className="text-slate-500 text-[11px] font-medium ml-1.5">Days</span>
                </div>
              </div>
              <input 
                type="range" 
                min={30} 
                max={365} 
                step={1} 
                value={tenureDays} 
                onChange={(e) => handleTenureSlider(parseInt(e.target.value))}
                className={`w-full h-[6px] rounded-lg appearance-none cursor-pointer transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-slate-800 accent-blue-500' : 'bg-[#E5E7EB] accent-[#2563EB]'
                }`}
              />
            </div>

          </div>

          {/* Results Column */}
          <div className="md:col-span-5">
            <div 
              style={{ boxShadow: theme === 'dark' ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)' }}
              className={`border rounded-[12px] p-6 space-y-5 backdrop-blur-xl shadow-2xl transition-colors duration-300 ${
                theme === 'dark' ? 'bg-slate-950/40 border-slate-800 shadow-2xl' : 'bg-white border-[#E5E7EB] shadow-md shadow-slate-100'
              }`}
            >
              <div className="divide-y text-sm transition-colors duration-300 ${theme === 'dark' ? 'divide-slate-850' : 'divide-[#F3F4F6]'}">
                
                <div className="flex justify-between items-center py-3">
                  <span className={`text-[13px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>Loan Amount selected</span>
                  <span className={`text-[15px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>₹{loanAmount}</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className={`text-[13px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>EMI</span>
                  <span className={`text-[15px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>₹{emi.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className={`text-[13px] font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>Total Interest</span>
                  <span className={`text-[15px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-[#2563EB]'}`}>₹{totalInterest}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-none">
                  <span className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-slate-305' : 'text-[#374151]'}`}>Total Amount</span>
                  <span className={`text-[16px] font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-emerald-450' : 'text-[#16A34A]'}`}>₹{totalAmount}</span>
                </div>

              </div>

              {user && user.role === 'borrower' ? (
                <Link
                  href="/status"
                  className={`w-full py-3 rounded-[8px] text-[13px] font-semibold flex items-center justify-center gap-2 transition-all mt-6 shadow-md text-center ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/50' 
                      : 'bg-[#111827] hover:bg-[#1f2937] text-white shadow-slate-200'
                  }`}
                >
                  Track Application &rarr;
                </Link>
              ) : (
                <Link
                  href="/apply"
                  className={`w-full py-3 rounded-[8px] text-[13px] font-semibold flex items-center justify-center gap-2 transition-all mt-6 shadow-md text-center ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/50' 
                      : 'bg-[#111827] hover:bg-[#1f2937] text-white shadow-slate-200'
                  }`}
                >
                  Apply for Loan &rarr;
                </Link>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ─── DIVIDER ─────────────────────────────────────────────────────────── */}
      <div className={`border-t mx-10 transition-colors duration-300 ${theme === 'dark' ? 'border-slate-850' : 'border-[#F3F4F6]'}`} />

      {/* ─── FEATURE STRIP (two columns, styled dynamically) ─────────────────── */}
      <section id="solutions" className="max-w-6xl w-full mx-auto px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
          
          {/* Card 1 */}
          <div className={`border rounded-[10px] p-6 space-y-3 transition-all duration-300 ${
            theme === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-[#E5E7EB] shadow-sm'
          }`}>
            <span className="text-[11px] font-semibold text-slate-500 tracking-widest uppercase">
              PORTAL
            </span>
            <h3 className={`text-[15px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>
              Borrower portal
            </h3>
            
            <ul className={`space-y-2 text-[13px] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>
              <li className="flex items-center">
                <span className="inline-block w-[4px] h-[4px] rounded-full bg-slate-600 mr-2 shrink-0" />
                Eligibility check via BRE
              </li>
              <li className="flex items-center">
                <span className="inline-block w-[4px] h-[4px] rounded-full bg-slate-600 mr-2 shrink-0" />
                Salary slip upload (PDF / JPG / PNG)
              </li>
              <li className="flex items-center">
                <span className="inline-block w-[4px] h-[4px] rounded-full bg-slate-600 mr-2 shrink-0" />
                Loan configuration with live SI calculator
              </li>
              <li className="flex items-center">
                <span className="inline-block w-[4px] h-[4px] rounded-full bg-slate-600 mr-2 shrink-0" />
                Application status tracking
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className={`border rounded-[10px] p-6 space-y-3 transition-all duration-300 ${
            theme === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-[#E5E7EB] shadow-sm'
          }`}>
            <span className="text-[11px] font-semibold text-slate-500 tracking-widest uppercase">
              DASHBOARD
            </span>
            <h3 className={`text-[15px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>
              Operations dashboard
            </h3>
            
            <ul className={`space-y-2 text-[13px] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>
              <li className="flex items-center">
                <span className="inline-block w-[4px] h-[4px] rounded-full bg-slate-600 mr-2 shrink-0" />
                Sales &mdash; lead tracking
              </li>
              <li className="flex items-center">
                <span className="inline-block w-[4px] h-[4px] rounded-full bg-slate-600 mr-2 shrink-0" />
                Sanction &mdash; approve or reject with reason
              </li>
              <li className="flex items-center">
                <span className="inline-block w-[4px] h-[4px] rounded-full bg-slate-600 mr-2 shrink-0" />
                Disbursement &mdash; mark funds released
              </li>
              <li className="flex items-center">
                <span className="inline-block w-[4px] h-[4px] rounded-full bg-slate-600 mr-2 shrink-0" />
                Collection &mdash; record payments, auto-close
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ─── WHY CHOOSE US SECTION ────────────────────────────────────────── */}
      <section id="why-choose-us" className={`border-t py-16 px-10 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-[#E5E7EB]'
      }`}>
        <div className="max-w-6xl w-full mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className={`text-[13px] font-semibold tracking-wider uppercase transition-colors duration-300 ${
              theme === 'dark' ? 'text-emerald-400' : 'text-[#16A34A]'
            }`}>
              Trusted by 2M+ Customers Across India
            </span>
            <h2 className={`text-[32px] font-semibold tracking-tight transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-[#111827]'
            }`}>
              Why Choose us?
            </h2>
            <p className={`text-[15px] max-w-[500px] mx-auto leading-relaxed transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'
            }`}>
              Because getting a personal loan shouldn’t feel complicated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className={`border rounded-[10px] p-5 space-y-2 hover:border-[#FF6A00] transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-white border-[#E5E7EB] shadow-sm'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-emerald-950/50' : 'bg-[#F0FDF4]'
              }`}>
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-[#16A34A]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className={`text-[14px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>Quick Approval</h4>
              <p className={`text-[13px] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>No long waits, just instant decisions</p>
            </div>

            {/* Feature 2 */}
            <div className={`border rounded-[10px] p-5 space-y-2 hover:border-[#FF6A00] transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-white border-[#E5E7EB] shadow-sm'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-emerald-950/50' : 'bg-[#F0FDF4]'
              }`}>
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-[#16A34A]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className={`text-[14px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>Instant Disbursal</h4>
              <p className={`text-[13px] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>Get funds in minutes, fast and easy.</p>
            </div>

            {/* Feature 3 */}
            <div className={`border rounded-[10px] p-5 space-y-2 hover:border-[#FF6A00] transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-white border-[#E5E7EB] shadow-sm'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-emerald-950/50' : 'bg-[#F0FDF4]'
              }`}>
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-[#16A34A]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className={`text-[14px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>Flexible Repayment</h4>
              <p className={`text-[13px] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>Choose between 6 to 36 months</p>
            </div>

            {/* Feature 4 */}
            <div className={`border rounded-[10px] p-5 space-y-2 hover:border-[#FF6A00] transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-white border-[#E5E7EB] shadow-sm'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-emerald-950/50' : 'bg-[#F0FDF4]'
              }`}>
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-[#16A34A]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className={`text-[14px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>Trusted & Secure</h4>
              <p className={`text-[13px] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>Backed by RBI-Licensed NBFC Partners</p>
            </div>

            {/* Feature 5 */}
            <div className={`border rounded-[10px] p-5 space-y-2 hover:border-[#FF6A00] transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-white border-[#E5E7EB] shadow-sm'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-emerald-950/50' : 'bg-[#F0FDF4]'
              }`}>
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-[#16A34A]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className={`text-[14px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>Expert Support</h4>
              <p className={`text-[13px] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>Guidance throughout your loan period</p>
            </div>

            {/* Feature 6 */}
            <div className={`border rounded-[10px] p-5 space-y-2 hover:border-[#FF6A00] transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-white border-[#E5E7EB] shadow-sm'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-emerald-950/50' : 'bg-[#F0FDF4]'
              }`}>
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-[#16A34A]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h4 className={`text-[14px] font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>100% Online Process</h4>
              <p className={`text-[13px] transition-colors duration-300 ${theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'}`}>No queues, no hassle</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CONTACT US SECTION (Premium Business Feature Panel) ────────────────── */}
      <section id="contact" className={`py-16 px-10 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-50 border-[#E5E7EB]'
      }`}>
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <span className="text-[13px] font-semibold text-[#FF6A00] tracking-wider uppercase">
              Get in Touch
            </span>
            <h2 className="text-[32px] font-semibold tracking-tight">
              Contact Us
            </h2>
            <p className={`text-[15px] leading-relaxed transition-colors duration-300 ${
              theme === 'dark' ? 'text-slate-400' : 'text-[#6B7280]'
            }`}>
              Have questions about loan limits, interest rates, or eligibility checks? Reach out to our 24/7 helpdesk or locate our regional offices.
            </p>
            <div className="space-y-3 pt-2 text-[14px]">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#FF6A00] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-[#374151]'}>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#FF6A00] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-[#374151]'}>support@loanmanagementsystem.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#FF6A00] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-[#374151]'}>Bandra Kurla Complex, Mumbai, India</span>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Query submitted! Our customer relations officer will contact you shortly.'); }} className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input required type="text" className={`w-full h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-[#FF6A00] transition ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#E5E7EB] text-[#111827]'
                }`} placeholder="Rohit Sharma" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input required type="email" className={`w-full h-11 border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-[#FF6A00] transition ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#E5E7EB] text-[#111827]'
                }`} placeholder="rohit@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Query Message</label>
              <textarea required rows={4} className={`w-full border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#FF6A00] transition resize-none ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#E5E7EB] text-[#111827]'
              }`} placeholder="Describe your question in detail here..."></textarea>
            </div>
            <button type="submit" className="h-11 px-6 bg-[#FF6A00] hover:bg-[#e05d00] text-white text-[13px] font-semibold rounded-xl shadow transition-colors w-full sm:w-auto">
              Submit Message
            </button>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className={`border-t py-[18px] px-10 text-center mt-auto transition-colors duration-300 ${
        theme === 'dark' ? 'border-slate-850 bg-slate-950 text-slate-500' : 'border-[#E5E7EB] bg-white text-slate-400'
      }`}>
        <p className="text-[12px] font-medium tracking-wide">
          &copy; 2025 Loan Management System
        </p>
      </footer>

    </div>
  );
}
