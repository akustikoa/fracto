import SettlementList from '../components/details/SettlementList';
import ParticipantBreakdown from '../components/details/ParticipantBreakdown';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';

export default function DetailsPage({ group, expenses }) {
  const validParticipantIds = group.participants.map((participant) => participant.id);

  const filteredExpenses = expenses.filter((expense) =>
    validParticipantIds.includes(expense.paidBy),
  );

  const balances = calculateBalances(group.participants, filteredExpenses);
  const settlements = calculateSettlements(balances);
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <main className='min-h-screen bg-zinc-50'>
      <div className='mx-auto max-w-3xl px-4 py-7 md:px-6 md:py-9'>
        <div className='space-y-6'>
          <header className='rounded-2xl border border-zinc-200/80 bg-white px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <h1 className='truncate text-2xl font-semibold tracking-tight text-zinc-900'>
                  {group.name}
                </h1>
                <p className='mt-1 text-sm text-zinc-500'>
                  {group.participants.length} participants
                </p>
              </div>

              <div className='shrink-0 text-right'>
                <p className='text-2xl font-semibold tracking-tight text-zinc-900'>
                  {totalSpent.toFixed(2)}€
                </p>
                <p className='mt-1 text-xs font-medium text-zinc-400'>total</p>
              </div>
            </div>

            <div className='mt-5 flex flex-wrap gap-2'>
              {group.participants.map((participant) => (
                <div
                  key={participant.id}
                  className='inline-flex max-w-full items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600'
                >
                  <span
                    className='h-2.5 w-2.5 shrink-0 rounded-full'
                    style={{ backgroundColor: participant.color }}
                  />
                  <span className='truncate'>{participant.name}</span>
                </div>
              ))}
            </div>
          </header>

          <SettlementList settlements={settlements} />

          <ParticipantBreakdown balances={balances} expenses={filteredExpenses} />

          <button
            type='button'
            className='h-10 w-full rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800'
          >
            Share
          </button>
        </div>
      </div>
    </main>
  );
}
