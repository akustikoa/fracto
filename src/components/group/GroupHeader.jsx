export default function GroupHeader({ group }) {
  return (
    <div className='mt-4'>
      <h1 className='text-3xl font-semibold tracking-tight text-zinc-900 text-center leading-tight'>
        {group.name}
      </h1>
    </div>
  );
}
