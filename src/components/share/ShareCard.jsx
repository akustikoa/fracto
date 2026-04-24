import { ArrowRight } from 'lucide-react';
import fractoMark from '../../assets/branding/fracto-marknb.png';
import fractoLogo from '../../assets/branding/fracto-logo.png';
import fractoLogofb from '../../assets/branding/fracto-logo-fb.png';

export default function ShareCard({
  shareRef,
  group,
  totalAmount,
  participantCount,
  averagePerPerson,
  settlements,
}) {
  const formattedTotalAmount = Number(totalAmount || 0).toFixed(2);
  const formattedAveragePerPerson = Number(averagePerPerson || 0).toFixed(2);
  const participants = group?.participants || [];

  const getParticipantName = (participantValue) => {
    if (participantValue && typeof participantValue === 'object') {
      return participantValue.name || 'Unknown';
    }

    const matchedParticipant = participants.find(
      (participant) => participant.id === participantValue,
    );

    return matchedParticipant?.name || 'Unknown';
  };

  return (
    <div ref={shareRef} className='max-w-sm bg-white p-2'>
      <article className='overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm'>
        <div className='flex items-center justify-between rounded-t-3xl bg-[#DA3C20] px-4 py-3'>
          <img
            src={fractoLogo}
            alt='Fracto'
            className='h-8 w-auto object-contain'
          />
        </div>

        <div className='p-4'>
          <header className='space-y-1'>
            <div className='space-y-0.5'>
              <h1 className='text-xl font-semibold tracking-tight text-zinc-900'>
                {group?.name || 'Untitled group'}
              </h1>

              <p className='text-sm tabular-nums text-zinc-600'>
                {formattedTotalAmount}€ · {participantCount} people ·{' '}
                {formattedAveragePerPerson}€ each
              </p>
            </div>
          </header>

          <section className='mt-4'>
            <h2 className='text-base font-semibold text-zinc-900'>
              Suggested payments
            </h2>

            <div className='mt-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-2'>
              {settlements.length === 0 ? (
                <p className='py-3 text-sm text-zinc-400'>No payments needed</p>
              ) : (
                <div className='divide-y divide-zinc-200/80'>
                  {settlements.map((settlement, index) => (
                    <div
                      key={`${settlement.from?.id || settlement.from}-${settlement.to?.id || settlement.to}-${index}`}
                      className='flex items-center justify-between gap-3 py-3'
                    >
                      <p className='flex min-w-0 flex-1 items-center gap-2 text-sm text-zinc-500'>
                        <span className='truncate font-medium text-zinc-800'>
                          {getParticipantName(settlement.from)}
                        </span>

                        <ArrowRight className='h-3.5 w-3.5 shrink-0 text-zinc-300' />

                        <span className='truncate font-medium text-zinc-800'>
                          {getParticipantName(settlement.to)}
                        </span>
                      </p>

                      <span className='shrink-0 text-sm font-semibold tabular-nums text-zinc-900'>
                        {Number(settlement.amount || 0).toFixed(2)}€
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <footer className='mt-6 border-t border-zinc-200/80 pt-3'>
            <div className='flex items-center justify-between gap-2'>
              <img
                src={fractoLogofb}
                alt='Fracto'
                className='h-5 w-auto object-contain'
              />
              <p className='mt-2 text-[8px] font-medium text-zinc-400'>
                Where balance feels easy
              </p>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}
