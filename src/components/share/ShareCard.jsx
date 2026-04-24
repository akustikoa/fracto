import { ArrowRight } from 'lucide-react';
import fractoMark from '../../assets/branding/fracto-marknb.png';
import fractoLogo from '../../assets/branding/fracto-logo.png';

export default function ShareCard({
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
    <article className='w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm'>
      <div className='flex items-center justify-between rounded-t-3xl bg-[#DA3C20] px-4 py-3'>
        <img
          src={fractoLogo}
          alt='Fracto'
          className='h-8 w-auto object-contain'
        />
        <img
          src={fractoMark}
          alt='Fracto'
          className='h-10 mt-1 me-1 w-auto object-contain'
        />
      </div>

      <div className='p-6'>
        <header className='space-y-3'>
          <div className='space-y-1.5'>
            <h1 className='text-2xl font-semibold tracking-tight text-zinc-900'>
              {group?.name || 'Untitled group'}
            </h1>

            <p className='text-base font-medium tabular-nums text-zinc-900'>
              {formattedTotalAmount}€ · {participantCount} people
            </p>

            <p className='text-sm tabular-nums text-zinc-500'>
              {formattedAveragePerPerson}€ each
            </p>
          </div>
        </header>

        <section className='mt-8'>
          <h2 className='text-lg font-semibold text-zinc-900'>
            Suggested payments
          </h2>

          <div className='mt-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-2'>
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

        <footer className='mt-8 border-t border-zinc-200/80 pt-4'>
          <p className='text-sm font-medium text-zinc-900'>View details</p>
          <p className='mt-1 text-sm text-zinc-500'>
            fracto.app/group/{group?.id}
          </p>
        </footer>
      </div>
    </article>
  );
}
