import { ArrowRight } from 'lucide-react';

export default function SettlementList({ settlements }) {
  return (
    <section>
      <h2 className='mb-2 ms-1 text-lg font-semibold text-zinc-900'>
        Suggested payments
      </h2>

      <div className='rounded-2xl border border-zinc-200/80 bg-white px-5 py-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'>
        {settlements.length === 0 ? (
          <p className='text-sm text-zinc-400'>No payments needed</p>
        ) : (
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

                  <p className='flex min-w-0 items-center gap-1.5 text-sm text-zinc-600'>
                    <span className='truncate font-semibold text-zinc-800'>
                      {settlement.from.name}
                    </span>

                    <ArrowRight className='h-4 w-4 shrink-0 text-zinc-400' />

                    <span className='truncate font-semibold text-zinc-800'>
                      {settlement.to.name}
                    </span>
                  </p>
                </div>

                <span className='shrink-0 text-sm font-semibold text-zinc-900'>
                  {settlement.amount.toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
