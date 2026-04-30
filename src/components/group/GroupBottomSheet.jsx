import { X } from 'lucide-react';
import EditGroupSheet from './EditGroupSheet';
import ParticipantSheet from './ParticipantSheet';
import { useLanguage } from '../../context/useLanguage';

export default function GroupBottomSheet({
  isOpen,
  groupName,
  selectedParticipant,
  isEditingGroup,
  isConfirmingReset,
  draftGroup,
  pendingRemoveId,
  pendingRemoveExpenseId,
  canSaveDraftGroup,
  draftParticipantExpenses,
  draftParticipantTotal,
  maxParticipants,
  onClose,
  onResetGroup,
  onDraftGroupNameChange,
  onDraftParticipantNameChange,
  onAddParticipant,
  onRemoveParticipant,
  onConfirmRemoveParticipant,
  onCancelPendingRemove,
  onSaveGroup,
  onRemoveExpense,
  onConfirmRemoveExpense,
  onCancelPendingRemoveExpense,
  onExpenseDraftConceptChange,
  onExpenseDraftAmountChange,
  onSaveParticipantExpenses,
}) {
  const { t } = useLanguage();

  if (!selectedParticipant && !isEditingGroup && !isConfirmingReset) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center'>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className='relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-[0_-6px_20px_rgba(0,0,0,0.10)] transition-transform duration-300'
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className='mb-1 flex justify-end'>
          <button
            type='button'
            onClick={onClose}
            aria-label={t('closeSheet')}
            className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {isConfirmingReset ? (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-zinc-700'>
                {t('deleteGroup')}
              </label>
              <p className='text-sm leading-6 text-zinc-600'>
                {t('deleteGroupPromptStart')} {groupName}{' '}
                {t('deleteGroupPromptEnd')}
              </p>
            </div>

            <div className='flex gap-2'>
              <button
                type='button'
                onClick={onResetGroup}
                className='h-10 flex-1 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-500'
              >
                {t('deleteGroup')}
              </button>
              <button
                type='button'
                onClick={onClose}
                className='h-10 rounded-xl border border-zinc-200/80 px-4 text-sm text-zinc-600 transition hover:bg-zinc-50'
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        ) : isEditingGroup && draftGroup ? (
          <EditGroupSheet
            draftGroup={draftGroup}
            pendingRemoveId={pendingRemoveId}
            canSaveDraftGroup={canSaveDraftGroup}
            onDraftGroupNameChange={onDraftGroupNameChange}
            onDraftParticipantNameChange={onDraftParticipantNameChange}
            onAddParticipant={onAddParticipant}
            onRemoveParticipant={onRemoveParticipant}
            onConfirmRemoveParticipant={onConfirmRemoveParticipant}
            onCancelPendingRemove={onCancelPendingRemove}
            onSaveGroup={onSaveGroup}
            onCancel={onClose}
            maxParticipants={maxParticipants}
          />
        ) : selectedParticipant ? (
          <ParticipantSheet
            selectedParticipant={selectedParticipant}
            participantTotal={draftParticipantTotal}
            draftExpenses={draftParticipantExpenses}
            pendingRemoveExpenseId={pendingRemoveExpenseId}
            onRemoveExpense={onRemoveExpense}
            onConfirmRemoveExpense={onConfirmRemoveExpense}
            onCancelPendingRemoveExpense={onCancelPendingRemoveExpense}
            onExpenseDraftConceptChange={onExpenseDraftConceptChange}
            onExpenseDraftAmountChange={onExpenseDraftAmountChange}
            onSave={onSaveParticipantExpenses}
            onCancel={onClose}
          />
        ) : null}
      </div>
    </div>
  );
}
