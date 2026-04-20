export function calculateBalances(participants, expenses) {
  const totalExpensesCents = expenses.reduce((sum, expense) => {
    return sum + Math.round(expense.amount * 100);
  }, 0);

  const baseShareCents = Math.floor(totalExpensesCents / participants.length);
  const remainderCents = totalExpensesCents % participants.length;

  const paidByParticipantCents = expenses.reduce((acc, expense) => {
    const current = acc[expense.paidBy] ?? 0;
    acc[expense.paidBy] = current + Math.round(expense.amount * 100);
    return acc;
  }, {});

  return participants.map((participant, index) => {
    const totalPaidCents = paidByParticipantCents[participant.id] ?? 0;

    const shareCents =
      index < remainderCents ? baseShareCents + 1 : baseShareCents;

    const balanceCents = totalPaidCents - shareCents;

    return {
      participant,
      totalPaid: totalPaidCents / 100,
      balance: balanceCents / 100,
    };
  });
}
