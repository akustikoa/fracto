export default function ParticipantBreakdown({ balances, expenses }) {
  return (
    <section>
      <h2 className='mb-3 ms-1 text-xl font-semibold tracking-tight text-zinc-900'>
        Expenses by participant
      </h2>

      <div className='rounded-2xl border border-zinc-200/80 bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'>
        {balances.map(({ participant, totalPaid }) => {
          const participantExpenses = expenses.filter(
            (expense) => expense.paidBy === participant.id,
          );

          return (
            <div
              key={participant.id}
              className='border-b border-zinc-100 py-3.5 first:pt-0 last:border-b-0 last:pb-0'
            >
              <div className='flex items-center justify-between gap-3'>
                <div className='flex min-w-0 items-center gap-2.5'>
                  <span
                    className='h-5 w-1.5 shrink-0 rounded-full'
                    style={{ backgroundColor: participant.color }}
                  />
                  <h3 className='truncate text-sm font-medium font-semibold text-zinc-900'>
                    {participant.name}
                  </h3>
                </div>

                <span className='shrink-0 text-base font-semibold tabular-nums text-zinc-900'>
                  {totalPaid.toFixed(2)}€
                </span>
              </div>

              {participantExpenses.length === 0 ? (
                <p className='mt-2 pl-6 text-sm text-zinc-500'>
                  No expenses yet
                </p>
              ) : (
                <div className='mt-2 space-y-1 pl-6'>
                  {participantExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className='flex items-center justify-between gap-3 py-1 text-sm'
                    >
                      <span className='min-w-0 flex-1 truncate text-zinc-500'>
                        {expense.concept}
                      </span>

                      <span className='shrink-0 font-medium tabular-nums text-zinc-500'>
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
