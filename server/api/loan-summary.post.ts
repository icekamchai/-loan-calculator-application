export default defineCachedEventHandler(
  async (event) => {
    const body = await readBody(event);

    if (!body.loanAmount || !body.interestRate || !body.loanTermYears) {
      throw createError({
        statusCode: 400,
        statusMessage:
          "Missing required fields: loanAmount, interestRate, loanTermYears",
      });
    }

    const {
      loanAmount,
      interestRate,
      loanTermYears,
      loanTermMonths = 0,
    } = body;

    const monthlyInterestRate = interestRate / 12 / 100;
    const totalMonths = loanTermYears * 12 + loanTermMonths;

    if (totalMonths <= 0 || monthlyInterestRate <= 0) {
      return { error: "Invalid loan terms" };
    }

    const p = loanAmount;
    const i = monthlyInterestRate;
    const n = totalMonths;
    const monthlyPayment =
      (p * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);
    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };
  },
  {
    maxAge: 60 * 60,
    getKey: async (event) => {
      const body = await readBody(event);
      return `loan-summary-${body.loanAmount}-${body.interestRate}-${body.loanTermYears}`;
    },
  }
);
