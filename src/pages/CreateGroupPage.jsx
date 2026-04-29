import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import fractoMark from '../assets/branding/fracto-markround-chrome.png';
import fractoLogo from '../assets/branding/fracto-logo-orange-chrome.png';
import { participantColors } from '../data/participantColors';
import { createGroup } from '../lib/api/groups';

const MAX_PARTICIPANTS = 10;

export default function CreateGroupPage({ onCreateGroup }) {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState(['', '']);
  const [groupNameError, setGroupNameError] = useState(false);
  const [participantErrors, setParticipantErrors] = useState([false, false]);
  const [lastGroupId] = useState(() => localStorage.getItem('lastGroupId'));

  function handleParticipantChange(index, value) {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = value;
    setParticipants(updatedParticipants);

    if (participantErrors[index]) {
      const updatedParticipantErrors = [...participantErrors];
      updatedParticipantErrors[index] = false;
      setParticipantErrors(updatedParticipantErrors);
    }
  }

  function handleGroupNameChange(value) {
    setGroupName(value);

    if (groupNameError) {
      setGroupNameError(false);
    }
  }

  function handleAddParticipant() {
    if (participants.length >= MAX_PARTICIPANTS) {
      return;
    }

    setParticipants((previous) => [...previous, '']);
    setParticipantErrors((previous) => [...previous, false]);
  }

  function handleRemoveParticipant(indexToRemove) {
    if (participants.length <= 1) {
      return;
    }

    setParticipants((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );
    setParticipantErrors((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedGroupName = groupName.trim();
    const trimmedParticipants = participants.map((name) => name.trim());
    const nextGroupNameError = trimmedGroupName === '';
    const nextParticipantErrors = trimmedParticipants.map(
      (name) => name === '',
    );

    setGroupNameError(nextGroupNameError);
    setParticipantErrors(nextParticipantErrors);

    if (
      nextGroupNameError ||
      nextParticipantErrors.some((hasError) => hasError)
    ) {
      return;
    }

    const cleanParticipants = trimmedParticipants.map((name, index) => ({
      id: crypto.randomUUID(),
      name,
      initial: name.charAt(0).toUpperCase(),
      color: participantColors[index % participantColors.length],
    }));

    const newGroup = {
      id: crypto.randomUUID(),
      name: trimmedGroupName,
      participants: cleanParticipants,
    };

    const createdGroup = await createGroup(newGroup);

    onCreateGroup(createdGroup);
    navigate(`/group/${createdGroup.id}`);
  }

  return (
    <main className='min-h-screen bg-zinc-50'>
      <header className='mb-4 border-b border-zinc-200/50 bg-[#DA3C20]'>
        <div className='mx-auto flex h-16 max-w-3xl items-center px-4 md:px-6'>
          <img
            src={fractoLogo}
            alt='Fracto'
            className='h-8 w-auto shrink-0 object-contain'
          />
        </div>
      </header>

      <div className='mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8'>
        <div className='space-y-6'>
          <div className='flex flex-col items-center gap-4 text-center'>
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
            noValidate
            className='w-full space-y-5 rounded-2xl border border-zinc-200/80 bg-white px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
          >
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-zinc-700'>
                Group name
              </label>
              <input
                type='text'
                value={groupName}
                onChange={(event) => handleGroupNameChange(event.target.value)}
                placeholder={
                  groupNameError ? 'Group name required' : 'Dinner with friends'
                }
                className={`h-11 w-full rounded-xl border bg-zinc-50 px-3 text-sm outline-none transition ${
                  groupNameError
                    ? 'border-red-300 text-red-600 placeholder-red-500 hover:border-red-300 focus:border-red-400'
                    : 'border-zinc-200/80 text-zinc-800 hover:border-zinc-200 focus:border-zinc-300'
                }`}
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
                      placeholder={
                        participantErrors[index]
                          ? 'Participant name required'
                          : `Name ${index + 1}`
                      }
                      className={`h-10 min-w-0 flex-1 rounded-xl border bg-zinc-50 px-3 text-sm outline-none transition ${
                        participantErrors[index]
                          ? 'border-red-300 text-red-600 placeholder-red-500 focus:border-red-400'
                          : 'border-zinc-200/80 text-zinc-800 focus:border-zinc-300'
                      }`}
                    />

                    <button
                      type='button'
                      onClick={() => handleRemoveParticipant(index)}
                      disabled={participants.length <= 1}
                      aria-label={`Remove participant ${index + 1}`}
                      className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-600 disabled:opacity-40'
                    >
                      <Trash2 className='h-4.5 w-4.5' />
                    </button>
                  </div>
                ))}
              </div>

              {participants.length < MAX_PARTICIPANTS && (
                <button
                  type='button'
                  onClick={handleAddParticipant}
                  className='h-10 w-full border border-zinc-200 rounded-xl bg-zinc-100 px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-800 hover:text-white'
                >
                  + Add participant
                </button>
              )}
            </div>

            <button
              type='submit'
              className='h-10 w-full rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition  hover:bg-zinc-800 hover:text-white'
            >
              Create group
            </button>
          </form>

          {lastGroupId && (
            <button
              type='button'
              onClick={() => navigate(`/group/${lastGroupId}`)}
              className='h-10 w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900'
            >
              Continue last balance
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
