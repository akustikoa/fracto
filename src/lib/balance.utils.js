export function calculateBalances(participants, expenses) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const sharePerPerson = totalExpenses / participants.length;

  const paidByParticipant = expenses.reduce((acc, expense) => {
    const current = acc[expense.paidBy] ?? 0;
    acc[expense.paidBy] = current + expense.amount;
    return acc;
  }, {});

  return participants.map((participant) => {
    const totalPaid = paidByParticipant[participant.id] ?? 0;

    const balance = totalPaid - sharePerPerson;

    return {
      participant,
      totalPaid,
      balance,
    };
  });
}
