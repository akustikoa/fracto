import { Trash2 } from 'lucide-react';

export default function ParticipantSheet({
  selectedParticipant,
  participantTotal,
  draftExpenses,
  onRemoveExpense,
  onExpenseDraftConceptChange,
  onExpenseDraftAmountChange,
  onSave,
  onCancel,
}) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between gap-3'>
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

      <div className='space-y-4'>
        {draftExpenses.length === 0 ? (
          <p className='text-sm text-zinc-400'>No expenses yet</p>
        ) : (
          draftExpenses.map((expense) => (
            <div key={expense.id} className='flex items-center gap-2'>
              <input
                type='text'
                value={expense.concept}
                onChange={(event) =>
                  onExpenseDraftConceptChange(expense.id, event.target.value)
                }
                className='h-10 min-w-0 flex-1 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
              />

              <input
                type='text'
                inputMode='decimal'
                value={expense.amount}
                onChange={(event) =>
                  onExpenseDraftAmountChange(expense.id, event.target.value)
                }
                className='h-10 w-24 shrink-0 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
              />

              <button
                type='button'
                onClick={() => onRemoveExpense(expense.id)}
                aria-label={`Remove ${expense.concept}`}
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-600'
              >
                <Trash2 className='h-4 w-4' />
              </button>
            </div>
          ))
        )}
      </div>

      <div className='flex gap-2'>
        <button
          type='button'
          onClick={onSave}
          className='h-10 flex-1 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800'
        >
          Save
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='h-10 rounded-xl border border-zinc-200/80 px-4 text-sm text-zinc-600 transition hover:bg-zinc-50'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
