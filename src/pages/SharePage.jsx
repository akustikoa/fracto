import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { useNavigate } from 'react-router-dom';
import ParticipantBreakdown from '../components/details/ParticipantBreakdown';
import SettlementList from '../components/details/SettlementList';
import ShareCard from '../components/share/ShareCard';
import fractoLogo from '../assets/branding/fracto-logo.png';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';

export default function SharePage({ group, expenses }) {
  const shareCardRef = useRef(null);
  const navigate = useNavigate();
  const validParticipantIds = group.participants.map(
    (participant) => participant.id,
  );

  const filteredExpenses = expenses.filter((expense) =>
    validParticipantIds.includes(expense.paidBy),
  );

  const balances = calculateBalances(group.participants, filteredExpenses);
  const settlements = calculateSettlements(balances);
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const participantCount = group.participants.length;
  const averagePerPerson =
    participantCount > 0 ? totalAmount / participantCount : 0;

  const handleNewBalance = () => {
    navigate('/');
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${group.id}`;
    const shareText = `View the balance for “${group.name}” on Fracto:\n${shareUrl}`;

    if (!shareCardRef.current) {
      await navigator.clipboard.writeText(shareUrl);
      return;
    }

    try {
      const dataUrl = await toPng(shareCardRef.current, { cacheBust: true });
      const blob = await fetch(dataUrl).then((response) => response.blob());
      const file = new File([blob], 'fracto-summary.png', {
        type: 'image/png',
      });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: group.name,
          text: shareText,
          files: [file],
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.error('Error sharing summary image', error);

      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (clipboardError) {
        console.error('Error copying share link', clipboardError);
      }
    }
  };

  return (
    <main className='min-h-screen bg-zinc-50'>
      <header className='border-b border-zinc-200/50 bg-[#DA3C20]'>
        <div className='mx-auto flex h-16 max-w-3xl items-center justify-between px-4 md:px-6'>
          <img
            src={fractoLogo}
            alt='Fracto'
            className='h-8 w-auto shrink-0 object-contain'
          />

          <button
            type='button'
            onClick={handleNewBalance}
            className='inline-flex h-8 items-center justify-center rounded-lg border border-white/25 bg-white/5 px-2.5 text-sm font-medium text-white/90 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/35 focus:ring-offset-2 focus:ring-offset-[#f72c25]'
          >
            New balance
          </button>
        </div>
      </header>

      <div className='mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8'>
        <div className='space-y-6'>
          <header className='rounded-2xl border border-zinc-200/70 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.035)]'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <h1 className='truncate text-2xl font-semibold tracking-tight text-zinc-900'>
                  {group.name}
                </h1>
                <p className='mt-0.5 text-sm text-zinc-500'>
                  {participantCount} participants /{' '}
                  {averagePerPerson.toFixed(2)}€ each
                </p>
              </div>

              <div className='shrink-0 text-right'>
                <p className='text-2xl font-semibold tracking-tight tabular-nums text-zinc-900'>
                  {totalAmount.toFixed(2)}€
                </p>
                <p className='mt-0.5 text-sm text-zinc-500'>total</p>
              </div>
            </div>

            <div className='mt-5 flex flex-wrap gap-x-5 gap-y-2.5'>
              {group.participants.map((participant) => (
                <div
                  key={participant.id}
                  className='inline-flex max-w-full items-center gap-2 text-sm font-medium text-zinc-800'
                >
                  <span
                    className='h-2 w-2 shrink-0 rounded-full'
                    style={{ backgroundColor: participant.color }}
                  />
                  <span className='truncate'>{participant.name}</span>
                </div>
              ))}
            </div>
          </header>

          <SettlementList settlements={settlements} />

          <button
            type='button'
            onClick={handleShare}
            className=' h-11 w-full rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800'
          >
            Share
          </button>

          <ParticipantBreakdown
            balances={balances}
            expenses={filteredExpenses}
          />
        </div>
      </div>

      <div
        className='pointer-events-none fixed inset-0 flex items-center justify-center'
        style={{ zIndex: -1 }}
      >
        <ShareCard
          shareRef={shareCardRef}
          group={group}
          totalAmount={totalAmount}
          participantCount={participantCount}
          averagePerPerson={averagePerPerson}
          settlements={settlements}
        />
      </div>
    </main>
  );
}
