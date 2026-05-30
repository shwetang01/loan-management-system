'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Loader2,
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

// Indian Rupee Formatter helper
const formatRupee = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ApplyPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [checkingActiveLoan, setCheckingActiveLoan] = useState(true);

  // Route protection and active loan check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && user.role === 'borrower') {
      api.get('/borrower/my-loan')
        .then((res) => {
          if (res.data && res.data.status !== 'rejected' && res.data.status !== 'closed') {
            // Already has an active application, redirect to status tracking
            router.push('/status');
          } else {
            setCheckingActiveLoan(false);
          }
        })
        .catch(() => {
          // No active application, let them proceed
          setCheckingActiveLoan(false);
        });
    } else {
      setCheckingActiveLoan(false);
    }
  }, [user, authLoading, router]);

  // Current Step state (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1 Data: Personal details
  const [fullName, setFullName] = useState('');
  const [pan, setPan] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [employmentMode, setEmploymentMode] = useState<'salaried' | 'self-employed' | 'unemployed'>('salaried');

  // STEP 1 BRE Error/Success messages
  const [breError, setBreError] = useState<string | null>(null);
  const [breSuccess, setBreSuccess] = useState<string | null>(null);
  const [step1Loading, setStep1Loading] = useState(false);

  // STEP 2 Data: Upload salary slip
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [salarySlipUrl, setSalarySlipUrl] = useState<string | null>(null);

  // STEP 3 Data: Loan configuration
  const [loanAmount, setLoanAmount] = useState(100000); // Default ₹1,00,000
  const [tenureDays, setTenureDays] = useState(180); // Default 180 days
  const [step3Loading, setStep3Loading] = useState(false);

  // STEP 4 Data: Success output
  const [createdLoan, setCreatedLoan] = useState<any>(null);

  // Calculations for Step 3
  const interestRate = 12; // 12% p.a.
  const simpleInterest = Math.round((loanAmount * interestRate * tenureDays) / (365 * 100));
  const totalRepayment = loanAmount + simpleInterest;

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setUploadError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setUploadError('Only PDF, JPG, and PNG files are accepted.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  // Submission Step 1: BRE Profiling
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBreError(null);
    setBreSuccess(null);

    // Basic client validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const formattedPan = pan.toUpperCase().trim();
    if (!panRegex.test(formattedPan)) {
      setBreError('PAN format is invalid (Expected: 5 Letters, 4 Digits, 1 Letter)');
      return;
    }

    if (employmentMode === 'unemployed') {
      setBreError('BRE Rules Failed: Employment Mode cannot be unemployed.');
      return;
    }

    setStep1Loading(true);

    try {
      await api.post('/borrower/profile', {
        fullName,
        pan: formattedPan,
        dateOfBirth,
        monthlySalary: Number(monthlySalary),
        employmentMode,
      });

      setBreSuccess('BRE Screening passed successfully! Profile verified.');
      setTimeout(() => {
        setCurrentStep(2);
      }, 1000);
    } catch (err: any) {
      if (err.response?.status === 422) {
        setBreError(`BRE Verification Failed: ${err.response.data.reason}`);
      } else {
        setBreError(err.response?.data?.message || 'Server error during profile verification.');
      }
    } finally {
      setStep1Loading(false);
    }
  };

  // Submission Step 2: Salary Slip Upload
  const handleStep2Submit = async () => {
    if (!file) {
      setUploadError('Please select a file to upload first.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('salarySlip', file);

    try {
      // Simulate fake upload progress tracker since small files upload instantly
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 15;
        });
      }, 100);

      const res = await api.post('/borrower/upload-salary-slip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(interval);
      setUploadProgress(100);
      setSalarySlipUrl(res.data.url);

      setTimeout(() => {
        setCurrentStep(3);
        setUploading(false);
      }, 800);
    } catch (err: any) {
      setUploading(false);
      setUploadProgress(0);
      setUploadError(err.response?.data?.message || 'File upload failed. Ensure the server is running.');
    }
  };

  // Submission Step 3: Apply for Loan
  const handleStep3Submit = async () => {
    setStep3Loading(true);
    try {
      const res = await api.post('/borrower/apply', {
        principalAmount: loanAmount,
        tenureDays,
      });

      setCreatedLoan(res.data);
      setCurrentStep(4);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Loan submission failed.');
    } finally {
      setStep3Loading(false);
    }
  };

  if (authLoading || !user || checkingActiveLoan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Checking Active Loan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xl">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <span>LMS Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
              Secure Application Portal
            </span>
            <button
              onClick={logout}
              className="text-xs font-semibold text-red-400 hover:text-red-300 border border-red-950/80 hover:bg-red-950/20 px-3.5 py-1.5 rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Step Indicator (only show for Steps 1-3) */}
        {currentStep <= 3 && (
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-semibold tracking-wide uppercase">
              <span>Progress Bar</span>
              <span>Step {currentStep} of 3</span>
            </div>
            <div className="h-2 bg-slate-850 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
            {/* Step badges */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <span className={`text-xxs font-bold uppercase tracking-wider ${currentStep >= 1 ? 'text-blue-400' : 'text-slate-600'}`}>
                1. Personal Screening
              </span>
              <span className={`text-xxs font-bold uppercase tracking-wider ${currentStep >= 2 ? 'text-blue-400' : 'text-slate-600'}`}>
                2. Salary Slips
              </span>
              <span className={`text-xxs font-bold uppercase tracking-wider ${currentStep >= 3 ? 'text-blue-400' : 'text-slate-600'}`}>
                3. Configure & Apply
              </span>
            </div>
          </div>
        )}

        {/* Main Card Container */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-200">
          
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Verification Screening</h2>
                <p className="text-xs text-slate-400 mt-1">
                  We check your eligibility instantly using our rules engine. All fields are required.
                </p>
              </div>

              {breError && (
                <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-4 flex gap-3 text-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-bold">Eligibility Check Blocked</span>
                    <p className="mt-1 text-red-300/90 text-xs leading-relaxed">{breError}</p>
                  </div>
                </div>
              )}

              {breSuccess && (
                <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-xl p-4 flex gap-3 text-emerald-200">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="font-bold">Access Cleared</span>
                    <p className="mt-1 text-emerald-300/90 text-xs">{breSuccess}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full mt-1.5 h-11 bg-slate-900 border border-slate-850 rounded-xl px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="As listed on PAN card"
                  />
                </div>

                <div>
                  <label htmlFor="pan" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    PAN Card Number
                  </label>
                  <input
                    id="pan"
                    type="text"
                    required
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full mt-1.5 h-11 bg-slate-900 border border-slate-850 rounded-xl px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase transition"
                    placeholder="ABCDE1234F"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full mt-1.5 h-11 bg-slate-900 border border-slate-850 rounded-xl px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <p className="mt-1 text-xxs text-slate-500">Allowed Age bracket is 23 to 50 years.</p>
                </div>

                <div>
                  <label htmlFor="monthlySalary" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Monthly Net Salary (₹)
                  </label>
                  <input
                    id="monthlySalary"
                    type="number"
                    required
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(e.target.value)}
                    className="w-full mt-1.5 h-11 bg-slate-900 border border-slate-850 rounded-xl px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g. 35000"
                  />
                  <p className="mt-1 text-xxs text-slate-500">Minimum monthly salary required is ₹25,000.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Employment Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['salaried', 'self-employed', 'unemployed'] as const).map((mode) => (
                    <label
                      key={mode}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition capitalize ${
                        employmentMode === mode
                          ? 'border-blue-500 bg-blue-950/20 text-white font-semibold'
                          : 'border-slate-850 bg-slate-900/40 text-slate-450 hover:bg-slate-900/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name="employmentMode"
                        value={mode}
                        checked={employmentMode === mode}
                        onChange={() => setEmploymentMode(mode)}
                        className="sr-only"
                      />
                      <span className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        employmentMode === mode ? 'border-blue-500' : 'border-slate-700'
                      }`}>
                        {employmentMode === mode && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                      </span>
                      <span className="text-sm">{mode.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={step1Loading}
                  className="h-11 px-6 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-semibold rounded-xl text-white shadow-lg transition-colors gap-2"
                >
                  {step1Loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Screening Profile...
                    </>
                  ) : (
                    <>
                      Verify and Advance
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Upload Salary Slip */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Upload Salary Slip</h2>
                <p className="text-xs text-slate-400 mt-1">
                  We require a proof of income. Accepted formats: PDF, JPG, PNG up to 5MB.
                </p>
              </div>

              {uploadError && (
                <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-4 flex gap-3 text-red-200 text-sm">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Drag & Drop Box */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] transition cursor-pointer ${
                  dragActive
                    ? 'border-blue-500 bg-blue-950/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/20'
                }`}
              >
                <input
                  type="file"
                  id="salarySlipInput"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf, .jpg, .jpeg, .png"
                />
                
                <Upload className="h-10 w-10 text-slate-500 mb-3 animate-bounce" />
                
                <label htmlFor="salarySlipInput" className="cursor-pointer">
                  <span className="text-sm font-semibold text-blue-400 hover:underline">
                    Click to browse
                  </span>
                  <span className="text-sm text-slate-500"> or drag and drop your salary slip</span>
                </label>
                <p className="text-xxs text-slate-600 mt-1">Supported file types: PDF, PNG, JPEG (Max 5MB)</p>
              </div>

              {/* File details */}
              {file && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-8 w-8 text-blue-500 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-sm text-white font-medium truncate">{file.name}</p>
                      <p className="text-xxs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 border border-red-950 hover:bg-red-950/30 px-3 py-1.5 rounded-lg transition"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Progress bar */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="h-11 px-5 flex items-center gap-2 border border-slate-800 hover:bg-slate-900 text-sm font-semibold rounded-xl text-slate-350 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleStep2Submit}
                  disabled={!file || uploading}
                  className="h-11 px-6 flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-sm font-semibold rounded-xl text-white shadow-lg transition-colors gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading slip...
                    </>
                  ) : (
                    <>
                      Upload slip
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Loan Configuration & Apply */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white">Loan Configuration</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust limits to customize repayment conditions. Formula utilizes simple interest at 12% p.a.
                </p>
              </div>

              {/* Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="amount-slider" className="font-semibold text-slate-400">Loan Principal</label>
                  <span className="text-lg font-extrabold text-blue-400">{formatRupee(loanAmount)}</span>
                </div>
                <input
                  id="amount-slider"
                  type="range"
                  min={50000}
                  max={500000}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between text-xxs text-slate-550">
                  <span>{formatRupee(50000)}</span>
                  <span>{formatRupee(500000)}</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="tenure-slider" className="font-semibold text-slate-400">Tenure (Days)</label>
                  <span className="text-lg font-extrabold text-blue-400">{tenureDays} Days</span>
                </div>
                <input
                  id="tenure-slider"
                  type="range"
                  min={30}
                  max={365}
                  step={1}
                  value={tenureDays}
                  onChange={(e) => setTenureDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between text-xxs text-slate-550">
                  <span>30 Days</span>
                  <span>365 Days</span>
                </div>
              </div>

              {/* Live Calculations Panel */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_70%)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Live Repayment Calculations
                </h4>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div className="text-slate-400">Principal Amount</div>
                  <div className="text-right text-white font-medium">{formatRupee(loanAmount)}</div>

                  <div className="text-slate-400">Interest Rate</div>
                  <div className="text-right text-white font-medium">{interestRate}% p.a.</div>

                  <div className="text-slate-400">Tenure Days</div>
                  <div className="text-right text-white font-medium">{tenureDays} Days</div>

                  <div className="text-slate-400">Simple Interest</div>
                  <div className="text-right text-blue-400 font-semibold">{formatRupee(simpleInterest)}</div>
                  
                  <div className="col-span-2 border-t border-slate-800/80 my-1"></div>

                  <div className="text-base font-bold text-white">Total Repayment</div>
                  <div className="text-right text-lg font-black text-emerald-400">{formatRupee(totalRepayment)}</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="h-11 px-5 flex items-center gap-2 border border-slate-800 hover:bg-slate-900 text-sm font-semibold rounded-xl text-slate-350 transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleStep3Submit}
                  disabled={step3Loading}
                  className="h-11 px-6 flex items-center justify-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-sm font-semibold rounded-xl text-white shadow-lg transition-colors gap-2 animate-pulse"
                >
                  {step3Loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Apply for Loan
                      <ShieldCheck className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {currentStep === 4 && createdLoan && (
            <div className="text-center space-y-6 py-6">
              <div className="h-16 w-16 bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              
              <div>
                <h2 className="text-2xl font-extrabold text-white">Application Submitted!</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Your request is queued. Our sanction officers are assessing details.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-6 text-left max-w-md mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loan Status</span>
                  <span className="inline-flex items-center rounded-full bg-blue-950 border border-blue-800 px-2.5 py-0.5 text-xs font-bold text-blue-400 uppercase">
                    {createdLoan.status}
                  </span>
                </div>

                <div className="space-y-2 border-t border-slate-800/80 pt-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application ID</span>
                    <span className="font-mono text-white text-xs">{createdLoan._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Principal Requested</span>
                    <span className="font-semibold text-white">{formatRupee(createdLoan.principalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tenure</span>
                    <span className="font-semibold text-white">{createdLoan.tenureDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Repayment</span>
                    <span className="font-bold text-emerald-400">{formatRupee(createdLoan.totalRepayment)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 max-w-xs mx-auto">
                <button
                  onClick={() => router.push('/status')}
                  className="w-full h-11 flex items-center justify-center bg-slate-800 hover:bg-slate-750 text-sm font-semibold rounded-xl text-white transition shadow"
                >
                  Track my application
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
