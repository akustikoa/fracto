import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileCheckCorner } from 'lucide-react';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';
import { participantColors } from '../data/participantColors';
import { deleteGroup, updateGroup } from '../lib/api/groups';
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from '../lib/api/expenses';
import { useGroupData } from '../hooks/useGroupData';

import GroupHeader from '../components/group/GroupHeader';
import GroupBottomSheet from '../components/group/GroupBottomSheet';
import BalanceList from '../components/balance/BalanceList';
import ExpenseInput from '../components/expense/ExpenseInput';
import AppHeader from '../components/layout/AppHeader';
import { useLanguage } from '../context/useLanguage';

const MAX_PARTICIPANTS = 10;

export default function GroupPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const { group, setGroup, expenses, setExpenses } = useGroupData(id);
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [draftGroup, setDraftGroup] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);
  const [pendingRemoveExpenseId, setPendingRemoveExpenseId] = useState(null);
  const [draftParticipantExpenses, setDraftParticipantExpenses] = useState([]);

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

  async function handleResetGroup() {
    await deleteGroup(group.id);

    localStorage.removeItem('lastGroupId');
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
            name: t('newParticipant'),
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

  async function handleSaveGroup() {
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

    const updatedGroup = await updateGroup({
      ...draftGroup,
      name: trimmedGroupName,
      participants: updatedParticipants,
    });

    setGroup(updatedGroup);
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

  async function handleSaveParticipantExpenses() {
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

    const participantExpenses = expenses.filter(
      (expense) => expense.paidBy === selectedParticipantId,
    );
    const removedExpenses = participantExpenses.filter(
      (expense) => !normalizedExpenseById.has(expense.id),
    );
    const updatedExpenses = await Promise.all(
      [...normalizedExpenseById.values()].map(updateExpense),
    );
    const updatedExpenseById = new Map(
      updatedExpenses.map((expense) => [expense.id, expense]),
    );

    await Promise.all(
      removedExpenses.map((expense) => deleteExpense(expense.id)),
    );

    setExpenses((previousExpenses) =>
      previousExpenses.flatMap((expense) => {
        if (expense.paidBy !== selectedParticipantId) {
          return [expense];
        }

        const updatedExpense = updatedExpenseById.get(expense.id);

        return updatedExpense ? [updatedExpense] : [];
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
                className='flex items-center justify-center gap-3 h-12 w-full rounded-2xl bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800'
              >
                <FileCheckCorner className='h-5 w-5 shrink-0' />
                {t('reviewAndShare')}
              </button>
            }
          >
            <ExpenseInput
              participants={group.participants}
              onAddExpense={handleAddExpense}
              triggerVariant='secondary'
            />
          </BalanceList>

          <GroupBottomSheet
            isOpen={isSheetOpen}
            groupName={group.name}
            selectedParticipant={selectedParticipant}
            isEditingGroup={isEditingGroup}
            isConfirmingReset={isConfirmingReset}
            draftGroup={draftGroup}
            pendingRemoveId={pendingRemoveId}
            pendingRemoveExpenseId={pendingRemoveExpenseId}
            canSaveDraftGroup={canSaveDraftGroup}
            draftParticipantExpenses={draftParticipantExpenses}
            draftParticipantTotal={draftParticipantTotal}
            maxParticipants={MAX_PARTICIPANTS}
            onClose={handleCloseSheet}
            onResetGroup={handleResetGroup}
            onDraftGroupNameChange={handleDraftGroupNameChange}
            onDraftParticipantNameChange={handleDraftParticipantNameChange}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
            onConfirmRemoveParticipant={confirmRemoveParticipant}
            onCancelPendingRemove={() => setPendingRemoveId(null)}
            onSaveGroup={handleSaveGroup}
            onRemoveExpense={handleRemoveExpense}
            onConfirmRemoveExpense={confirmRemoveExpense}
            onCancelPendingRemoveExpense={() => setPendingRemoveExpenseId(null)}
            onExpenseDraftConceptChange={handleExpenseDraftConceptChange}
            onExpenseDraftAmountChange={handleExpenseDraftAmountChange}
            onSaveParticipantExpenses={handleSaveParticipantExpenses}
          />
        </div>
      </div>
    </main>
  );
}
