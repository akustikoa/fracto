import { useState } from 'react';

export default function ExpenseInput({ participants, onAddExpense }) {
  const [paidBy, setPaidBy] = useState(participants[0]?.id ?? '');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!concept.trim() || !amount) return;

    const newExpense = {
      id: crypto.randomUUID(),
      paidBy,
      concept: concept.trim(),
      amount: Number(amount),
      date: new Date().toISOString(),
    };

    onAddExpense(newExpense);

    setConcept('');
    setAmount('');
  }

  return (
    <section className="rounded-2xl border border-zinc-200/90 bg-white px-4 py-4 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto_auto]">
          <select
            value={paidBy}
            onChange={(event) => setPaidBy(event.target.value)}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-400"
          >
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Concepte"
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
          />

          <input
            type="number"
            placeholder="€"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 sm:w-24"
          />

          <button
            type="submit"
            className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Add
          </button>
        </div>
      </form>
    </section>
  );
}