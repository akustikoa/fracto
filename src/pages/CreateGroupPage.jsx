import { useState } from 'react';
import { participantColors } from '../data/participantColors';

export default function CreateGroupPage({ onCreateGroup }) {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState(['', '']);

  function handleParticipantChange(index, value) {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = value;
    setParticipants(updatedParticipants);
  }

  function handleAddParticipant() {
    setParticipants((previous) => [...previous, '']);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanParticipants = participants
      .map((name) => name.trim())
      .filter((name) => name !== '')
      .map((name, index) => ({
        id: crypto.randomUUID(),
        name,
        initial: name.charAt(0).toUpperCase(),
        color: participantColors[index % participantColors.length],
      }));

    const newGroup = {
      id: crypto.randomUUID(),
      name: groupName.trim(),
      participants: cleanParticipants,
    };

    onCreateGroup(newGroup);
  }

  return (
    <main className='min-h-screen bg-zinc-100'>
      <div className='mx-auto flex min-h-screen max-w-md items-center px-4 py-6'>
        <form
          onSubmit={handleSubmit}
          className='w-full space-y-4 rounded-2xl bg-white p-6 shadow-sm'
        >
          <div className='space-y-1 text-center'>
            <h1 className='text-2xl font-semibold text-zinc-900'>
              Create group
            </h1>
            <p className='text-sm text-zinc-500'>
              Add a group name and participants
            </p>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-zinc-700'>
              Group name
            </label>
            <input
              type='text'
              value={groupName}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder='Mallorca 2026'
              className='w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400'
              required
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-zinc-700'>
              Participants
            </label>

            <div className='space-y-2'>
              {participants.map((participant, index) => (
                <input
                  key={index}
                  type='text'
                  value={participant}
                  onChange={(event) =>
                    handleParticipantChange(index, event.target.value)
                  }
                  placeholder={`Participant ${index + 1}`}
                  className='w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-zinc-400'
                />
              ))}
            </div>

            <button
              type='button'
              onClick={handleAddParticipant}
              className='text-sm font-medium text-zinc-600 hover:text-zinc-900'
            >
              + Add participant
            </button>
          </div>

          <button
            type='submit'
            className='w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800'
          >
            Create group
          </button>
        </form>
      </div>
    </main>
  );
}
