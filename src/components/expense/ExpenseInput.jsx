import { useEffect, useRef, useState } from 'react';

export default function ExpenseInput({ participants, onAddExpense }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paidBy, setPaidBy] = useState(participants[0]?.id ?? '');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');

  const bottomRef = useRef(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    if (isOpen && isMobile) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 80);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  function handleSubmit(event) {
    event.preventDefault();

    const parsedAmount = parseFloat(amount);

    if (
      !paidBy ||
      !concept.trim() ||
      !amount ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    )
      return;

    const normalizedAmount = Math.round(parsedAmount * 100) / 100;

    const newExpense = {
      id: crypto.randomUUID(),
      paidBy,
      concept: concept.trim(),
      amount: normalizedAmount,
      date: new Date().toISOString(),
    };

    onAddExpense(newExpense);

    setConcept('');
    setAmount('');
    setIsOpen(false);
  }

  return (
    <section className='space-y-3'>
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          isOpen ? 'h-0' : 'h-12'
        }`}
      >
        <button
          type='button'
          onClick={() => setIsOpen(true)}
          className='h-12 w-full rounded-2xl bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800'
        >
          Add expense
        </button>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,transform] duration-300 ease-out ${
          isOpen ? 'max-h-[700px] translate-y-[-12px]' : 'max-h-0'
        }`}
      >
        <div
          className={`transition-opacity duration-700 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='space-y-2'>
            <h2 className='mb-1.5 ms-1 text-lg font-semibold text-zinc-900'>
              Paid by
            </h2>

            <div className='rounded-2xl border border-zinc-200/90 bg-white px-4 py-4 shadow-sm'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  {participants.map((participant) => {
                    const isSelected = paidBy === participant.id;

                    return (
                      <button
                        key={participant.id}
                        type='button'
                        onClick={() => setPaidBy(participant.id)}
                        className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm transition ${
                          isSelected
                            ? 'justify-center border-transparent'
                            : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
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
                    className='h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400'
                  />

                  <input
                    type='text'
                    inputMode='decimal'
                    placeholder='€'
                    value={amount}
                    onChange={(event) => {
                      let value = event.target.value.replace(',', '.');

                      // permet buit
                      if (value === '') {
                        setAmount('');
                        return;
                      }

                      // només números + 1 decimal + màxim 2 decimals
                      if (!/^\d*\.?\d{0,2}$/.test(value)) return;

                      setAmount(value);
                    }}
                    className='h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400'
                  />
                </div>

                <div ref={bottomRef} className='flex gap-2'>
                  <button
                    type='submit'
                    className='h-10 flex-1 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800'
                  >
                    Add
                  </button>

                  <button
                    type='button'
                    onClick={() => setIsOpen(false)}
                    className='h-10 rounded-xl border border-zinc-200 px-4 text-sm text-zinc-600 transition hover:bg-zinc-50'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
