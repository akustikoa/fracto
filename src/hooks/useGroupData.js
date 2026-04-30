import { useEffect, useState } from 'react';
import { getGroupById } from '../lib/api/groups';
import { getExpensesByGroupId } from '../lib/api/expenses';

export function useGroupData(id) {
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function loadGroup() {
      const [loadedGroup, loadedExpenses] = await Promise.all([
        getGroupById(id),
        getExpensesByGroupId(id),
      ]);

      setGroup(loadedGroup);
      setExpenses(loadedExpenses);
      localStorage.setItem('lastGroupId', id);
    }

    loadGroup();
  }, [id]);

  return { group, setGroup, expenses, setExpenses };
}
