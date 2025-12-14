'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Button from '@/components/Button';
import CycleBackground from '@/components/CycleBackground';
import { createQueryString } from '@/lib/link';

export default function UnopenedInvitationPage({
  guestName,
  id,
}: {
  guestName: string;
  id: number;
}) {
  const pathname = usePathname();

  return (
    <CycleBackground>
      <header className="flex flex-col gap-4 font-serif">
        <h2 className="font-heading text-2xl md:text-3xl">The wedding of</h2>
        <h3 className="font-cursive2 text-4xl text-secondary-main md:text-5xl">
          Karel and Sabrina
        </h3>
      </header>
      <div className="flex flex-col gap-4 font-serif">
        <h4 className="text-xl md:text-2xl">Dear Mr./Mrs./Ms.</h4>
        <h2 className="text-shadow-lg font-serif text-3xl md:text-4xl">{guestName}</h2>
      </div>
      <Link href={`${pathname}?to=${guestName}&id=${id}&${createQueryString('opened', '')}`}>
        <Button>Open invitation</Button>
      </Link>
    </CycleBackground>
  );
}
