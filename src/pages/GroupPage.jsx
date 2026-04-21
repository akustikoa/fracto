import { useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';
import { participantColors } from '../data/participantColors';

import GroupHeader from '../components/group/GroupHeader';
import BalanceList from '../components/balance/BalanceList';
import ExpenseInput from '../components/expense/ExpenseInput';

export default function GroupPage({ group, setGroup, expenses, setExpenses }) {
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [draftGroup, setDraftGroup] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);

  const startYRef = useRef(null);

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
    setDragY(0);

    setTimeout(() => {
      setSelectedParticipantId(null);
      setIsEditingGroup(false);
      setDraftGroup(null);
      setPendingRemoveId(null);
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
    if (selectedParticipantId === participantId) {
      closeSheet();
      return;
    }

    setDragY(0);
    setIsEditingGroup(false);
    setSelectedParticipantId(participantId);
    setIsSheetOpen(true);
  }

  function handleEditGroup() {
    setDragY(0);
    setSelectedParticipantId(null);
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
    closeSheet();
  }

  const canSaveDraftGroup =
    draftGroup?.name.trim() &&
    draftGroup.participants.length > 0 &&
    draftGroup.participants.every((participant) => participant.name.trim());

  return (
    <main className='min-h-screen bg-zinc-50'>
      <div className='mx-auto max-w-3xl px-4 py-7 md:px-6 md:py-9'>
        <div className='space-y-6'>
          <GroupHeader group={group} />

          <BalanceList
            balances={balances}
            settlements={settlements}
            onSelectParticipant={handleSelectParticipant}
            onEditGroup={handleEditGroup}
          />

          {(selectedParticipant || isEditingGroup) && (
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
                className='relative w-full max-w-md rounded-t-3xl bg-white px-5 pt-5 shadow-[0_-6px_20px_rgba(0,0,0,0.10)] transition-transform duration-300'
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
                  <div className='space-y-4 pb-[calc(env(safe-area-inset-bottom)+16px)]'>
                    <div className='space-y-1'>
                      <label className='text-xs font-medium text-zinc-400'>
                        Edit group
                      </label>
                      <input
                        type='text'
                        value={draftGroup.name}
                        onChange={(event) =>
                          handleDraftGroupNameChange(event.target.value)
                        }
                        className='h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-3 text-lg font-semibold text-zinc-900 outline-none transition hover:border-zinc-200/80 focus:border-zinc-300'
                      />
                    </div>

                    <div className='space-y-2'>
                      {draftGroup.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className='space-y-1.5'
                        >
                          {pendingRemoveId === participant.id ? (
                            <div className='flex items-center gap-2 rounded-xl bg-zinc-50 px-2 py-2'>
                              <span
                                className='h-3 w-3 shrink-0 rounded-full'
                                style={{ backgroundColor: participant.color }}
                              />
                              <p className='min-w-0 flex-1 text-sm text-zinc-700'>
                                Remove {participant.name} and their expenses?
                              </p>
                              <div className='flex shrink-0 gap-1.5'>
                                <button
                                  type='button'
                                  onClick={confirmRemoveParticipant}
                                  className='h-8 rounded-lg px-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100'
                                >
                                  Delete
                                </button>

                                <button
                                  type='button'
                                  onClick={() => setPendingRemoveId(null)}
                                  className='h-8 rounded-lg px-2.5 text-sm text-zinc-600 transition hover:bg-white'
                                >
                                  Keep
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className='flex items-center gap-2'>
                              <span
                                className='h-3 w-3 shrink-0 rounded-full'
                                style={{ backgroundColor: participant.color }}
                              />
                              <input
                                type='text'
                                value={participant.name}
                                onChange={(event) =>
                                  handleDraftParticipantNameChange(
                                    participant.id,
                                    event.target.value,
                                  )
                                }
                                className='h-10 min-w-0 flex-1 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
                              />
                              <button
                                type='button'
                                onClick={() =>
                                  handleRemoveParticipant(participant.id)
                                }
                                disabled={draftGroup.participants.length <= 1}
                                aria-label={`Remove ${participant.name}`}
                                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-600 disabled:opacity-40'
                              >
                                <Trash2 className='h-4 w-4' />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type='button'
                      onClick={handleAddParticipant}
                      className='h-10 w-full rounded-xl border border-dashed border-zinc-300 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50'
                    >
                      + Add participant
                    </button>

                    <div className='flex gap-2'>
                      <button
                        type='button'
                        onClick={handleSaveGroup}
                        disabled={!canSaveDraftGroup}
                        className='h-10 flex-1 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-40'
                      >
                        Save
                      </button>
                      <button
                        type='button'
                        onClick={closeSheet}
                        className='h-10 rounded-xl border border-zinc-200/80 px-4 text-sm text-zinc-600 transition hover:bg-zinc-50'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : selectedParticipant ? (
                  <>
                    <div className='mb-5 flex items-center justify-between gap-3'>
                      <div className='flex min-w-0 items-center gap-2'>
                        <span
                          className='h-3 w-3 shrink-0 rounded-full'
                          style={{ backgroundColor: selectedParticipant.color }}
                        />
                        <h3 className='truncate text-base font-semibold text-zinc-900'>
                          {selectedParticipant.name}
                        </h3>
                      </div>

                      <span className='shrink-0 text-base font-semibold text-zinc-900'>
                        {participantTotal.toFixed(2)}€
                      </span>
                    </div>

                    <div className='space-y-3 pb-[calc(env(safe-area-inset-bottom)+16px)]'>
                      {participantExpenses.length === 0 ? (
                        <p className='text-sm text-zinc-400'>No expenses yet</p>
                      ) : (
                        participantExpenses.map((expense) => (
                          <div
                            key={expense.id}
                            className='flex items-center justify-between py-2.5 text-sm'
                          >
                            <span className='font-medium text-zinc-800'>
                              {expense.concept}
                            </span>
                            <span className='font-semibold text-zinc-900'>
                              {expense.amount.toFixed(2)}€
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : null}
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
