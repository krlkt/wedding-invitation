import { useRouter, useSearchParams } from 'next/navigation';

import { Wish } from '@/legacy/types/wish';

import BubbleText from './BubbleText';

import './wishes.css';
import Button from '../Button';

import { useTransition } from 'react';

import FadeIn from '../FadeIn';

const Wishes = ({
  wishes,
}: {
  wishes: { wishes: Array<Wish>; wishPage: number; totalPages: number };
}) => {
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
    <FadeIn className="space-y-4">
      <div className="visible-scroll space-y-2 pl-3">
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
      <div className="flex items-center justify-between">
        <Button disabled={wishPage === 1 || isPending} onClick={() => goToPage(wishPage - 1)}>
          Previous
        </Button>
        {isPending ? (
          <span className="animate-pulse text-sm text-gray-500">Loading...</span>
        ) : (
          <span className="text-sm">
            Page {wishPage} of {totalPages}
          </span>
        )}
        <Button
          onClick={() => goToPage(wishPage + 1)}
          disabled={wishPage >= totalPages || isPending}
        >
          Next
        </Button>
      </div>
    </FadeIn>
  );
};

export default Wishes;
