import { Check, Trash2, X } from 'lucide-react';

export default function EditGroupSheet({
  draftGroup,
  pendingRemoveId,
  canSaveDraftGroup,
  onDraftGroupNameChange,
  onDraftParticipantNameChange,
  onAddParticipant,
  onRemoveParticipant,
  onConfirmRemoveParticipant,
  onCancelPendingRemove,
  onSaveGroup,
  onCancel,
}) {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-zinc-700'>
          Edit group
        </label>
        <input
          type='text'
          value={draftGroup.name}
          onChange={(event) => onDraftGroupNameChange(event.target.value)}
          className='h-10 min-w-0 flex-1 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
        />
      </div>

      <div className='space-y-4'>
        {draftGroup.participants.map((participant) => (
          <div key={participant.id} className='space-y-1.5'>
            {pendingRemoveId === participant.id ? (
              <div className='flex items-center gap-2 rounded-xl bg-zinc-50 px-2 py-2'>
                <span
                  className='h-3 w-3 shrink-0 rounded-full'
                  style={{ backgroundColor: participant.color }}
                />
                <p className='min-w-0 flex-1 text-sm text-zinc-700'>
                  Remove {participant.name} and their expenses?
                </p>
                <div className='flex shrink-0 gap-1'>
                  <button
                    type='button'
                    onClick={onConfirmRemoveParticipant}
                    aria-label={`Delete ${participant.name}`}
                    className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-900 transition hover:bg-white'
                  >
                    <Check className='h-4 w-4' />
                  </button>

                  <button
                    type='button'
                    onClick={onCancelPendingRemove}
                    aria-label={`Keep ${participant.name}`}
                    className='flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white hover:text-zinc-700'
                  >
                    <X className='h-4 w-4' />
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
                    onDraftParticipantNameChange(
                      participant.id,
                      event.target.value,
                    )
                  }
                  className='h-10 min-w-0 flex-1 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
                />
                <button
                  type='button'
                  onClick={() => onRemoveParticipant(participant.id)}
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
        onClick={onAddParticipant}
        className='h-10 w-full rounded-xl border border-dashed border-zinc-300 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50'
      >
        + Add participant
      </button>

      <div className='flex gap-2'>
        <button
          type='button'
          onClick={onSaveGroup}
          disabled={!canSaveDraftGroup}
          className='h-10 flex-1 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-40'
        >
          Save
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='h-10 rounded-xl border border-zinc-200/80 px-4 text-sm text-zinc-600 transition hover:bg-zinc-50'
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
