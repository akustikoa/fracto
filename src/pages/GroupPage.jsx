import { useState } from 'react';
import { mockGroup } from '../data/mockGroup';
import { mockExpenses } from '../data/mockExpenses';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';

import GroupHeader from '../components/group/GroupHeader';
import BalanceList from '../components/balance/BalanceList';
import ExpenseInput from '../components/expense/ExpenseInput';

export default function GroupPage() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const balances = calculateBalances(mockGroup.participants, expenses);
  const settlements = calculateSettlements(balances);

  function handleAddExpense(newExpense) {
    setExpenses((previousExpenses) => [...previousExpenses, newExpense]);
  }

  return (
    <main className='min-h-screen bg-zinc-100'>
      <div className='mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8'>
        <div className='space-y-7'>
          <GroupHeader group={mockGroup} />

          <BalanceList balances={balances} settlements={settlements} />

          <ExpenseInput
            participants={mockGroup.participants}
            onAddExpense={handleAddExpense}
          />
        </div>
      </div>
    </main>
  );
}
