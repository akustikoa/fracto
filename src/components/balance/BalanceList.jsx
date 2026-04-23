import { ArrowRight, RotateCcw, Users } from 'lucide-react';

export default function BalanceList({
  balances,
  settlements,
  onSelectParticipant,
  onEditGroup,
  onResetGroup,
  footerAction,
  children,
}) {
  const sortedBalances = [...balances].sort(
    (firstBalance, secondBalance) =>
      secondBalance.balance - firstBalance.balance,
  );

  const totalPaidAmount = balances.reduce(
    (sum, item) => sum + item.totalPaid,
    0,
  );

  const participantCount = balances.length;

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
      <h2 className='mb-2 ms-1 text-lg font-semibold text-zinc-900'>Balance</h2>

      <section className='rounded-2xl border border-zinc-200/80 bg-white/95 px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'>
        <div className='mb-1 flex items-center justify-between gap-3'>
          <button
            onClick={onEditGroup}
            className='inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-200'
          >
            <Users className='h-4 w-4 text-zinc-600' />
            <span>{participantCount}</span>
            <span className='text-zinc-700'>·</span>
            <span>{Number(totalPaidAmount.toFixed(2))}€</span>
          </button>

          <button
            type='button'
            onClick={onResetGroup}
            className='inline-flex h-7 w-25 shrink-0 items-center justify-center gap-2.5 rounded-full bg-zinc-100 px-3 text-sm text-zinc-600 transition hover:bg-zinc-200 hover:text-red-500'
          >
            <RotateCcw className='h-4 w-4' />
            <span>Reset</span>
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
              <span className='text-sm uppercase tracking-wide text-zinc-500'>
                total
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
                  paid {totalPaid.toFixed(2)}€
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
          <h2 className='mb-2 ms-1 text-lg font-semibold text-zinc-900'>
            Suggested payments
          </h2>

          <section className='rounded-2xl border border-zinc-200/80 bg-white px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'>
            <div className='space-y-3'>
              {settlements.map((settlement, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-white px-3 py-3'
                >
                  <div className='flex min-w-0 items-center gap-3'>
                    <span
                      className='h-5 w-1.5 shrink-0 rounded-full'
                      style={{ backgroundColor: settlement.from.color }}
                    />

                    <div className='min-w-0'>
                      <p className='flex items-center gap-1.5 text-sm text-zinc-600'>
                        <span className='font-semibold text-zinc-800'>
                          {settlement.from.name}
                        </span>

                        <ArrowRight className='h-4 w-4 text-zinc-400' />

                        <span className='font-semibold text-zinc-800'>
                          {settlement.to.name}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span className='shrink-0 text-sm font-semibold text-zinc-900'>
                    {settlement.amount.toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
