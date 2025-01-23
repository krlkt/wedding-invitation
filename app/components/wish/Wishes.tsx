import { Wish } from '../../models/wish';
import BubbleText from './BubbleText';

const Wishes = ({ wishes }: { wishes: Array<Wish> }) => {
    return (
        <div className="max-h-[50%] space-y-2 overflow-y-auto p-2">
            {wishes.map((wish) => (
                <BubbleText
                    key={wish.name}
                    name={wish.name}
                    message={wish.wish}
                />
            ))}
        </div>
    );
};

export default Wishes;
