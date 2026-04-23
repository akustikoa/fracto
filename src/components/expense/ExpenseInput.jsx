import { useState } from 'react';
import { X } from 'lucide-react';

export default function ExpenseInput({
  participants,
  onAddExpense,
  triggerVariant = 'primary',
}) {
  const [isRendered, setIsRendered] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paidBy, setPaidBy] = useState(participants[0]?.id ?? '');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');

  const activePaidBy = participants.some(
    (participant) => participant.id === paidBy,
  )
    ? paidBy
    : (participants[0]?.id ?? '');

  function openSheet() {
    setIsRendered(true);
    window.setTimeout(() => setIsSheetOpen(true), 0);
  }

  function closeSheet() {
    setIsSheetOpen(false);

    window.setTimeout(() => {
      setIsRendered(false);
    }, 200);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const parsedAmount = parseFloat(amount);

    if (
      !activePaidBy ||
      !concept.trim() ||
      !amount ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    )
      return;

    const normalizedAmount = Math.round(parsedAmount * 100) / 100;

    const newExpense = {
      id: crypto.randomUUID(),
      paidBy: activePaidBy,
      concept: concept.trim(),
      amount: normalizedAmount,
      date: new Date().toISOString(),
    };

    onAddExpense(newExpense);

    setConcept('');
    setAmount('');
    closeSheet();
  }

  const triggerClassName =
    triggerVariant === 'secondary'
      ? 'h-11 w-full rounded-xl border border-zinc-200/80 bg-zinc-100 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-800'
      : 'h-12 w-full rounded-2xl bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800';

  return (
    <>
      <button type='button' onClick={openSheet} className={triggerClassName}>
        Add expense
      </button>

      {isRendered && (
        <div className='fixed inset-0 z-50 flex items-end justify-center'>
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
              isSheetOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeSheet}
          />

          <div
            className='relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-6px_20px_rgba(0,0,0,0.10)] transition-transform duration-300'
            style={{
              transform: isSheetOpen ? 'translateY(0)' : 'translateY(100%)',
            }}
          >
            <div className='mb-2 flex justify-end'>
              <button
                type='button'
                onClick={closeSheet}
                aria-label='Close sheet'
                className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-zinc-700'>
                  Add expense
                </label>
              </div>

              <div className='flex flex-wrap gap-3'>
                {participants.map((participant) => {
                  const isSelected = activePaidBy === participant.id;

                  return (
                    <button
                      key={participant.id}
                      type='button'
                      onClick={() => setPaidBy(participant.id)}
                      className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm transition ${
                        isSelected
                          ? 'justify-center border-transparent'
                          : 'border-zinc-200/80 bg-zinc-50 hover:border-zinc-300 hover:bg-white'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? participant.color
                          : undefined,
                      }}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isSelected ? 'invisible' : ''
                        }`}
                        style={{ backgroundColor: participant.color }}
                      />

                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-zinc-800'
                        }`}
                      >
                        {participant.name}
                      </span>

                      <span className='invisible w-2.5' />
                    </button>
                  );
                })}
              </div>

              <div className='space-y-3'>
                <input
                  type='text'
                  placeholder='Concept'
                  value={concept}
                  onChange={(event) => setConcept(event.target.value)}
                  className='h-10 w-full rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300'
                />

                <input
                  type='text'
                  inputMode='decimal'
                  placeholder='€'
                  value={amount}
                  onChange={(event) => {
                    const value = event.target.value.replace(',', '.');

                    if (value === '') {
                      setAmount('');
                      return;
                    }

                    if (!/^\d*\.?\d{0,2}$/.test(value)) return;

                    setAmount(value);
                  }}
                  className='h-10 w-full rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300'
                />
              </div>

              <div className='flex gap-2'>
                <button
                  type='submit'
                  className='h-10 flex-1 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800'
                >
                  Add
                </button>

                <button
                  type='button'
                  onClick={closeSheet}
                  className='h-10 rounded-xl border border-zinc-200/80 px-4 text-sm text-zinc-600 transition hover:bg-zinc-50'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
