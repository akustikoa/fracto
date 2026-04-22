import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import fractoLogo from '../../assets/branding/fracto-logo.png';

export default function AppHeader({ groupId, variant }) {
  const navigate = useNavigate();
  const isDetails = variant === 'details';

  return (
    <header className='border-b border-zinc-200/60 bg-white'>
      <div className='mx-auto flex h-15 max-w-3xl items-center justify-between px-4 md:px-6'>
        <div className='flex min-w-0 items-center gap-2.5'>
          {isDetails && (
            <button
              type='button'
              onClick={() => navigate(`/group/${groupId}`)}
              aria-label='Back'
              className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100'
            >
              <ArrowLeft className='h-4 w-4' />
            </button>
          )}

          <img
            src={fractoLogo}
            alt='Fracto'
            className='h-8 w-auto shrink-0 object-contain'
          />
        </div>

        {variant === 'group' && (
          <button
            type='button'
            onClick={() => navigate(`/details/${groupId}`)}
            className='rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900'
          >
            Details
          </button>
        )}
      </div>
    </header>
  );
}
