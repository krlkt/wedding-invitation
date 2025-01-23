import { useForm } from 'react-hook-form';
import Button from '../Button';
import { addWish } from './action';

type Wish = {
    name: string;
    wish: string;
};

const WishForm = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<Wish>();
    const onSubmit = async (data: any) => {
        try {
            await addWish(data);
            reset(); // Reset the form fields after successful submission
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-col flex gap-2"
            >
                <input
                    placeholder="Name"
                    className="w-full"
                    {...register('name', { required: true })}
                    type="text"
                />
                <textarea
                    placeholder="Write your beautiful message here.."
                    className="w-full"
                    {...register('wish', { required: true })}
                    rows={4}
                />
                <Button type="submit" disabled={isSubmitting}>
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default WishForm;
