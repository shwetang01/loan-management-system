'use client';

import React, { useState } from 'react';
import FileUpload from './FileUpload';

export default function StepForm() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      {/* Visual Stepper */}
      <div className="flex items-center justify-between border-b pb-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                step === s
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : step > s
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {s}
            </span>
            <span className={`text-xs font-semibold ${step === s ? 'text-slate-900' : 'text-slate-400'}`}>
              {s === 1 ? 'Personal Info' : s === 2 ? 'Loan Details' : 'Upload Docs'}
            </span>
          </div>
        ))}
      </div>

      {/* Step Renderings */}
      <div className="min-h-[250px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">First Name</label>
                <input type="text" className="w-full mt-1 border rounded p-2" placeholder="John" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">Last Name</label>
                <input type="text" className="w-full mt-1 border rounded p-2" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
              <input type="date" className="w-full mt-1 border rounded p-2" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Loan Purpose</label>
              <input type="text" className="w-full mt-1 border rounded p-2" placeholder="e.g. Home expansion" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase">Employment Type</label>
              <select className="w-full mt-1 border rounded p-2">
                <option value="salaried">Salaried</option>
                <option value="self_employed">Self Employed</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase">Aadhar and Income Proof</label>
            <FileUpload />
          </div>
        )}

        {/* Stepper Navigation */}
        <div className="flex justify-between items-center border-t pt-4 mt-6">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border rounded-md text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => (step === 3 ? alert('Application scaffold submitted!') : setStep(step + 1))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md shadow"
          >
            {step === 3 ? 'Submit Application' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
}
