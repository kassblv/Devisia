import Link from 'next/link';

interface ActionButtonProps {
  href: string;
  label: string;
  className?: string;
}

export default function ActionButton({ href, label, className }: ActionButtonProps) {
  return (
    <Link href={href}>
      <button className={'relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-ui-silver dark:focus:ring-ui-light-gray focus:ring-offset-2 focus:ring-offset-ui-light-gray dark:focus:ring-offset-ui-dark'}>
        <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-silver' />
        <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-ui-light-gray dark:bg-ui-dark px-3 py-1 text-sm font-medium text-ui-dark dark:text-ui-light-gray backdrop-blur-3xl ${className || ''}`}>
          {label}
        </span>
      </button>
    </Link>
  );
}
