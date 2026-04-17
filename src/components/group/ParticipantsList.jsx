export default function ParticipantsList({ participants, expenses }) {
  const paidAmountsByParticipantId = expenses.reduce(
    (accumulatedAmounts, expense) => {
      const currentAmount = accumulatedAmounts[expense.paidBy] ?? 0;
      accumulatedAmounts[expense.paidBy] = currentAmount + expense.amount;
      return accumulatedAmounts;
    },
    {},
  );

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
      {participants.map((participant) => {
        const paidAmount = paidAmountsByParticipantId[participant.id] ?? 0;

        return (
          <div
            key={participant.id}
            className='flex items-center gap-2 rounded-full bg-zinc-50 px-2.5 py-1.5'
          >
            <div
              className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white'
              style={{ backgroundColor: participant.color }}
            >
              {paidAmount}€
            </div>

            <span className='text-sm text-zinc-700 truncate'>
              {participant.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
