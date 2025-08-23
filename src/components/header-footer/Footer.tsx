'use client';
import { HouseIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabBar = [
  { icon: HouseIcon, title: 'Trang chủ', to: '/' },
];

export function Footer() {
  const pathName = usePathname();
  if (pathName.includes('game') || pathName.includes('info')) {
    return null;
  }

  return (
    <footer
      className="absolute bottom-0 w-full  flex justify-center  space-x-4"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabBar.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            href={item.to}
            key={item.title}
            prefetch
            className={`flex flex-col items-center ${pathName === item.to ? '' : 'opacity-50'}`}
          >
            <Icon className="text-white " />
            <span className="text-white font-[500] text-[0.5625rem]">
              {item.title}
            </span>
          </Link>
        );
      })}
    </footer>
  );
}
