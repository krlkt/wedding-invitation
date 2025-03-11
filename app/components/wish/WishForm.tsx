import { useForm } from 'react-hook-form';
import { addWish } from './action';
import SubmitButton from '../SubmitButton';
import { useSnackbar } from 'notistack';

type Wish = {
    name: string;
    wish: string;
};

const WishForm = ({ guestName }: { guestName: string }) => {
    const { enqueueSnackbar } = useSnackbar();

    const {
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<Wish>({
        defaultValues: {
            name: guestName,
        },
    });
    const onSubmit = async (data: any) => {
        try {
            await addWish(data);
            reset(); // Reset the form fields after successful submission
            enqueueSnackbar('Thank you for your wishes! 💕', { variant: 'success' });
        } catch (error) {
            console.error('Error submitting form:', error);
            enqueueSnackbar(`Error submitting form: ${error}`, { variant: 'error' });
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-col flex gap-2">
                <input placeholder="Name" className="w-full" {...register('name', { required: true })} type="text" />
                <textarea
                    placeholder="Write your beautiful message here.."
                    className="w-full"
                    {...register('wish', { required: true })}
                    rows={4}
                />
                <SubmitButton isSubmitting={isSubmitting} />
            </form>
        </div>
    );
};

export default WishForm;
