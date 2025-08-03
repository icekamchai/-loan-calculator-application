import { describe, it, expect, vi } from "vitest";
import { useLoanCalculator } from "./useLoanCalculator";
import { ref, computed } from "vue";

vi.mock("vue", () => ({
  ref: (value: any) => ({ value }),
  computed: (fn: any) => ({
    get value() {
      return fn();
    },
  }),
}));

describe("useLoanCalculator", () => {
  it("should correctly calculate monthly payment, total payment, and total interest for a standard loan", () => {
    const state = {
      loanAmount: 100000,
      interestRate: 5.5,
      loanTermYears: 10,
      loanTermMonths: 0,
    };

    const { monthlyPayment, totalPayment, totalInterest } =
      useLoanCalculator(state);

    const expectedMonthlyPayment = 1085.26;
    const expectedTotalPayment = 130231.53;
    const expectedTotalInterest = 30231.53;

    expect(monthlyPayment.value).toBeCloseTo(expectedMonthlyPayment, 2);
    expect(totalPayment.value).toBeCloseTo(expectedTotalPayment, 2);
    expect(totalInterest.value).toBeCloseTo(expectedTotalInterest, 2);
  });

  it("should generate a correct amortization schedule", () => {
    const state = {
      loanAmount: 50000,
      interestRate: 10,
      loanTermYears: 1,
      loanTermMonths: 0,
    };

    const { amortizationSchedule } = useLoanCalculator(state);
    const schedule = amortizationSchedule.value;

    expect(schedule.length).toBe(12);

    const firstMonth = schedule[0];
    const lastMonth = schedule[schedule.length - 1];

    const expectedMonthlyPayment = 4395.79;

    if (!firstMonth || !lastMonth) {
      return;
    }
    expect(firstMonth.month).toBe(1);
    expect(firstMonth.payment).toBeCloseTo(expectedMonthlyPayment, 2);
    expect(firstMonth.interest).toBeCloseTo(416.67, 2);

    expect(firstMonth.principal).toBeCloseTo(3979.13, 2);
    expect(firstMonth.balance).toBeCloseTo(46020.87, 2);

    expect(lastMonth.month).toBe(12);
    expect(lastMonth.payment).toBeCloseTo(expectedMonthlyPayment, 2);
    expect(lastMonth.balance).toBeCloseTo(0, 2);
  });

  it("should return 0 for all values if loan amount is zero", () => {
    const state = {
      loanAmount: 0,
      interestRate: 5,
      loanTermYears: 10,
      loanTermMonths: 0,
    };

    const {
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule,
    } = useLoanCalculator(state);

    expect(monthlyPayment.value).toBe(0);
    expect(totalPayment.value).toBe(0);
    expect(totalInterest.value).toBe(0);
    expect(amortizationSchedule.value).toEqual([]);
  });

  it("should return 0 for all values if loan term is zero", () => {
    const state = {
      loanAmount: 100000,
      interestRate: 5,
      loanTermYears: 0,
      loanTermMonths: 0,
    };

    const {
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule,
    } = useLoanCalculator(state);

    expect(monthlyPayment.value).toBe(0);
    expect(totalPayment.value).toBe(0);
    expect(totalInterest.value).toBe(0);
    expect(amortizationSchedule.value).toEqual([]);
  });
});
