import { Check, Pencil, X } from 'lucide-react';

export default function ParticipantSheet({
  selectedParticipant,
  participantTotal,
  participantExpenses,
  editingExpenseId,
  expenseDraft,
  onEditExpense,
  onExpenseDraftConceptChange,
  onExpenseDraftAmountChange,
  onSaveExpense,
  onCancelExpenseEdit,
}) {
  return (
    <>
      <div className='mb-5 flex items-center justify-between gap-3'>
        <div className='flex min-w-0 items-center gap-2'>
          <span
            className='h-3 w-3 shrink-0 rounded-full'
            style={{ backgroundColor: selectedParticipant.color }}
          />
          <h3 className='truncate text-base font-semibold text-zinc-900'>
            {selectedParticipant.name}
          </h3>
        </div>

        <span className='shrink-0 text-base font-semibold text-zinc-900'>
          {participantTotal.toFixed(2)}€
        </span>
      </div>

      <div className='space-y-3'>
        {participantExpenses.length === 0 ? (
          <p className='text-sm text-zinc-400'>No expenses yet</p>
        ) : (
          participantExpenses.map((expense) => (
            <div key={expense.id} className='py-2.5 text-sm'>
              {editingExpenseId === expense.id ? (
                <div className='space-y-2 rounded-xl bg-zinc-50 px-2 py-2'>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      value={expenseDraft.concept}
                      onChange={(event) =>
                        onExpenseDraftConceptChange(event.target.value)
                      }
                      className='h-10 min-w-0 flex-1 rounded-xl border border-zinc-200/80 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
                    />

                    <input
                      type='text'
                      inputMode='decimal'
                      value={expenseDraft.amount}
                      onChange={(event) =>
                        onExpenseDraftAmountChange(event.target.value)
                      }
                      className='h-10 w-24 rounded-xl border border-zinc-200/80 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
                    />
                  </div>

                  <div className='flex justify-end gap-1'>
                    <button
                      type='button'
                      onClick={() => onSaveExpense(expense.id)}
                      aria-label='Save expense'
                      className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-900 transition hover:bg-white'
                    >
                      <Check className='h-4 w-4' />
                    </button>

                    <button
                      type='button'
                      onClick={onCancelExpenseEdit}
                      aria-label='Cancel expense edit'
                      className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white hover:text-zinc-700'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-between gap-3'>
                  <span className='min-w-0 flex-1 font-medium text-zinc-800'>
                    {expense.concept}
                  </span>
                  <div className='flex shrink-0 items-center gap-3'>
                    <span className='font-semibold text-zinc-900'>
                      {expense.amount.toFixed(2)}€
                    </span>

                    <button
                      type='button'
                      onClick={() => onEditExpense(expense)}
                      aria-label={`Edit ${expense.concept}`}
                      className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-700'
                    >
                      <Pencil className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
