import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useNavigate, useParams } from 'react-router-dom';
import SettlementList from '../components/details/SettlementList';
import ParticipantBreakdown from '../components/details/ParticipantBreakdown';
import AppHeader from '../components/layout/AppHeader';
import fractoMark from '../assets/branding/fracto-markround-chrome.png';
import fractoLogo from '../assets/branding/fracto-logo-orange-chrome.png';
import { calculateBalances } from '../lib/balance.utils';
import { calculateSettlements } from '../lib/settlement.utils';
import ShareCard from '../components/share/ShareCard';
import { getGroupById } from '../lib/api/groups';
import { getExpensesByGroupId } from '../lib/api/expenses';
import { Share2 } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';

export default function DetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const shareCardRef = useRef(null);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function loadDetailsData() {
      setIsNotFound(false);

      let loadedGroup;

      try {
        loadedGroup = await getGroupById(id);
      } catch (error) {
        console.error('Error loading details group', error);
        setGroup(null);
        setExpenses([]);
        setIsNotFound(true);
        return;
      }

      if (!loadedGroup) {
        setGroup(null);
        setExpenses([]);
        setIsNotFound(true);
        return;
      }

      try {
        const loadedExpenses = await getExpensesByGroupId(id);

        setExpenses(loadedExpenses);
      } catch (error) {
        console.error('Error loading details expenses', error);
        setExpenses([]);
      }

      setGroup(loadedGroup);
    }

    loadDetailsData();
  }, [id]);

  const handleNewBalance = () => {
    navigate('/');
  };

  if (isNotFound) {
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
              {t('newBalance')}
            </button>
          </div>
        </header>

        <div className='mx-auto flex min-h-[calc(100vh-10rem)] max-w-3xl items-center justify-center px-4 py-8 text-center md:px-6 md:py-8'>
          <div className='flex flex-col items-center text-center space-y-8'>
            <img
              src={fractoMark}
              alt='Fracto'
              className='h-22 w-22 mb-3 object-contain'
            />

            <div className='space-y-1'>
              <h1 className='text-2xl font-semibold tracking-tight text-zinc-900'>
                {t('groupNotFound')}
              </h1>
              <p className='text-sm text-zinc-500'>
                {t('groupNotFoundDescription')}
              </p>
            </div>

            <button
              type='button'
              onClick={handleNewBalance}
              className='h-10 rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800'
            >
              {t('createNewBalance')}
            </button>
          </div>
        </div>
      </main>
    );
  }

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
          text: `${t('shareTextViewBalanceFor')} "${group.name}" ${t(
            'shareTextOnFracto',
          )}\n${detailsUrl}`,
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
    <main className=' min-h-screen bg-zinc-50'>
      <AppHeader groupId={id} variant='details' />

      <div className='mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-8'>
        <div className='space-y-6'>
          <header className='mb-8 rounded-2xl border border-zinc-200/70 bg-white px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <h1 className='truncate text-2xl font-semibold tracking-tight text-zinc-900'>
                  {group.name}
                </h1>
                <p className='mt-0.5 text-sm text-zinc-500'>
                  {group.participants.length} {t('participants')}
                </p>
              </div>

              <div className='shrink-0 text-right'>
                <p className='text-2xl font-semibold tracking-tight tabular-nums text-zinc-900'>
                  {totalSpent.toFixed(2)}€
                </p>
                <p className='mt-0.5 text-sm text-zinc-500'>{t('total')}</p>
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
            className='mt-7 flex items-center justify-center gap-4 h-11 w-full rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition shadow-md hover:bg-zinc-100 hover:text-zinc-700'
          >
            <Share2 className='h-5 w-5 shrink-0' />
            {t('shareSummary')}
          </button>

          <ParticipantBreakdown
            balances={balances}
            expenses={filteredExpenses}
          />
        </div>
      </div>

      <div
        className='pointer-events-none fixed left-0 top-0 flex items-center justify-center opacity-0'
        style={{ transform: 'translateX(-9999px)' }}
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
