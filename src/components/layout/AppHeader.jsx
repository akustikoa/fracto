import { useNavigate } from 'react-router-dom';
import fractoLogo from '../../assets/branding/fracto-logo.png';

export default function AppHeader({ groupId, variant }) {
  const navigate = useNavigate();
  const isDetails = variant === 'details';
  const actionLabel = isDetails ? 'Back' : 'Full details →';
  const actionPath = isDetails ? `/group/${groupId}` : `/details/${groupId}`;

  return (
    <header className='border-b border-zinc-200/50 bg-white'>
      <div className='mx-auto flex h-16 max-w-3xl items-center justify-between px-4 md:px-6'>
        <div className='flex min-w-0 items-center gap-2.5'>
          <img
            src={fractoLogo}
            alt='Fracto'
            className='h-8 w-auto shrink-0 object-contain'
          />
        </div>

        <button
          type='button'
          onClick={() => navigate(actionPath)}
          className='rounded-xl bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-200'
        >
          {actionLabel}
        </button>
      </div>
    </header>
  );
}
