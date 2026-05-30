/**
 * Loan Calculation Utilities
 *
 * All financial calculation helpers used across controllers.
 */

/**
 * Calculates monthly EMI using the standard reducing-balance formula.
 * EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
 *
 * @param principal   Loan principal amount
 * @param annualRate  Annual interest rate (e.g. 12 for 12%)
 * @param tenureMonths Tenure in months
 * @returns Monthly EMI amount (rounded to 2 decimal places)
 */
export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): number => {
  if (annualRate === 0) return parseFloat((principal / tenureMonths).toFixed(2));

  const monthlyRate = annualRate / 100 / 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  return parseFloat(emi.toFixed(2));
};

export interface AmortizationEntry {
  installmentNumber: number;
  dueDate: Date;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  outstandingPrincipal: number;
}

/**
 * Generates the full amortization schedule starting from disbursementDate.
 */
export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  disbursementDate: Date
): AmortizationEntry[] => {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const monthlyRate = annualRate / 100 / 12;
  const schedule: AmortizationEntry[] = [];

  let outstandingPrincipal = principal;

  for (let i = 1; i <= tenureMonths; i++) {
    const interestAmount = parseFloat((outstandingPrincipal * monthlyRate).toFixed(2));
    const principalAmount = parseFloat((emi - interestAmount).toFixed(2));
    outstandingPrincipal = parseFloat(
      Math.max(0, outstandingPrincipal - principalAmount).toFixed(2)
    );

    const dueDate = new Date(disbursementDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      installmentNumber: i,
      dueDate,
      emiAmount: emi,
      principalAmount,
      interestAmount,
      outstandingPrincipal,
    });
  }

  return schedule;
};

/**
 * Calculates overdue penalty.
 * @param emiAmount    EMI amount
 * @param overdueDays  Number of days past due
 * @param penaltyRate  Annual penalty rate (default 2%)
 */
export const calculatePenalty = (
  emiAmount: number,
  overdueDays: number,
  penaltyRate = 2
): number => {
  const dailyRate = penaltyRate / 100 / 365;
  return parseFloat((emiAmount * dailyRate * overdueDays).toFixed(2));
};

/**
 * Returns total interest payable over the loan tenure.
 */
export const totalInterestPayable = (
  emi: number,
  tenureMonths: number,
  principal: number
): number => {
  return parseFloat((emi * tenureMonths - principal).toFixed(2));
};
