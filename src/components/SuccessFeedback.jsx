import { Check } from 'lucide-react';

export default function SuccessFeedback({ show, message, className = '' }) {
  if (!show) {
    return null;
  }

  return (
    <p
      aria-live='polite'
      className={`success-feedback-enter pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)+4.25rem)] left-1/2 z-20 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-emerald-200/80 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-[0_2px_8px_rgba(16,185,129,0.08)] ${className}`}
    >
      <span className='flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white'>
        <Check className='h-3.5 w-3.5' strokeWidth={3} />
      </span>
      <span>{message}</span>
    </p>
  );
}
