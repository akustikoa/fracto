import { useState } from 'react';
import fractoMark from '../assets/branding/fracto-mark.png';
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
    <main className='min-h-screen bg-zinc-50'>
      <div className='mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8'>
        <div className='space-y-5'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <img
              src={fractoMark}
              alt='Fracto'
              className='h-18 w-18 object-contain'
            />
            <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 leading-tight'>
              Create group
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className='mx-auto w-full max-w-md space-y-5 rounded-2xl border border-zinc-200/80 bg-white px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
          >
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-zinc-700'>
                Group name
              </label>
              <input
                type='text'
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder='Mallorca 2026'
                className='h-11 w-full rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition hover:border-zinc-200 focus:border-zinc-300'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-zinc-700'>
                Participants
              </label>

              <div className='space-y-4 mb-5'>
                {participants.map((participant, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <span
                      className='h-3 w-3 shrink-0 rounded-full'
                      style={{
                        backgroundColor:
                          participantColors[index % participantColors.length],
                      }}
                    />

                    <input
                      type='text'
                      value={participant}
                      onChange={(event) =>
                        handleParticipantChange(index, event.target.value)
                      }
                      placeholder={`Participant ${index + 1}`}
                      className='h-10 min-w-0 flex-1 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none transition focus:border-zinc-300'
                    />
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
            </div>

            <button
              type='submit'
              className='h-10 w-full rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800'
            >
              Create group
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
