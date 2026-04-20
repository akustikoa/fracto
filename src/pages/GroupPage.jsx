import { useRef, useState } from 'react';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';

import GroupHeader from '../components/group/GroupHeader';
import BalanceList from '../components/balance/BalanceList';
import ExpenseInput from '../components/expense/ExpenseInput';

export default function GroupPage({ group, expenses, setExpenses }) {
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dragY, setDragY] = useState(0);

  const startYRef = useRef(null);

  const balances = calculateBalances(group.participants, expenses);
  const settlements = calculateSettlements(balances);

  const selectedParticipant = group.participants.find(
    (participant) => participant.id === selectedParticipantId,
  );

  const participantExpenses = expenses.filter(
    (expense) => expense.paidBy === selectedParticipantId,
  );

  function handleAddExpense(newExpense) {
    setExpenses((previousExpenses) => [...previousExpenses, newExpense]);
  }

  function closeSheet() {
    setIsSheetOpen(false);
    setDragY(0);

    setTimeout(() => {
      setSelectedParticipantId(null);
    }, 200);
  }

  function handleTouchStart(event) {
    startYRef.current = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (!startYRef.current) return;

    const currentY = event.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      setDragY(diff);
    }
  }

  function handleTouchEnd() {
    if (dragY > 100) {
      closeSheet();
    } else {
      setDragY(0);
    }

    startYRef.current = null;
  }

  function handleSelectParticipant(participantId) {
    setDragY(0);
    setSelectedParticipantId(participantId);
    setIsSheetOpen(true);
  }

  return (
    <main className='min-h-screen bg-zinc-100'>
      <div className='mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8'>
        <div className='space-y-7'>
          <GroupHeader group={group} />

          <BalanceList
            balances={balances}
            settlements={settlements}
            onSelectParticipant={handleSelectParticipant}
          />

          {selectedParticipant && (
            <div className='fixed inset-0 z-50 flex items-end justify-center'>
              <div
                className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                  isSheetOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={closeSheet}
              />

              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className='relative w-full max-w-md rounded-t-3xl bg-white px-5 pt-5 shadow-lg transition-transform duration-300'
                style={{
                  transform: isSheetOpen
                    ? `translateY(${dragY}px)`
                    : 'translateY(100%)',
                }}
              >
                <div className='mb-4 flex justify-center'>
                  <div className='h-1.5 w-10 rounded-full bg-zinc-300' />
                </div>

                <div className='mb-4 flex items-center gap-2'>
                  <span
                    className='h-3 w-3 rounded-full'
                    style={{ backgroundColor: selectedParticipant.color }}
                  />
                  <h3 className='text-sm font-semibold text-zinc-800'>
                    {selectedParticipant.name}
                  </h3>
                </div>

                <div className='space-y-2 pb-[calc(env(safe-area-inset-bottom)+16px)]'>
                  {participantExpenses.length === 0 ? (
                    <p className='text-sm text-zinc-400'>No expenses yet</p>
                  ) : (
                    participantExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className='flex items-center justify-between text-sm'
                      >
                        <span className='text-zinc-700'>{expense.concept}</span>
                        <span className='font-medium text-zinc-900'>
                          {expense.amount.toFixed(2)}€
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <ExpenseInput
            participants={group.participants}
            onAddExpense={handleAddExpense}
          />
        </div>
      </div>
    </main>
  );
}
