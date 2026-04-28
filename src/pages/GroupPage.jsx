import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';
import { participantColors } from '../data/participantColors';
import { getGroupById } from '../lib/api/groups';
import { createExpense, getExpensesByGroupId } from '../lib/api/expenses';

import GroupHeader from '../components/group/GroupHeader';
import EditGroupSheet from '../components/group/EditGroupSheet';
import ParticipantSheet from '../components/group/ParticipantSheet';
import BalanceList from '../components/balance/BalanceList';
import ExpenseInput from '../components/expense/ExpenseInput';
import AppHeader from '../components/layout/AppHeader';

const MAX_PARTICIPANTS = 10;

export default function GroupPage({ group, setGroup, expenses, setExpenses }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [draftGroup, setDraftGroup] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);
  const [pendingRemoveExpenseId, setPendingRemoveExpenseId] = useState(null);
  const [draftParticipantExpenses, setDraftParticipantExpenses] = useState([]);

  useEffect(() => {
    async function loadGroup() {
      const [loadedGroup, loadedExpenses] = await Promise.all([
        getGroupById(id),
        getExpensesByGroupId(id),
      ]);

      setGroup(loadedGroup);
      setExpenses(loadedExpenses);
    }

    loadGroup();
  }, [id, setExpenses, setGroup]);

  if (!group) {
    return null;
  }

  const validParticipantIds = group.participants.map((p) => p.id);

  const filteredExpenses = expenses.filter((expense) =>
    validParticipantIds.includes(expense.paidBy),
  );

  const balances = calculateBalances(group.participants, filteredExpenses);
  const settlements = calculateSettlements(balances);

  const selectedParticipant = group.participants.find(
    (participant) => participant.id === selectedParticipantId,
  );

  const draftParticipantTotal = draftParticipantExpenses.reduce(
    (sum, expense) => {
      const parsedAmount = parseFloat(expense.amount);

      return isNaN(parsedAmount) ? sum : sum + parsedAmount;
    },
    0,
  );

  async function handleAddExpense(newExpense) {
    const createdExpense = await createExpense({
      ...newExpense,
      groupId: id,
    });

    setExpenses((previousExpenses) => [...previousExpenses, createdExpense]);
  }

  function handleResetRequest() {
    setSelectedParticipantId(null);
    setIsEditingGroup(false);
    setDraftGroup(null);
    setPendingRemoveId(null);
    setPendingRemoveExpenseId(null);
    setDraftParticipantExpenses([]);
    setIsConfirmingReset(true);
    setIsSheetOpen(true);
  }

  function handleResetGroup() {
    setGroup(null);
    setExpenses([]);
    navigate('/');
  }

  function closeSheet() {
    setIsSheetOpen(false);

    setTimeout(() => {
      setSelectedParticipantId(null);
      setIsEditingGroup(false);
      setIsConfirmingReset(false);
      setDraftGroup(null);
      setPendingRemoveId(null);
      setPendingRemoveExpenseId(null);
      setDraftParticipantExpenses([]);
    }, 200);
  }

  function handleCloseSheet() {
    closeSheet();
  }

  function handleSelectParticipant(participantId) {
    if (selectedParticipantId === participantId) {
      handleCloseSheet();
      return;
    }

    setIsEditingGroup(false);
    setPendingRemoveExpenseId(null);
    setDraftParticipantExpenses(
      filteredExpenses
        .filter((expense) => expense.paidBy === participantId)
        .map((expense) => ({
          ...expense,
          amount: String(expense.amount),
        })),
    );
    setSelectedParticipantId(participantId);
    setIsSheetOpen(true);
  }

  function handleEditGroup() {
    setSelectedParticipantId(null);
    setPendingRemoveExpenseId(null);
    setDraftParticipantExpenses([]);
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
      if (currentGroup.participants.length >= MAX_PARTICIPANTS) {
        return currentGroup;
      }

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

  function handleExpenseDraftConceptChange(expenseId, value) {
    setDraftParticipantExpenses((currentDraft) =>
      currentDraft.map((expense) =>
        expense.id === expenseId ? { ...expense, concept: value } : expense,
      ),
    );
  }

  function handleExpenseDraftAmountChange(expenseId, value) {
    const normalizedValue = value.replace(',', '.');

    if (normalizedValue === '' || /^\d*\.?\d{0,2}$/.test(normalizedValue)) {
      setDraftParticipantExpenses((currentDraft) =>
        currentDraft.map((expense) =>
          expense.id === expenseId
            ? { ...expense, amount: normalizedValue }
            : expense,
        ),
      );
    }
  }

  function handleRemoveExpense(expenseId) {
    setPendingRemoveExpenseId(expenseId);
  }

  function confirmRemoveExpense() {
    setDraftParticipantExpenses((currentDraft) =>
      currentDraft.filter((expense) => expense.id !== pendingRemoveExpenseId),
    );
    setPendingRemoveExpenseId(null);
  }

  function handleSaveParticipantExpenses() {
    const hasInvalidExpense = draftParticipantExpenses.some((expense) => {
      const parsedAmount = parseFloat(expense.amount);

      return (
        !expense.concept.trim() ||
        !expense.amount ||
        isNaN(parsedAmount) ||
        parsedAmount <= 0
      );
    });

    if (hasInvalidExpense) {
      return;
    }

    const normalizedExpenseById = new Map(
      draftParticipantExpenses.map((expense) => {
        const parsedAmount = parseFloat(expense.amount);

        return [
          expense.id,
          {
            ...expense,
            concept: expense.concept.trim(),
            amount: Math.round(parsedAmount * 100) / 100,
          },
        ];
      }),
    );

    setExpenses((previousExpenses) =>
      previousExpenses.flatMap((expense) => {
        if (expense.paidBy !== selectedParticipantId) {
          return [expense];
        }

        const normalizedExpense = normalizedExpenseById.get(expense.id);

        return normalizedExpense ? [normalizedExpense] : [];
      }),
    );

    handleCloseSheet();
  }

  const canSaveDraftGroup =
    draftGroup?.name.trim() &&
    draftGroup.participants.length > 0 &&
    draftGroup.participants.every((participant) => participant.name.trim());
    

  return (
    <main className='min-h-screen bg-zinc-50'>
      <AppHeader groupId={group.id} variant='group' />

      <div className='mx-auto max-w-3xl px-4 py-5 md:px-6 md:py-6'>
        <div className='space-y-4'>
          <GroupHeader group={group} />

          <BalanceList
            balances={balances}
            settlements={settlements}
            onSelectParticipant={handleSelectParticipant}
            onEditGroup={handleEditGroup}
            onResetGroup={handleResetRequest}
            footerAction={
              <button
                type='button'
                onClick={() => navigate(`/details/${group.id}`)}
                className='h-12 w-full rounded-2xl bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800'
              >
                Review & share
              </button>
            }
          >
            <ExpenseInput
              participants={group.participants}
              onAddExpense={handleAddExpense}
              triggerVariant='secondary'
            />
          </BalanceList>

          {(selectedParticipant || isEditingGroup || isConfirmingReset) && (
            <div className='fixed inset-0 z-50 flex items-end justify-center'>
              <div
                className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
                  isSheetOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleCloseSheet}
              />

              <div
                className='relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-6px_20px_rgba(0,0,0,0.10)] transition-transform duration-300'
                style={{
                  transform: isSheetOpen ? 'translateY(0)' : 'translateY(100%)',
                }}
              >
                <div className='mb-1 flex justify-end'>
                  <button
                    type='button'
                    onClick={handleCloseSheet}
                    aria-label='Close sheet'
                    className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>

                {isConfirmingReset ? (
                  <div className='space-y-6'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium text-zinc-700'>
                        Delete group
                      </label>
                      <p className='text-sm leading-6 text-zinc-600'>
                        Do you want to delete group {group.name} and all
                        expenses? This action cannot be undone.
                      </p>
                    </div>

                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={handleResetGroup}
                        className='h-10 flex-1 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-500'
                      >
                        Delete group
                      </button>
                      <button
                        type='button'
                        onClick={handleCloseSheet}
                        className='h-10 rounded-xl border border-zinc-200/80 px-4 text-sm text-zinc-600 transition hover:bg-zinc-50'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : isEditingGroup && draftGroup ? (
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
                    maxParticipants={MAX_PARTICIPANTS}
                  />
                ) : selectedParticipant ? (
                  <ParticipantSheet
                    selectedParticipant={selectedParticipant}
                    participantTotal={draftParticipantTotal}
                    draftExpenses={draftParticipantExpenses}
                    pendingRemoveExpenseId={pendingRemoveExpenseId}
                    onRemoveExpense={handleRemoveExpense}
                    onConfirmRemoveExpense={confirmRemoveExpense}
                    onCancelPendingRemoveExpense={() =>
                      setPendingRemoveExpenseId(null)
                    }
                    onExpenseDraftConceptChange={
                      handleExpenseDraftConceptChange
                    }
                    onExpenseDraftAmountChange={handleExpenseDraftAmountChange}
                    onSave={handleSaveParticipantExpenses}
                    onCancel={handleCloseSheet}
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
