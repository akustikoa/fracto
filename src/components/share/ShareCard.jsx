import { Fragment } from 'react';
import { ArrowRight } from 'lucide-react';
import fractoLogo from '../../assets/branding/fracto-logo-orange-chrome.png';

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
  const groupName = group?.name || 'Untitled group';

  const getParticipant = (participantValue) => {
    if (participantValue && typeof participantValue === 'object') {
      return participantValue;
    }

    return participants.find(
      (participant) => participant.id === participantValue,
    );
  };

  const getParticipantName = (participantValue) =>
    getParticipant(participantValue)?.name || 'Unknown';

  const getParticipantColor = (participantValue) =>
    getParticipant(participantValue)?.color;

  const groupedSettlements = settlements.reduce((groups, settlement) => {
    const payerId = settlement.from?.id || settlement.from || 'unknown';
    const existingGroup = groups.find((groupItem) => groupItem.id === payerId);
    const payment = {
      id: `${settlement.to?.id || settlement.to}-${settlement.amount}`,
      receiverName: getParticipantName(settlement.to),
      amount: Number(settlement.amount || 0),
    };

    if (existingGroup) {
      existingGroup.payments.push(payment);
      return groups;
    }

    groups.push({
      id: payerId,
      payerName: getParticipantName(settlement.from),
      payerColor: getParticipantColor(settlement.from),
      payments: [payment],
    });

    return groups;
  }, []);

  return (
    <div ref={shareRef} className='w-[390px] bg-zinc-50'>
      <article className='min-h-[640px] bg-zinc-50'>
        <header className='border-b border-zinc-200/50 bg-[#DA3C20]'>
          <div className='flex h-16 items-center px-4'>
            <div className='flex min-w-0 items-center gap-1.5'>
              <img
                src={fractoLogo}
                alt='Fracto'
                className='h-8 w-auto shrink-0 object-contain'
              />
            </div>
          </div>
        </header>

        <div className='px-4 py-6'>
          <div className='space-y-6'>
            <section className='rounded-2xl border border-zinc-200/70 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.035)]'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <h1 className='truncate text-2xl font-semibold tracking-tight text-zinc-900'>
                    {groupName}
                  </h1>
                  <p className='mt-0.5 text-sm text-zinc-500'>
                    {participantCount} participants /{' '}
                    {formattedAveragePerPerson}€ each
                  </p>
                </div>

                <div className='shrink-0 text-right'>
                  <p className='text-2xl font-semibold tracking-tight tabular-nums text-zinc-900'>
                    {formattedTotalAmount}€
                  </p>
                  <p className='mt-0.5 text-sm text-zinc-500'>total</p>
                </div>
              </div>

              <div className='mt-5 flex flex-wrap gap-x-5 gap-y-2.5'>
                {participants.map((participant) => (
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
            </section>

            <section>
              <h2 className='mb-3 ms-1 text-xl font-semibold tracking-tight text-zinc-900'>
                Suggested payments
              </h2>

              <div className='rounded-2xl border border-zinc-200/80 bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'>
                {groupedSettlements.length === 0 ? (
                  <p className='text-sm text-zinc-400'>No payments needed</p>
                ) : (
                  <div className='divide-y divide-zinc-100'>
                    {groupedSettlements.map((settlementGroup) => (
                      <div
                        key={settlementGroup.id}
                        className='py-3 first:pt-0 last:pb-0'
                      >
                        <div className='grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-x-3 gap-y-2'>
                          {settlementGroup.payments.map((payment, index) => (
                            <Fragment
                              key={`${settlementGroup.id}-${payment.id}-${index}`}
                            >
                              <div className='flex min-w-0 items-center gap-2.5'>
                                {index === 0 && (
                                  <>
                                    <span
                                      className='h-5 w-1.5 shrink-0 rounded-full'
                                      style={{
                                        backgroundColor:
                                          settlementGroup.payerColor,
                                      }}
                                    />
                                    <h3 className='truncate text-sm font-semibold text-zinc-900'>
                                      {settlementGroup.payerName}
                                    </h3>
                                  </>
                                )}
                              </div>

                              <div className='flex min-w-0 items-center justify-between gap-3'>
                                <p className='flex min-w-0 items-center gap-2 text-sm text-zinc-500'>
                                  <ArrowRight className='h-3.5 w-3.5 shrink-0 text-zinc-300' />
                                  <span className='truncate font-medium text-zinc-800'>
                                    {payment.receiverName}
                                  </span>
                                </p>

                                <span className='shrink-0 text-sm font-semibold tabular-nums text-zinc-900'>
                                  {payment.amount.toFixed(2)}€
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}
