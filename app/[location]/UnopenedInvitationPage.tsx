'use client';
import Link from 'next/link';
import CycleBackground from '../components/CycleBackground';
import Button from '../components/Button';
import { usePathname } from 'next/navigation';
import { createQueryString } from '../utils/link';

export default function UnopenedInvitationPage({ guestName, id }: { guestName: string; id: number }) {
    const pathname = usePathname();

    return (
        <CycleBackground>
            <header className="font-serif flex flex-col gap-4">
                <h2 className="text-3xl font-heading">The wedding of</h2>
                <h3 className="text-5xl font-cursive2 text-secondary-main">Karel and Sabrina</h3>
            </header>
            <div className="flex flex-col gap-4 font-serif">
                <h4 className="text-2xl">Dear Mr./Mrs./Ms.</h4>
                <h2 className="text-4xl font-serif text-shadow-lg">{guestName}</h2>
            </div>
            <Link href={pathname + '?to=' + guestName + '&id=' + id + '&' + createQueryString('opened', '')}>
                <Button>Open invitation</Button>
            </Link>
        </CycleBackground>
    );
}
