import Button from '../Button';
import { addWish } from './action';

const WishForm = () => {
    return (
        <div>
            <form action={addWish} className="flex-col flex gap-2">
                <input className="w-full" name="name" type="text" />
                <textarea className="w-full" name="wish" rows={5} />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default WishForm;
