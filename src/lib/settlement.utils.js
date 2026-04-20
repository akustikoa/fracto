export function calculateSettlements(balances) {
  const creditors = balances
    .filter(({ balance }) => balance > 0)
    .map(({ participant, balance }) => ({
      participant,
      amountCents: Math.round(balance * 100),
    }));

  const debtors = balances
    .filter(({ balance }) => balance < 0)
    .map(({ participant, balance }) => ({
      participant,
      amountCents: Math.abs(Math.round(balance * 100)),
    }));

  const settlements = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const paymentCents = Math.min(creditor.amountCents, debtor.amountCents);

    settlements.push({
      from: debtor.participant,
      to: creditor.participant,
      amount: paymentCents / 100,
    });

    creditor.amountCents -= paymentCents;
    debtor.amountCents -= paymentCents;

    if (creditor.amountCents === 0) {
      creditorIndex += 1;
    }

    if (debtor.amountCents === 0) {
      debtorIndex += 1;
    }
  }

  return settlements;
}