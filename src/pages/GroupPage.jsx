import { useState } from 'react';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';
import { participantColors } from '../data/participantColors';
import useBottomSheetDrag from '../hooks/useBottomSheetDrag';

import GroupHeader from '../components/group/GroupHeader';
import EditGroupSheet from '../components/group/EditGroupSheet';
import ParticipantSheet from '../components/group/ParticipantSheet';
import BalanceList from '../components/balance/BalanceList';
import ExpenseInput from '../components/expense/ExpenseInput';
import AppHeader from '../components/layout/AppHeader';

export default function GroupPage({ group, setGroup, expenses, setExpenses }) {
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [draftGroup, setDraftGroup] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseDraft, setExpenseDraft] = useState({
    concept: '',
    amount: '',
  });

  const validParticipantIds = group.participants.map((p) => p.id);

  const filteredExpenses = expenses.filter((expense) =>
    validParticipantIds.includes(expense.paidBy),
  );

  const balances = calculateBalances(group.participants, filteredExpenses);
  const settlements = calculateSettlements(balances);

  const selectedParticipant = group.participants.find(
    (participant) => participant.id === selectedParticipantId,
  );

  const participantExpenses = filteredExpenses.filter(
    (expense) => expense.paidBy === selectedParticipantId,
  );

  const participantTotal = participantExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  function handleAddExpense(newExpense) {
    setExpenses((previousExpenses) => [...previousExpenses, newExpense]);
  }

  function closeSheet() {
    setIsSheetOpen(false);

    setTimeout(() => {
      setSelectedParticipantId(null);
      setIsEditingGroup(false);
      setDraftGroup(null);
      setPendingRemoveId(null);
      setEditingExpenseId(null);
    }, 200);
  }

  const {
    dragY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetDrag,
  } = useBottomSheetDrag(closeSheet);

  function handleCloseSheet() {
    resetDrag();
    closeSheet();
  }

  function handleSelectParticipant(participantId) {
    if (selectedParticipantId === participantId) {
      handleCloseSheet();
      return;
    }

    resetDrag();
    setIsEditingGroup(false);
    setEditingExpenseId(null);
    setSelectedParticipantId(participantId);
    setIsSheetOpen(true);
  }

  function handleEditGroup() {
    resetDrag();
    setSelectedParticipantId(null);
    setEditingExpenseId(null);
    setDraftGroup({
      ...group,
      participants: group.participants.map((participant) => ({
        ...participant,
      })),
    });
    setIsEditingGroup(true);
    setIsSheetOpen(true);
  }

  function handleDraftGroupNameChange(name) {
    setDraftGroup((currentGroup) => ({
      ...currentGroup,
      name,
    }));
  }

  function handleDraftParticipantNameChange(participantId, name) {
    setDraftGroup((currentGroup) => ({
      ...currentGroup,
      participants: currentGroup.participants.map((participant) =>
        participant.id === participantId
          ? { ...participant, name }
          : participant,
      ),
    }));
  }

  function handleAddParticipant() {
    setDraftGroup((currentGroup) => {
      const nextIndex = currentGroup.participants.length;

      return {
        ...currentGroup,
        participants: [
          ...currentGroup.participants,
          {
            id: crypto.randomUUID(),
            name: 'New participant',
            initial: 'N',
            color: participantColors[nextIndex % participantColors.length],
          },
        ],
      };
    });
  }

  function handleRemoveParticipant(participantId) {
    const hasExpenses = expenses.some(
      (expense) => expense.paidBy === participantId,
    );

    if (hasExpenses) {
      setPendingRemoveId(participantId);
      return;
    }

    setDraftGroup((currentGroup) => ({
      ...currentGroup,
      participants: currentGroup.participants.filter(
        (participant) => participant.id !== participantId,
      ),
    }));
  }

  function confirmRemoveParticipant() {
    setDraftGroup((currentGroup) => ({
      ...currentGroup,
      participants: currentGroup.participants.filter(
        (participant) => participant.id !== pendingRemoveId,
      ),
    }));

    setPendingRemoveId(null);
  }

  function handleSaveGroup() {
    const trimmedGroupName = draftGroup.name.trim();
    const updatedParticipants = draftGroup.participants.map((participant) => {
      const trimmedName = participant.name.trim();

      return {
        ...participant,
        name: trimmedName,
        initial: trimmedName ? trimmedName.charAt(0).toUpperCase() : '',
      };
    });

    if (
      !trimmedGroupName ||
      updatedParticipants.length === 0 ||
      updatedParticipants.some((participant) => !participant.name)
    ) {
      return;
    }

    setGroup({
      ...draftGroup,
      name: trimmedGroupName,
      participants: updatedParticipants,
    });
    handleCloseSheet();
  }

  function handleEditExpense(expense) {
    setEditingExpenseId(expense.id);
    setExpenseDraft({
      concept: expense.concept,
      amount: String(expense.amount),
    });
  }

  function handleExpenseDraftAmountChange(value) {
    const normalizedValue = value.replace(',', '.');

    if (normalizedValue === '' || /^\d*\.?\d{0,2}$/.test(normalizedValue)) {
      setExpenseDraft((currentDraft) => ({
        ...currentDraft,
        amount: normalizedValue,
      }));
    }
  }

  function handleExpenseDraftConceptChange(value) {
    setExpenseDraft((currentDraft) => ({
      ...currentDraft,
      concept: value,
    }));
  }

  function handleSaveExpense(expenseId) {
    const parsedAmount = parseFloat(expenseDraft.amount);

    if (
      !expenseDraft.concept.trim() ||
      !expenseDraft.amount ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return;
    }

    const normalizedAmount = Math.round(parsedAmount * 100) / 100;

    setExpenses((previousExpenses) =>
      previousExpenses.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              concept: expenseDraft.concept.trim(),
              amount: normalizedAmount,
            }
          : expense,
      ),
    );

    setEditingExpenseId(null);
  }

  function handleCancelExpenseEdit() {
    setEditingExpenseId(null);
  }

  const canSaveDraftGroup =
    draftGroup?.name.trim() &&
    draftGroup.participants.length > 0 &&
    draftGroup.participants.every((participant) => participant.name.trim());

  return (
    <main className='min-h-screen bg-zinc-50'>
      <AppHeader groupId={group.id} variant='group' />

      <div className='mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8'>
        <div className='space-y-6'>
          <GroupHeader group={group} />

          <BalanceList
            balances={balances}
            settlements={settlements}
            onSelectParticipant={handleSelectParticipant}
            onEditGroup={handleEditGroup}
          >
            <ExpenseInput
              participants={group.participants}
              onAddExpense={handleAddExpense}
            />
          </BalanceList>

          {(selectedParticipant || isEditingGroup) && (
            <div className='fixed inset-0 z-50 flex items-end justify-center'>
              <div
                className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                  isSheetOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleCloseSheet}
              />

              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className='relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white px-5 pt-5 pb-8 shadow-[0_-6px_20px_rgba(0,0,0,0.10)] transition-transform duration-300 mb-[calc(env(safe-area-inset-bottom)+12px)]'
                style={{
                  transform: isSheetOpen
                    ? `translateY(${dragY}px)`
                    : 'translateY(100%)',
                }}
              >
                <div className='mb-4 flex justify-center'>
                  <div className='h-1.5 w-10 rounded-full bg-zinc-300' />
                </div>

                {isEditingGroup && draftGroup ? (
                  <EditGroupSheet
                    draftGroup={draftGroup}
                    pendingRemoveId={pendingRemoveId}
                    canSaveDraftGroup={canSaveDraftGroup}
                    onDraftGroupNameChange={handleDraftGroupNameChange}
                    onDraftParticipantNameChange={
                      handleDraftParticipantNameChange
                    }
                    onAddParticipant={handleAddParticipant}
                    onRemoveParticipant={handleRemoveParticipant}
                    onConfirmRemoveParticipant={confirmRemoveParticipant}
                    onCancelPendingRemove={() => setPendingRemoveId(null)}
                    onSaveGroup={handleSaveGroup}
                    onCancel={handleCloseSheet}
                  />
                ) : selectedParticipant ? (
                  <ParticipantSheet
                    selectedParticipant={selectedParticipant}
                    participantTotal={participantTotal}
                    participantExpenses={participantExpenses}
                    editingExpenseId={editingExpenseId}
                    expenseDraft={expenseDraft}
                    onEditExpense={handleEditExpense}
                    onExpenseDraftConceptChange={
                      handleExpenseDraftConceptChange
                    }
                    onExpenseDraftAmountChange={handleExpenseDraftAmountChange}
                    onSaveExpense={handleSaveExpense}
                    onCancelExpenseEdit={handleCancelExpenseEdit}
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
