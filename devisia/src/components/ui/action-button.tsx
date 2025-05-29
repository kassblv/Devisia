import Link from 'next/link';

interface ActionButtonProps {
  href: string;
  label: string;
  className?: string;
}

export default function ActionButton({ href, label, className }: ActionButtonProps) {
  return (
    <Link href={href}>
      <button className={'relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#C0C0C0] dark:focus:ring-[#F5F5F7] focus:ring-offset-2 focus:ring-offset-[#F5F5F7] dark:focus:ring-offset-[#1A1A1A]'}>
        <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#002147_0%,#C0C0C0_50%,#002147_100%)]' />
        <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full ${'bg-[#F5F5F7] dark:bg-[#1A1A1A]'
        } px-3 py-1 text-sm font-medium text-[#1A1A1A] dark:text-[#F5F5F7] backdrop-blur-3xl ${className || ''}`}>
          {label}
        </span>
      </button>
    </Link>
  );
}
