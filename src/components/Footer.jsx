import logoXp from '../assets/branding/logo-xp.png';

export default function Footer() {
  return (
    <footer className='mt-8 bg-[#DA3C20] py-1.5'>
      <div className='mx-auto flex max-w-3xl items-center justify-center gap-2 px-4 text-sm text-white/90 md:px-6'>
        <span>Created by</span>
        <a
          href='https://xavierprat.netlify.app/'
          target='_blank'
          rel='noopener noreferrer'
          className='transition-opacity hover:opacity-80'
          aria-label='Xavier Prat portfolio'
        >
          <img src={logoXp} alt='Fracto' className='h-6 w-6 object-contain' />
        </a>
      </div>
    </footer>
  );
}
