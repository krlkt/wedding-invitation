import { RSVP } from '@/app/models/rsvp';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import { addRSVP } from './action';
import Spinner from '../Spinner';

const RSVPForm = ({ guestName, rsvp }: { guestName: string; rsvp?: RSVP }) => {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<RSVP>({
        defaultValues: {
            name: guestName,
        },
    });
    const onSubmit = async (data: any) => {
        try {
            await addRSVP(data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex-col flex gap-2 text-left">
            <input readOnly className="w-full" {...register('name', { required: true })} />
            <label htmlFor="guest_number">Number of guest&#40;s&#41;</label>
            <select
                id="guest_number"
                className="w-full"
                {...register('guest_number', { required: true })}
                defaultValue={rsvp?.guest_number ?? 1}
            >
                <option value={1}>1</option>
                <option value={2}>2</option>
            </select>
            <label htmlFor="attending">Are you attending?</label>
            <select
                id="attending"
                className="w-full"
                {...register('attend', { required: true })}
                defaultValue={rsvp?.attend ?? 'yes'}
            >
                <option value={'yes'}>Yes</option>
                <option value={'no'}>No</option>
            </select>
            <Button type="submit" disabled={isSubmitting}>
                Submit
                {isSubmitting && (
                    <div className="w-4 ml-2 inline-block">
                        <Spinner />
                    </div>
                )}
            </Button>
        </form>
    );
};

export default RSVPForm;
