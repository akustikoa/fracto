export default function GroupHeader({ group }) {
  return (
    <div className='mt-3  '>
      <h1 className='mb-8 text-3xl font-semibold tracking-tight text-zinc-900 text-center leading-tight'
      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        
        {group.name}
      </h1>
    </div>
  );
}
