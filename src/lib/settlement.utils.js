export function calculateSettlements(balances) {
  const creditors = balances
    .filter(({ balance }) => balance > 0)
    .map(({ participant, balance }) => ({
      participant,
      amount: balance,
    }));

  const debtors = balances
    .filter(({ balance }) => balance < 0)
    .map(({ participant, balance }) => ({
      participant,
      amount: Math.abs(balance),
    }));

  const settlements = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const paymentAmount = Math.min(creditor.amount, debtor.amount);

    settlements.push({
      from: debtor.participant,
      to: creditor.participant,
      amount: paymentAmount,
    });

    creditor.amount -= paymentAmount;
    debtor.amount -= paymentAmount;

    if (creditor.amount === 0) {
      creditorIndex += 1;
    }

    if (debtor.amount === 0) {
      debtorIndex += 1;
    }
  }

  return settlements;
}