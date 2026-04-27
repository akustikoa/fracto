import { Fragment } from 'react';
import { ArrowRight } from 'lucide-react';

export default function SettlementList({
  settlements,
  titleClassName = 'mb-3 ms-1 text-xl font-semibold tracking-tight text-zinc-900',
  containerClassName = 'rounded-2xl border border-zinc-200/80 bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]',
}) {
  const groupedSettlements = settlements.reduce((groups, settlement) => {
    const payerId = settlement.from.id;
    const existingGroup = groups.find((groupItem) => groupItem.id === payerId);
    const payment = {
      id: `${settlement.to.id}-${settlement.amount}`,
      receiverName: settlement.to.name,
      amount: settlement.amount,
    };

    if (existingGroup) {
      existingGroup.payments.push(payment);
      return groups;
    }

    groups.push({
      id: payerId,
      payerName: settlement.from.name,
      payerColor: settlement.from.color,
      payments: [payment],
    });

    return groups;
  }, []);

  return (
    <section>
      <h2 className={titleClassName}>Suggested payments</h2>

      <div className={containerClassName}>
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
                                backgroundColor: settlementGroup.payerColor,
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
  );
}
