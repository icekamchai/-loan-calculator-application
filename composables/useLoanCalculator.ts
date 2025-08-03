import { ref, computed } from "vue";

export function useLoanCalculator(state: {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  loanTermMonths: number;
}) {
  const monthlyInterestRate = computed(() => state.interestRate / 12 / 100);
  const totalMonths = computed(
    () => state.loanTermYears * 12 + state.loanTermMonths
  );

  const monthlyPayment = computed(() => {
    if (
      totalMonths.value <= 0 ||
      monthlyInterestRate.value <= 0 ||
      state.loanAmount <= 0
    )
      return 0;

    const p = state.loanAmount;
    const i = monthlyInterestRate.value;
    const n = totalMonths.value;
    const monthly = (p * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);
    return isNaN(monthly) ? 0 : monthly;
  });

  const amortizationSchedule = computed(() => {
    if (monthlyPayment.value <= 0) return [];

    const schedule = [];
    let balance = state.loanAmount;

    for (let k = 1; k <= totalMonths.value; k++) {
      if (balance <= 0) break;
      const interestPayment = balance * monthlyInterestRate.value;
      const principalPayment = monthlyPayment.value - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month: k,
        payment: monthlyPayment.value,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance < 0 ? 0 : balance,
      });
    }
    return schedule;
  });

  const totalPayment = computed(() =>
    monthlyPayment.value > 0 ? monthlyPayment.value * totalMonths.value : 0
  );
  const totalInterest = computed(() =>
    totalPayment.value > 0 ? totalPayment.value - state.loanAmount : 0
  );

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    amortizationSchedule,
  };
}
