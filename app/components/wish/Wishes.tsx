import { useRouter, useSearchParams } from 'next/navigation';
import { Wish } from '../../models/wish';
import BubbleText from './BubbleText';
import './wishes.css';
import Button from '../Button';
import { useTransition } from 'react';

const Wishes = ({ wishes }: { wishes: { wishes: Array<Wish>; wishPage: number; totalPages: number } }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const { wishes: wishArray, wishPage, totalPages } = wishes;

    const goToPage = (page: number) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', page.toString());
            router.replace(`?${params.toString()}`, { scroll: false });
        });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2 pl-3 visible-scroll">
                {wishArray.map((wish) => (
                    <BubbleText
                        key={wish.name + wish.created_at}
                        name={wish.name}
                        message={wish.wish}
                        createdAt={wish.created_at}
                    />
                ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center">
                <Button disabled={wishPage === 1 || isPending} onClick={() => goToPage(wishPage - 1)}>
                    Previous
                </Button>
                {isPending ? (
                    <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
                ) : (
                    <span className="text-sm">
                        Page {wishPage} of {totalPages}
                    </span>
                )}
                <Button onClick={() => goToPage(wishPage + 1)} disabled={wishPage >= totalPages || isPending}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Wishes;
