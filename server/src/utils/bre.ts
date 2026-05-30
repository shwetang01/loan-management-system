export interface BREInput {
  fullName: string;
  pan: string;
  dateOfBirth: string | Date;
  monthlySalary: number;
  employmentMode: 'salaried' | 'self-employed' | 'unemployed';
}

export interface BREResult {
  passed: boolean;
  reason?: string;
}

export const runBRE = (input: BREInput): BREResult => {
  // 1. PAN validation
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(input.pan)) {
    return { passed: false, reason: 'Invalid PAN number format' };
  }

  // 2. Age validation (23-50)
  const dob = new Date(input.dateOfBirth);
  if (isNaN(dob.getTime())) {
    return { passed: false, reason: 'Invalid date of birth' };
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (age < 23 || age > 50) {
    return { passed: false, reason: `Age must be between 23 and 50 years. Current calculated age: ${age}` };
  }

  // 3. Monthly Salary validation (>= 25000)
  if (input.monthlySalary < 25000) {
    return { passed: false, reason: 'Monthly salary must be at least 25,000' };
  }

  // 4. Employment mode validation (must NOT be 'unemployed')
  if (input.employmentMode === 'unemployed') {
    return { passed: false, reason: 'Applicant must be employed (cannot be unemployed)' };
  }

  return { passed: true };
};
