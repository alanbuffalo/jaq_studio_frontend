export function PageLoader() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-app'>
      <div className='relative'>
        <div className='h-12 w-12 animate-spin rounded-full border-[3px] border-[#b9817f]/20 border-t-[#172033]' />
        <div className='absolute inset-[10px] rounded-full bg-[#b9817f]/15' />
      </div>
    </div>
  );
}

