export default function ParticipantBreakdown({ balances, expenses }) {
  return (
    <section>
      <h2 className='mb-2 ms-1 text-lg font-semibold text-zinc-900'>
        Breakdown
      </h2>

      <div className='space-y-3'>
        {balances.map(({ participant, totalPaid }) => {
          const participantExpenses = expenses.filter(
            (expense) => expense.paidBy === participant.id,
          );

          return (
            <div
              key={participant.id}
              className='rounded-2xl border border-zinc-200/80 bg-white px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
            >
              <div className='mb-4 flex items-center justify-between gap-3'>
                <div className='flex min-w-0 items-center gap-2'>
                  <span
                    className='h-3 w-3 shrink-0 rounded-full'
                    style={{ backgroundColor: participant.color }}
                  />
                  <h3 className='truncate text-base font-semibold text-zinc-900'>
                    {participant.name}
                  </h3>
                </div>

                <span className='shrink-0 text-base font-semibold text-zinc-900'>
                  {totalPaid.toFixed(2)}€
                </span>
              </div>

              {participantExpenses.length === 0 ? (
                <p className='text-sm text-zinc-400'>No expenses yet</p>
              ) : (
                <div className='space-y-2'>
                  {participantExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className='flex items-center justify-between gap-3 py-1.5 text-sm'
                    >
                      <span className='min-w-0 flex-1 truncate font-medium text-zinc-800'>
                        {expense.concept}
                      </span>

                      <span className='shrink-0 font-semibold text-zinc-900'>
                        {expense.amount.toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
