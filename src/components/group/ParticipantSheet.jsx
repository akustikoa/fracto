import { Check, Trash2, X } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';

export default function ParticipantSheet({
  selectedParticipant,
  participantTotal,
  draftExpenses,
  pendingRemoveExpenseId,
  onRemoveExpense,
  onConfirmRemoveExpense,
  onCancelPendingRemoveExpense,
  onExpenseDraftConceptChange,
  onExpenseDraftAmountChange,
  onSave,
  onCancel,
}) {
  const { t } = useLanguage();

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
          <p className='text-sm text-zinc-400'>{t('noExpensesYet')}</p>
        ) : (
          draftExpenses.map((expense) => {
            const expenseConcept = expense.concept.trim() || t('thisExpense');
            const expenseAmount = expense.amount || '0';
            const isPendingRemove = pendingRemoveExpenseId === expense.id;

            return (
              <div key={expense.id} className='space-y-1.5'>
                {isPendingRemove ? (
                  <div className='flex items-center gap-2 rounded-xl bg-zinc-50 px-2 py-2'>
                    <span
                      className='h-3 w-3 shrink-0 rounded-full'
                      style={{ backgroundColor: selectedParticipant.color }}
                    />
                    <p className='min-w-0 flex-1 text-sm text-zinc-700'>
                      {t('remove')} {expenseConcept} ({expenseAmount}€)?
                    </p>
                    <div className='flex shrink-0 gap-1'>
                      <button
                        type='button'
                        onClick={onConfirmRemoveExpense}
                        aria-label={`${t('delete')} ${expenseConcept}`}
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-900 transition hover:bg-white'
                      >
                        <Check className='h-4 w-4' />
                      </button>

                      <button
                        type='button'
                        onClick={onCancelPendingRemoveExpense}
                        aria-label={`${t('keep')} ${expenseConcept}`}
                        className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white hover:text-zinc-700'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      value={expense.concept}
                      onChange={(event) =>
                        onExpenseDraftConceptChange(
                          expense.id,
                          event.target.value,
                        )
                      }
                      className='h-10 min-w-0 flex-1 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
                    />

                    <input
                      type='text'
                      inputMode='decimal'
                      value={expense.amount}
                      onChange={(event) =>
                        onExpenseDraftAmountChange(
                          expense.id,
                          event.target.value,
                        )
                      }
                      className='h-10 w-24 shrink-0 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
                    />

                    <button
                      type='button'
                      onClick={() => onRemoveExpense(expense.id)}
                      aria-label={`${t('remove')} ${expenseConcept}`}
                      className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-600'
                    >
                      <Trash2 className='h-4.5 w-4.5' />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className='flex gap-2'>
        <button
          type='button'
          onClick={onSave}
          className='h-10 flex-1 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800'
        >
          {t('save')}
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='h-10 rounded-xl border border-zinc-200/80 px-4 text-sm text-zinc-600 transition hover:bg-zinc-50'
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}
