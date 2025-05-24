import { useState } from 'react';
import { Wish } from '../../models/wish';
import BubbleText from './BubbleText';
import './wishes.css';

const Wishes = ({ wishes }: { wishes: Array<Wish> }) => {
    const [page, setPage] = useState<number>(1);
    const rowPerPage = 10;
    return (
        <div className="space-y-2 overflow-y-auto pl-3 visible-scroll">
            {wishes.map((wish) => (
                <BubbleText
                    key={wish.name + wish.created_at}
                    name={wish.name}
                    message={wish.wish}
                    createdAt={wish.created_at}
                />
            ))}
        </div>
    );
};

export default Wishes;
