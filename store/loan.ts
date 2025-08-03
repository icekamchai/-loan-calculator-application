import { defineStore } from "pinia";

export type LoanScenario = {
  id: number;
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  loanTermMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
};

export const useLoanStore = defineStore("loan", () => {
  const comparisonList = ref<LoanScenario[]>([]);

  function addLoan(scenario: Omit<LoanScenario, "id">) {
    const newScenario: LoanScenario = {
      ...scenario,
      id: Date.now(),
    };
    comparisonList.value.push(newScenario);
  }

  function removeLoan(id: number) {
    const index = comparisonList.value.findIndex((item) => item.id === id);
    if (index > -1) {
      comparisonList.value.splice(index, 1);
    }
  }

  return { comparisonList, addLoan, removeLoan };
});
