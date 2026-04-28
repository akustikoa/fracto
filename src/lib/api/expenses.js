import { supabase } from '../supabaseClient';

function mapExpenseRow(row) {
  return {
    id: row.id,
    groupId: row.group_id,
    paidBy: row.paid_by,
    concept: row.concept,
    amount: row.amount,
    date: row.date,
  };
}

export async function createExpense(expense) {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      id: expense.id,
      group_id: expense.groupId,
      paid_by: expense.paidBy,
      concept: expense.concept,
      amount: expense.amount,
      date: expense.date,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapExpenseRow(data);
}

export async function updateExpense(expense) {
  const { data, error } = await supabase
    .from('expenses')
    .update({
      group_id: expense.groupId,
      paid_by: expense.paidBy,
      concept: expense.concept,
      amount: expense.amount,
      date: expense.date,
    })
    .eq('id', expense.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapExpenseRow(data);
}

export async function deleteExpense(expenseId) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) {
    throw error;
  }
}

export async function getExpensesByGroupId(groupId) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('group_id', groupId)
    .order('date', { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapExpenseRow);
}
