import { RotateCcw, Users } from 'lucide-react';
import SettlementList from '../details/SettlementList';
import { useLanguage } from '../../context/useLanguage';

export default function BalanceList({
  balances,
  settlements,
  onSelectParticipant,
  onEditGroup,
  onResetGroup,
  footerAction,
  children,
}) {
  const { t } = useLanguage();
  const sortedBalances = [...balances].sort(
    (firstBalance, secondBalance) =>
      secondBalance.balance - firstBalance.balance,
  );

  const totalPaidAmount = balances.reduce(
    (sum, item) => sum + item.totalPaid,
    0,
  );

  const participantCount = balances.length;
  const averagePerPerson =
    participantCount > 0
      ? (totalPaidAmount / participantCount).toFixed(2)
      : '0.00';

  const gap = 2;
  const size = 150;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const circleSegments = sortedBalances.map((item, index, array) => {
    const rawLength =
      totalPaidAmount > 0
        ? (item.totalPaid / totalPaidAmount) * circumference
        : 0;

    const segmentLength = Math.max(rawLength - gap, 0);

    const offset = array.slice(0, index).reduce((sum, currentItem) => {
      const currentSegmentLength =
        totalPaidAmount > 0
          ? (currentItem.totalPaid / totalPaidAmount) * circumference
          : 0;

      return sum + currentSegmentLength;
    }, 0);

    return {
      ...item,
      segmentLength,
      offset,
    };
  });

  return (
    <div>
      <h2 className='mb-2 ms-1 text-lg font-semibold text-zinc-900'>
        {t('balance')}
      </h2>

      <section className='rounded-2xl border border-zinc-200/80 bg-white/95 px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'>
        <div className='mb-1 flex items-center justify-between gap-3'>
          <button
            onClick={onEditGroup}
            className='group inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1 text-sm text-zinc-600 hover:bg-zinc-900 hover:text-white'
          >
            <Users className='h-4 w-4' />
            <span>{participantCount}</span>
            <span className='text-zinc-700'>/</span>
            <span>
              {averagePerPerson}€ {t('each')}
            </span>
          </button>

          <button
            type='button'
            onClick={onResetGroup}
            className='inline-flex h-7  shrink-0 items-center justify-center gap-2.5 rounded-full bg-zinc-100 px-4 text-sm text-zinc-600 transition hover:bg-zinc-900 hover:text-white'
          >
            <RotateCcw className='h-4 w-4' />
            <span>{t('reset')}</span>
          </button>
        </div>

        <div className='mt-6 flex flex-col items-center'>
          <div className='relative flex items-center justify-center'>
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className='-rotate-90'
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill='none'
                stroke='#e4e4e7'
                strokeWidth={strokeWidth}
              />

              {circleSegments.map(
                ({ participant, segmentLength, offset }, index) => (
                  <circle
                    key={participant.id ?? index}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill='none'
                    stroke={participant.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap='butt'
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeDashoffset={-offset}
                  />
                ),
              )}
            </svg>

            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <span className='text-2xl font-semibold tracking-tight text-zinc-900'>
                {Number(totalPaidAmount.toFixed(2))}€
              </span>
              <span className='text-medium font-semibold trackin-wide text-zinc-800'>
                {t('total')}
              </span>
            </div>
          </div>
        </div>

        <div className='mt-6 space-y-3'>
          {sortedBalances.map(({ participant, balance, totalPaid }) => (
            <button
              key={participant.id}
              onClick={() => onSelectParticipant(participant.id)}
              className='flex w-full items-start justify-between gap-4 rounded-xl px-1 py-1 hover:bg-zinc-50'
            >
              <div className='flex min-w-0 items-center gap-3'>
                <span
                  className='h-5 w-1.5 shrink-0 rounded-full'
                  style={{ backgroundColor: participant.color }}
                />

                <span className='text-sm font-semibold text-zinc-800'>
                  {participant.name}
                </span>
              </div>

              <div className='text-right'>
                <p
                  className={`text-base font-semibold ${
                    balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {balance > 0 ? '+' : ''}
                  {Number(balance.toFixed(2))}€
                </p>

                <p className='mt-0.5 text-xs text-zinc-400'>
                  {t('paid')} {totalPaid.toFixed(2)}€
                </p>
              </div>
            </button>
          ))}
        </div>

        {children && <div className='mt-5'>{children}</div>}
      </section>

      {footerAction && <div className='mt-5'>{footerAction}</div>}

      {settlements.length > 0 && (
        <div className='mt-6'>
          <SettlementList
            settlements={settlements}
            titleClassName='mb-2 ms-1 text-lg font-semibold text-zinc-900'
            containerClassName='rounded-2xl border border-zinc-200/80 bg-white px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
          />
        </div>
      )}
    </div>
  );
}
