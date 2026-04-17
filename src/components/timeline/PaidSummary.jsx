export default function Timeline({ expenses, group }) {
  const participantsById = Object.fromEntries(
    group.participants.map((participant) => [participant.id, participant]),
  );

  const paidAmountsByParticipantId = expenses.reduce(
    (accumulatedAmounts, expense) => {
      const currentAmount = accumulatedAmounts[expense.paidBy] ?? 0;

      accumulatedAmounts[expense.paidBy] = currentAmount + expense.amount;

      return accumulatedAmounts;
    },
    {},
  );

  const participantsWithPaidAmount = Object.entries(
    paidAmountsByParticipantId,
  ).map(([participantId, paidAmount]) => ({
    participant: participantsById[participantId],
    paidAmount,
  }));

  const sortedParticipantsWithPaidAmount = [...participantsWithPaidAmount].sort(
    (a, b) => b.paidAmount - a.paidAmount,
  );

  return (
    <section className='md:col-span-2 rounded-md border border-zinc-200 bg-white px-3 pt-2 pb-4'>
      <div className='mb-3'>
        <h2 className='text-base font-medium text-zinc-500'>Activity</h2>
      </div>

      <div className='flex flex-wrap gap-3'>
        {sortedParticipantsWithPaidAmount.map(({ participant, paidAmount }) => (
          <div
            key={participant.id}
            className='flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold text-white'
            style={{ backgroundColor: participant.color }}
          >
            {paidAmount}€
          </div>
        ))}
      </div>
    </section>
  );
}
