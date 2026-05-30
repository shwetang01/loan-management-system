'use client';

import React, { useState } from 'react';
import Slider from '../ui/Slider';

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [tenure, setTenure] = useState(12);
  const [rate, setRate] = useState(11.5);

  const calculateEmi = () => {
    const r = rate / 12 / 100;
    const n = tenure;
    if (r === 0) return (principal / n).toFixed(2);
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(emi) ? '0.00' : emi.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <Slider
        id="principal"
        label="Principal Amount"
        min={1000}
        max={100000}
        step={500}
        value={principal}
        onChange={setPrincipal}
        formatValue={(val) => `$${val.toLocaleString()}`}
      />

      <Slider
        id="tenure"
        label="Tenure (Months)"
        min={3}
        max={60}
        step={1}
        value={tenure}
        onChange={setTenure}
        formatValue={(val) => `${val} mos`}
      />

      <Slider
        id="rate"
        label="Interest Rate"
        min={5}
        max={30}
        step={0.1}
        value={rate}
        onChange={setRate}
        formatValue={(val) => `${val}%`}
      />

      <div className="bg-slate-50 border p-4 rounded-lg text-center">
        <span className="text-xs text-slate-500 uppercase tracking-wider block">Estimated Monthly Payment</span>
        <span className="text-3xl font-extrabold text-slate-900">${calculateEmi()}</span>
      </div>
    </div>
  );
}
