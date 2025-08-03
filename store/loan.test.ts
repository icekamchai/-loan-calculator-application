import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useLoanStore, type LoanScenario } from "./loan";

const sampleLoan1: Omit<LoanScenario, "id"> = {
  loanAmount: 1000000,
  interestRate: 5,
  loanTermYears: 10,
  loanTermMonths: 0,
  monthlyPayment: 10606.55,
  totalInterest: 272785.8,
  totalPayment: 1272785.8,
};

const sampleLoan2: Omit<LoanScenario, "id"> = {
  loanAmount: 500000,
  interestRate: 3,
  loanTermYears: 5,
  loanTermMonths: 0,
  monthlyPayment: 8984.34,
  totalInterest: 39060.43,
  totalPayment: 539060.43,
};

describe("useLoanStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should initialize with an empty comparison list", () => {
    const store = useLoanStore();
    expect(store.comparisonList).toEqual([]);
  });

  it("should add a loan scenario to the list", () => {
    const store = useLoanStore();
    store.addLoan(sampleLoan1);
    expect(store.comparisonList.length).toBe(1);
    expect(store.comparisonList[0]).toMatchObject(sampleLoan1);
    expect(store.comparisonList[0]!.id).toBeDefined();
  });

  it("should remove a loan scenario from the list by id", () => {
    const store = useLoanStore();
    store.addLoan(sampleLoan1);
    const loanId = store.comparisonList[0]!.id;
    store.removeLoan(loanId);
    expect(store.comparisonList.length).toBe(0);
  });

  it("should not remove any loan if id does not exist", () => {
    const store = useLoanStore();
    store.addLoan(sampleLoan1);
    store.removeLoan(999);
    expect(store.comparisonList.length).toBe(1);
  });

  it("should handle adding and removing multiple loans correctly", () => {
    vi.useFakeTimers();

    const store = useLoanStore();

    store.addLoan(sampleLoan1);
    vi.advanceTimersByTime(1);
    store.addLoan(sampleLoan2);

    const firstLoanId = store.comparisonList[0]!.id;

    expect(store.comparisonList.length).toBe(2);

    store.removeLoan(firstLoanId);

    expect(store.comparisonList.length).toBe(1);
    expect(store.comparisonList[0]).not.toHaveProperty("id", firstLoanId);
  });
});
