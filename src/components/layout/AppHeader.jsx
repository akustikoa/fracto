import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import fractoLogo from '../../assets/branding/fracto-logo-orange-chrome.png';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../../context/useLanguage';

export default function AppHeader({ groupId, variant }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isDetails = variant === 'details';
  const actionPath = isDetails ? `/group/${groupId}` : `/details/${groupId}`;

  return (
    <header className='border-b border-zinc-200/50 bg-[#DA3C20]'>
      <div className='mx-auto flex h-16 max-w-3xl items-center justify-between px-4 md:px-6'>
        <div className='flex min-w-0 items-center gap-1.5'>
          <img
            src={fractoLogo}
            alt='Fracto'
            className='h-8 w-auto shrink-0 object-contain'
          />
        </div>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => navigate(actionPath)}
            aria-label={isDetails ? t('backToGroup') : undefined}
            className='inline-flex h-8 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-2.5 text-sm font-medium text-white/90 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/35 focus:ring-offset-2 focus:ring-offset-[#f72c25]'
          >
            {isDetails ? <ArrowLeft size={18} strokeWidth={2} /> : t('details')}
          </button>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
