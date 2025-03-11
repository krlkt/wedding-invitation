import { Wish } from '../../models/wish';
import BubbleText from './BubbleText';
import './wishes.css';

const Wishes = ({ wishes }: { wishes: Array<Wish> }) => {
    return (
        <div className="max-h-[60vh] space-y-2 overflow-y-auto pl-3 visible-scroll">
            {wishes.map((wish) => (
                <BubbleText key={wish.name} name={wish.name} message={wish.wish} />
            ))}
        </div>
    );
};

export default Wishes;
