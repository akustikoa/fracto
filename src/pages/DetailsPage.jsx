import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useParams } from 'react-router-dom';
import SettlementList from '../components/details/SettlementList';
import ParticipantBreakdown from '../components/details/ParticipantBreakdown';
import AppHeader from '../components/layout/AppHeader';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';
import ShareCard from '../components/share/ShareCard';
import { getGroupById } from '../lib/api/groups';
import { getExpensesByGroupId } from '../lib/api/expenses';

export default function DetailsPage() {
  const { id } = useParams();
  const shareCardRef = useRef(null);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function loadDetailsData() {
      const [loadedGroup, loadedExpenses] = await Promise.all([
        getGroupById(id),
        getExpensesByGroupId(id),
      ]);

      setGroup(loadedGroup);
      setExpenses(loadedExpenses);
    }

    loadDetailsData();
  }, [id]);

  if (!group) {
    return null;
  }

  const validParticipantIds = group.participants.map(
    (participant) => participant.id,
  );

  const filteredExpenses = expenses.filter((expense) =>
    validParticipantIds.includes(expense.paidBy),
  );

  const balances = calculateBalances(group.participants, filteredExpenses);
  const settlements = calculateSettlements(balances);
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const totalAmount = totalSpent;

  const handleShare = async () => {
    if (!shareCardRef.current) {
      return;
    }

    const detailsUrl = `${window.location.origin}/share/${group.id}`;

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
          text: `View the balance for “${group.name}” on Fracto:\n${detailsUrl}`,
          files: [file],
        });
        return;
      }

      await navigator.clipboard.writeText(detailsUrl);
    } catch (error) {
      console.error('Error sharing summary image', error);

      try {
        await navigator.clipboard.writeText(detailsUrl);
      } catch (clipboardError) {
        console.error('Error copying details link', clipboardError);
      }
    }
  };

  return (
    <main className='min-h-screen bg-zinc-50'>
      <AppHeader groupId={id} variant='details' />

      <div className='mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8'>
        <div className='space-y-6'>
          <header className='rounded-2xl border border-zinc-200/70 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.035)]'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <h1 className='truncate text-2xl font-semibold tracking-tight text-zinc-900'>
                  {group.name}
                </h1>
                <p className='mt-0.5 text-sm text-zinc-500'>
                  {group.participants.length} participants
                </p>
              </div>

              <div className='shrink-0 text-right'>
                <p className='text-2xl font-semibold tracking-tight tabular-nums text-zinc-900'>
                  {totalSpent.toFixed(2)}€
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
            className='h-11 w-full rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800'
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
        className='fixed inset-0 flex items-center justify-center pointer-events-none'
        style={{ zIndex: -1 }}
      >
        <ShareCard
          shareRef={shareCardRef}
          group={group}
          totalAmount={totalAmount}
          participantCount={group.participants.length}
          averagePerPerson={
            group.participants.length > 0
              ? totalAmount / group.participants.length
              : 0
          }
          settlements={settlements}
        />
      </div>
    </main>
  );
}
